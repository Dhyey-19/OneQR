const { Readable } = require("stream");
const Profile = require("../models/Profile");
const OneQr = require("../models/OneQr");
const cloudinary = require("../config/cloudinary");
const config = require("../config/config");

const generateUniqueProfileSlug = async () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let attempt = 0;
  while (attempt < 100) {
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const existsProfile = await Profile.findOne({ slug: result });
    const existsQr = await OneQr.findOne({ qrId: result });
    if (!existsProfile && !existsQr) {
      return result;
    }
    attempt++;
  }
  return `profile_${Date.now()}`;
};

const qrUrlPrefix = config.QR_URL_PREFIX;

/**
 * Helper to upload buffer streams to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, originalName, mimetype, folder = "oneqr") => {
  return new Promise((resolve, reject) => {
    // 1. Classify file type
    const isImage = mimetype && mimetype.startsWith("image/");
    // We treat PDFs as 'image' as well so Cloudinary can generate thumbnails/previews if needed, or 'raw' if prefered.
    // Cloudinary recommends 'image' for PDF if we want it to be viewable or transformable.
    const isPdf = mimetype === "application/pdf" || (originalName && originalName.toLowerCase().endsWith(".pdf"));
    const resourceType = (isImage || isPdf) ? "image" : "raw";

    // 2. Generate unique public ID (preserve extension for raw documents/PDFs)
    const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = originalName ? originalName.substring(originalName.lastIndexOf(".")) : "";
    
    // For PDFs uploaded as 'image', we typically don't need the extension in public_id, but keeping it is fine.
    // For 'raw', it's mandatory.
    const publicId = resourceType === "raw" ? `${uniqueId}${extension}` : uniqueId;

    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: folder, 
        resource_type: resourceType,
        public_id: publicId
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    
    const readableStream = new Readable();
    readableStream._read = () => {}; // No-op for Readable
    readableStream.push(fileBuffer);
    readableStream.push(null);
    readableStream.pipe(stream);
  });
};

/**
 * Retrieves the current user's profile details.
 * If not found, returns default fields.
 */
exports.getProfile = async (req, res, next) => {
  try {
    const { qrId, profileId } = req.query;
    let profile = null;

    if (profileId) {
      profile = await Profile.findOne({ user: req.user.id, _id: profileId });
    } else if (qrId) {
      profile = await Profile.findOne({ user: req.user.id, slug: qrId.trim() });
    } else {
      profile = await Profile.findOne({ user: req.user.id });
    }

    if (!profile) {
      return res.json({
        status: "success",
        data: {
          profile: {
            profileLogo: "",
            qrUrl: qrId ? `${qrUrlPrefix}/${qrId.trim()}` : "https://oneqr.co/user/profile",
            qrColor: "000000",
            profileCompany: "",
            profileName: "",
            profileTitle: "",

            profileAddress: "",
            profileGst: "",
            profileMapUrl: "",
            profileTimings: "",
            profileBio: "",
            profileEmail: "",
            profilePhone: req.user.phone || "",
            profileWebsite: "",
            socialFacebook: "",
            socialGoogle: "",
            socialInstagram: "",
            socialYoutube: "",
            socialLinkedin: "",
            socialX: "",
            socialWhatsapp: "",
            socialUPI: "",
            socialOrder: ['whatsapp', 'instagram', 'google', 'facebook', 'youtube', 'linkedin', 'x', 'upi'],
            bankUpiId: "",
            bankName: "",
            bankAccountNo: "",
            bankIfsc: "",
            bankAccountName: "",
            customLinks: [],
            profileDocuments: [],
            headerColor: "gradient",
            slug: qrId ? qrId.trim() : "",
          },
        },
      });
    }

    const profileObj = profile.toObject();
    if (profile.qrId) {
      const qr = await OneQr.findOne({ qrId: profile.qrId });
      profileObj.qrScanCount = qr ? (qr.qrScanCount || 0) : 0;
    } else {
      profileObj.qrScanCount = 0;
    }

    res.json({
      status: "success",
      data: { profile: profileObj },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Saves/updates user's profile details in MongoDB.
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { profileId, slug } = req.body;
    
    // Build update payload
    const profileData = {
      ...req.body,
      user: req.user.id,
    };

    // Remove _id/profileId from payload to avoid immutable field error
    delete profileData.profileId;
    delete profileData._id;

    // Handle slug generation if not provided (or update it if business name changed)
    if (!profileData.slug || profileData.slug.trim() === '') {
      const companyName = req.body.profileCompany || req.body.profileName || "demo-profile";
      profileData.slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    } else {
      profileData.slug = profileData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Uniqueness Check for slug
    const existingSlug = await Profile.findOne({ slug: profileData.slug });
    if (existingSlug) {
      if (profileId && existingSlug._id.toString() !== profileId) {
         return res.status(400).json({ status: "error", message: "This Profile URL / Business Name is already taken by another user." });
      }
      if (!profileId) {
         return res.status(400).json({ status: "error", message: "This Profile URL / Business Name is already taken by another user." });
      }
    }

    let query = {};
    if (profileId) {
      query = { _id: profileId, user: req.user.id };
    } else if (slug) {
      query = { slug: slug.trim(), user: req.user.id };
    } else {
      query = { user: req.user.id };
    }

    const profile = await Profile.findOneAndUpdate(
      query,
      { $set: profileData },
      { upsert: true, new: true, runValidators: true }
    );

    const profileObj = profile.toObject();
    if (profile.qrId) {
      const qr = await OneQr.findOne({ qrId: profile.qrId });
      profileObj.qrScanCount = qr ? (qr.qrScanCount || 0) : 0;
    } else {
      profileObj.qrScanCount = 0;
    }

    res.json({
      status: "success",
      message: "Profile saved successfully",
      data: { profile: profileObj },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Uploads a file buffer directly to Cloudinary
 */
exports.deleteFile = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url || !url.includes("cloudinary.com")) {
      return res.status(400).json({ status: "error", message: "Invalid Cloudinary URL" });
    }

    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    if (uploadIndex === -1) {
      return res.status(400).json({ status: "error", message: "Malformed Cloudinary URL" });
    }
    
    let publicIdPart = urlParts.slice(uploadIndex + 1);
    if (publicIdPart[0].startsWith("v") && !isNaN(publicIdPart[0].substring(1))) {
      publicIdPart = publicIdPart.slice(1);
    }
    
    let publicId = publicIdPart.join("/");
    const extIndex = publicId.lastIndexOf(".");
    if (extIndex !== -1) {
      publicId = publicId.substring(0, extIndex);
    }

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    if (result.result !== "ok" && result.result !== "not found") {
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    }

    res.json({ status: "success", message: "File deleted successfully from Cloudinary." });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the file.",
      error: error.message,
    });
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No file attachment found in the request.",
      });
    }

    // Upload using Cloudinary stream with mimetype check
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      status: "success",
      message: "File uploaded successfully to Cloudinary.",
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      },
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Failed to upload file to Cloudinary.",
    });
  }
};

