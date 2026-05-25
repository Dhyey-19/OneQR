const { Readable } = require("stream");
const Profile = require("../models/Profile");
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
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return res.json({
        status: "success",
        data: {
          profile: {

            profileLogo: "",
            qrUrl: "https://oneqr.co/user/profile",
            qrColor: "000000",
            profileCompany: "",
            profileName: "",
            profileTitle: "",

            profileAddress: "",
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
    const companyName = req.body.profileCompany || req.body.profileName || "demo-profile";
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const profileData = {
      ...req.body,
      user: req.user.id,
      slug: slug,
    };

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      profileData,
      { upsert: true, new: true, runValidators: true }
    );

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

/**
 * Retrieves a public profile by its slug.
 */
exports.getPublicProfile = async (req, res, next) => {
  try {
    const requestedSlug = req.params.slug;
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
