const { Readable } = require("stream");
const Profile = require("../models/Profile");
const OneQr = require("../models/OneQr");
const cloudinary = require("../config/cloudinary");

/**
 * Helper to upload buffer streams to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, originalName, mimetype, folder = "oneqr") => {
  return new Promise((resolve, reject) => {
    // 1. Classify file type
    const isImage = mimetype && mimetype.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    // 2. Generate unique public ID (preserve extension for raw documents/PDFs)
    const uniqueId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = originalName ? originalName.substring(originalName.lastIndexOf(".")) : "";
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
    const { qrId } = req.query;
    let profile = null;

    if (qrId) {
      profile = await Profile.findOne({ user: req.user.id, slug: qrId.trim() });
      if (!profile) {
        const templateProfile = await Profile.findOne({ user: req.user.id });
        if (templateProfile) {
          const rawTemplate = templateProfile.toObject();
          delete rawTemplate._id;
          delete rawTemplate.createdAt;
          delete rawTemplate.updatedAt;
          
          profile = {
            ...rawTemplate,
            slug: qrId.trim(),
            qrUrl: `https://oneqr.dtechcode.in/${qrId.trim()}`,
          };
        }
      }
    } else {
      profile = await Profile.findOne({ user: req.user.id });
    }

    if (!profile) {
      return res.json({
        status: "success",
        data: {
          profile: {
            profileLogo: "",
            qrUrl: qrId ? `https://oneqr.dtechcode.in/${qrId.trim()}` : "https://oneqr.co/user/profile",
            qrColor: "000000",
            profileCompany: "",
            profileName: "",
            profileTitle: "",

            profileAddress: "",
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
            socialOrder: ['facebook', 'google', 'instagram', 'youtube', 'linkedin', 'x', 'whatsapp', 'upi'],
            customLinks: [],
            profileDocuments: [],
            headerColor: "gradient",
            slug: qrId ? qrId.trim() : "",
          },
        },
      });
    }

    res.json({
      status: "success",
      data: { profile },
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
    const { slug } = req.body;
    let targetSlug = slug;
    
    if (!targetSlug) {
      const companyName = req.body.profileCompany || req.body.profileName || "demo-profile";
      targetSlug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const profileData = {
      ...req.body,
      user: req.user.id,
      slug: targetSlug,
    };

    const query = slug ? { user: req.user.id, slug: slug } : { user: req.user.id };

    const profile = await Profile.findOneAndUpdate(
      query,
      profileData,
      { upsert: true, new: true, runValidators: true }
    );

    // Synchronize OneQr collection redirect destination if this profile belongs to a specific slug/qrId
    if (targetSlug) {
      await OneQr.findOneAndUpdate(
        { qrId: targetSlug },
        { qrUrl: req.body.qrUrl || `https://oneqr.dtechcode.in/${targetSlug}` }
      );
    }

    res.json({
      status: "success",
      message: "Profile saved successfully",
      data: { profile },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Uploads a file buffer directly to Cloudinary
 */
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
      
      // If assigned, find the profile linked to this user and QR ID
      let profile = await Profile.findOne({ user: qr.assignedTo, slug: requestedSlug });
      if (!profile) {
        // Fallback to any profile for this user
        profile = await Profile.findOne({ user: qr.assignedTo });
      }
      
      if (profile) {
        return res.json({
          status: "success",
          data: { profile },
        });
      }
    }
    
    // 2. Otherwise, look up profile by slug or company name slug directly
    let profile = await Profile.findOne({ slug: requestedSlug });
    
    // Fallback for older profiles that don't have a slug saved in the database
    if (!profile) {
      const allProfiles = await Profile.find({});
      profile = allProfiles.find(p => {
        const companyName = p.profileCompany || p.profileName || "demo-profile";
        const generatedSlug = companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return generatedSlug === requestedSlug;
      });
    }

    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found",
      });
    }

    res.json({
      status: "success",
      data: { profile },
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

    // Also link user's profile to this QR's ID/slug if user doesn't have a profile yet or needs updating
    let profile = await Profile.findOne({ user: req.user.id });
    const targetQrUrl = `https://oneqr.dtechcode.in/${qr.qrId}`;
    
    if (profile) {
      profile.slug = qr.qrId;
      profile.qrUrl = targetQrUrl;
      await profile.save();
    } else {
      await Profile.create({
        user: req.user.id,
        slug: qr.qrId,
        qrUrl: targetQrUrl,
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