exports.getPublicProfile = async (req, res, next) => {
  try {
    const requestedSlug = req.params.slug.trim();
    
    // 1. Check if the requested slug exists as a QR ID in the ONEQRS collection
    const qr = await OneQr.findOne({ qrId: requestedSlug });
    if (qr) {
      // If it exists in ONEQRS, check if it's assigned/activated
      if (!qr.assignedTo) {
        return res.json({
          status: "inactive",
          message: "This QR Code is not activated yet.",
        });
      }

      // Check if plan is active (if not on free plan)
      if (qr.plan && qr.plan !== 'free' && qr.subscriptionStatus !== 'active') {
        return res.json({
          status: "expired",
          message: "This QR Code's premium subscription is expired or inactive.",
        });
      }
      
      // If assigned, find the profile linked to this user and QR ID
      let profile = await Profile.findOne({ user: qr.assignedTo, qrId: requestedSlug }).populate("selectedFeedbacks");
      if (!profile) {
        profile = await Profile.findOne({ user: qr.assignedTo, slug: requestedSlug.toLowerCase() }).populate("selectedFeedbacks");
      }
      if (!profile) {
        // Fallback to any profile for this user
        profile = await Profile.findOne({ user: qr.assignedTo }).populate("selectedFeedbacks");
      }
      
      if (profile) {
        if (requestedSlug === qr.qrId && profile.slug && profile.slug !== requestedSlug) {
          // Client will navigate to the profile slug and query the public endpoint again.
          // The direct slug query will increment the profileViewCount, so we just redirect now.
          return res.json({
            status: "redirect",
            slug: profile.slug,
          });
        }

        // Direct scan without redirect (e.g. slug is the same as qrId or not set)
        profile.profileViewCount = (profile.profileViewCount || 0) + 1;
        await profile.save();

        const profileObj = profile.toObject();
        profileObj.qrScanCount = qr.qrScanCount;

        return res.json({
          status: "success",
          data: { profile: profileObj },
        });
      }
    }
    
    // 2. Otherwise, look up profile by slug or company name slug directly
    let profile = await Profile.findOne({ slug: requestedSlug.toLowerCase() }).populate("selectedFeedbacks");
    
    // Fallback for older profiles that don't have a slug saved in the database
    if (!profile) {
      const allProfiles = await Profile.find({}).populate("selectedFeedbacks");
      profile = allProfiles.find(p => {
        const companyName = p.profileCompany || p.profileName || "demo-profile";
        const generatedSlug = companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return generatedSlug === requestedSlug.toLowerCase();
      });
    }

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    // Increment profileViewCount
    profile.profileViewCount = (profile.profileViewCount || 0) + 1;
    await profile.save();

    const profileObj = profile.toObject();
    if (profile.qrId) {
      const relatedQr = await OneQr.findOne({ qrId: profile.qrId });
      profileObj.qrScanCount = relatedQr ? (relatedQr.qrScanCount || 0) : 0;
    } else {
      profileObj.qrScanCount = 0;
    }

    res.json({
      status: "success",
      data: { profile: profileObj },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all QR codes assigned to the logged-in user.
 */
exports.getUserQrCodes = async (req, res, next) => {
  try {
    const qrs = await OneQr.find({ assignedTo: req.user.id });
    res.json({
      status: "success",
      data: { qrs },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Claims / allocates a QR code to the logged-in user.
 */
exports.claimQrCode = async (req, res, next) => {
  try {
    const { qrId } = req.body;
    if (!qrId) {
      return res.status(400).json({
        status: "error",
        message: "QR ID is required."
      });
    }

    // Find the QR Code in ONEQRS collection
    const qr = await OneQr.findOne({ qrId: qrId.trim() });
    
    if (!qr) {
      return res.status(404).json({
        status: "error",
        message: "Invalid QR Code ID. Please check the QR code or try again."
      });
    }

    // Check if it is already allocated to someone
    if (qr.assignedTo) {
      if (qr.assignedTo.toString() === req.user.id.toString()) {
        return res.status(400).json({
          status: "error",
          message: "This QR Code is already allocated to your workspace."
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "This QR Code is already allocated to another user."
        });
      }
    }

    // Allocate it to the logged-in user!
    qr.assignedTo = req.user.id;
    await qr.save();

    // Link user's profile to this QR's ID/slug
    let profile = await Profile.findOne({ user: req.user.id, qrId: qr.qrId });
    if (!profile) {
      profile = await Profile.findOne({ user: req.user.id, slug: qr.qrId });
    }
    if (!profile) {
      profile = await Profile.findOne({ user: req.user.id });
    }
    
    if (profile) {
      profile.qrId = qr.qrId;
      profile.isStandyConnected = true;
      await profile.save();
    } else {
      const profileSlug = await generateUniqueProfileSlug();
      await Profile.create({
        user: req.user.id,
        slug: profileSlug,
        qrId: qr.qrId,
        isStandyConnected: true,
        profilePhone: req.user.phone || "",
      });
    }

    res.json({
      status: "success",
      message: "QR Code successfully allocated to your workspace!",
      data: { qr }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Scans, verifies, and allocates a QR code to the logged-in user if unassigned.
 */
exports.scanAndAssignQrCode = async (req, res, next) => {
  try {
    const { qrId } = req.body;
    if (!qrId) {
      return res.status(400).json({
        status: "error",
        message: "QR ID is required."
      });
    }

    const cleanQrId = qrId.trim();

    // Find the QR Code in ONEQRS collection
    const qr = await OneQr.findOne({ qrId: cleanQrId });

    if (!qr) {
      return res.json({
        status: "not_found",
        message: "Invalid QR Code ID. Please check the QR code or try again."
      });
    }

    // Check if it is already allocated to someone
    if (qr.assignedTo) {
      if (qr.assignedTo.toString() === req.user.id.toString()) {
        return res.json({
          status: "already_assigned_to_me",
          message: "This QR Code is already allocated to your workspace.",
          data: { qr }
        });
      } else {
        return res.json({
          status: "already_assigned_to_other",
          message: "This QR Code is already allocated to another owner. Please scan your own QR."
        });
      }
    }

    // Allocate it to the logged-in user!
    qr.assignedTo = req.user.id;
    await qr.save();

    // Link user's profile to this QR's ID/slug
    let profile = await Profile.findOne({ user: req.user.id, qrId: qr.qrId });
    if (!profile) {
      profile = await Profile.findOne({ user: req.user.id, slug: qr.qrId });
    }
    if (!profile) {
      profile = await Profile.findOne({ user: req.user.id });
    }
    
    if (profile) {
      profile.qrId = qr.qrId;
      profile.isStandyConnected = true;
      await profile.save();
    } else {
      const profileSlug = await generateUniqueProfileSlug();
      await Profile.create({
        user: req.user.id,
        slug: profileSlug,
        qrId: qr.qrId,
        isStandyConnected: true,
        profilePhone: req.user.phone || "",
      });
    }

    res.json({
      status: "assigned_now",
      message: "your qr is live and link with this property",
      data: { qr }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all profiles for the logged-in user that are either free or have active subscription status.
 */
exports.getAllProfiles = async (req, res, next) => {
  try {
    const profiles = await Profile.find({
      user: req.user.id,
      $or: [
        { plan: "free" },
        { subscriptionStatus: "active" }
      ]
    });
    
    const profilesWithQrScans = await Promise.all(
      profiles.map(async (profile) => {
        const profileObj = profile.toObject();
        if (profile.qrId) {
          const qr = await OneQr.findOne({ qrId: profile.qrId });
          profileObj.qrScanCount = qr ? (qr.qrScanCount || 0) : 0;
        } else {
          profileObj.qrScanCount = 0;
        }
        return profileObj;
      })
    );
    
    res.json({
      status: "success",
      data: { profiles: profilesWithQrScans },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Connects an unallocated or owned QR code/Standy to a specific profile slot.
 */
exports.connectStandy = async (req, res, next) => {
  try {
    const { profileId, qrId } = req.body;
    if (!profileId || !qrId) {
      return res.status(400).json({
        status: "error",
        message: "Profile ID and Standy QR ID are required."
      });
    }

    const cleanQrId = qrId.trim();

    // 1. Verify that the QR code exists in the ONEQRS collection
    const qr = await OneQr.findOne({ qrId: cleanQrId });
    if (!qr) {
      return res.status(404).json({
        status: "error",
        message: "Invalid Standy QR ID. Please verify the code on your physical standy."
      });
    }

    // 2. Check if the QR code is already assigned to someone else
    if (qr.assignedTo && qr.assignedTo.toString() !== req.user.id.toString()) {
      return res.status(400).json({
        status: "error",
        message: "This Standy is already registered to another user."
      });
    }

    // 3. Find the profile
    const profile = await Profile.findOne({ _id: profileId, user: req.user.id });
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile slot not found or unauthorized."
      });
    }

    // 4. Check if the QR code is already connected to another profile of the same user
    const existingProfileWithQr = await Profile.findOne({ qrId: cleanQrId });
    if (existingProfileWithQr && existingProfileWithQr._id.toString() !== profileId.toString()) {
      return res.status(400).json({
        status: "error",
        message: "This Standy is already connected to another profile in your account."
      });
    }

    // 5. Connect the QR code to the profile
    profile.qrId = cleanQrId;
    profile.isStandyConnected = true;
    await profile.save();

    // 6. Update the OneQr record to align with the profile's plan and status
    qr.assignedTo = req.user.id;
    qr.plan = profile.plan;
    qr.subscriptionStatus = profile.subscriptionStatus;
    await qr.save();

    res.json({
      status: "success",
      message: "Standy successfully connected to this profile!",
      data: { profile, qr }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Redirects to the frontend page for a given QR ID, incrementing its scan count.
 */
exports.handleQrRedirect = async (req, res, next) => {
  try {
    const { qrId } = req.params;
    const cleanQrId = qrId ? qrId.trim() : "";
    
    if (!cleanQrId) {
      return res.redirect(config.QR_URL_PREFIX);
    }

    // 1. Find the QR Code in ONEQRS collection
    const qr = await OneQr.findOne({ qrId: cleanQrId });
    if (qr) {
      // Increment qrScanCount
      qr.qrScanCount = (qr.qrScanCount || 0) + 1;
      await qr.save();

      // Find the associated profile to see if there is a custom slug
      const profile = await Profile.findOne({ qrId: cleanQrId });
      const targetSlug = profile && profile.slug ? profile.slug : cleanQrId;

      return res.redirect(`${config.QR_URL_PREFIX}/${targetSlug}`);
    }

    // 2. Otherwise, check if it's a profile slug directly
    const profileBySlug = await Profile.findOne({ slug: cleanQrId.toLowerCase() });
    if (profileBySlug) {
      // Increment profileViewCount
      profileBySlug.profileViewCount = (profileBySlug.profileViewCount || 0) + 1;
      await profileBySlug.save();

      return res.redirect(`${config.QR_URL_PREFIX}/${profileBySlug.slug}`);
    }

    // 3. Fallback: redirect to frontend with the qrId so frontend shows 404/not found
    return res.redirect(`${config.QR_URL_PREFIX}/${cleanQrId}`);
  } catch (error) {
    next(error);
  }
};



