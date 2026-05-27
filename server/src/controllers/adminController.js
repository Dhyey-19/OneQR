const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Profile = require("../models/Profile");
const OneQr = require("../models/OneQr");

/**
 * Generates a signed JWT for a given admin ID
 */
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

/**
 * Helper to generate a random unique ID
 */
const generateRandomId = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * @desc    Authenticate admin and return JWT
 * @route   POST /api/admin/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide mobile number and password.",
      });
    }

    // Find the admin
    const admin = await Admin.findOne({ phone });
    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: "Admin account not found with this mobile number.",
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Incorrect password. Please try again.",
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    return res.status(200).json({
      status: "success",
      message: "Admin login successful! Welcome to the Admin Dashboard.",
      data: {
        admin: {
          id: admin._id,
          phone: admin.phone,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred during admin login.",
    });
  }
};

/**
 * @desc    Get currently logged-in admin details
 * @route   GET /api/admin/auth/me
 * @access  Private (Admin)
 */
exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      status: "success",
      data: {
        admin: {
          id: req.admin._id,
          phone: req.admin.phone,
        },
      },
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching admin details.",
    });
  }
};

/**
 * @desc    Get dashboard statistics for admin homepage
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalQrs = await OneQr.countDocuments();
    const assignedQrs = await OneQr.countDocuments({ assignedTo: { $ne: null } });

    // Plan distributions
    const planCounts = await User.aggregate([
      { $group: { _id: "$plan", count: { $sum: 1 } } }
    ]);

    const stats = {
      totalUsers,
      totalProfiles,
      totalQrs,
      assignedQrs,
      plans: {
        free: 0,
        starter_monthly: 0,
        starter_yearly: 0,
        pro_monthly: 0,
        pro_yearly: 0,
      },
    };

    planCounts.forEach((item) => {
      if (item._id && stats.plans[item._id] !== undefined) {
        stats.plans[item._id] = item.count;
      }
    });

    return res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching dashboard statistics.",
    });
  }
};

/**
 * @desc    Get list of all users and their profiles
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    // Map profiles count for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profileCount = await Profile.countDocuments({ user: user._id });
        return {
          id: user._id,
          phone: user.phone,
          plan: user.plan,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionExpiresAt: user.subscriptionExpiresAt,
          createdAt: user.createdAt,
          profilesCount: profileCount,
        };
      })
    );

    return res.status(200).json({
      status: "success",
      data: usersWithProfiles,
    });
  } catch (error) {
    console.error("Get admin users list error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching user list.",
    });
  }
};

/**
 * @desc    Get list of all generated QR codes
 * @route   GET /api/admin/qrs
 * @access  Private (Admin)
 */
exports.getQrCodes = async (req, res) => {
  try {
    const qrs = await OneQr.find()
      .populate("assignedTo", "phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: qrs,
    });
  } catch (error) {
    console.error("Get admin QR codes error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching QR codes list.",
    });
  }
};

/**
 * @desc    Generate a new unique QR code
 * @route   POST /api/admin/qrs/generate
 * @access  Private (Admin)
 */
exports.generateQrCode = async (req, res) => {
  try {
    let qrId;
    let unique = false;
    let attempt = 0;

    while (!unique && attempt < 100) {
      qrId = generateRandomId(8);
      const exists = await OneQr.findOne({ qrId });
      if (!exists) {
        unique = true;
      }
      attempt++;
    }

    if (!unique) {
      return res.status(500).json({
        status: "error",
        message: "Failed to generate a unique QR code ID. Please try again.",
      });
    }

    // User requested QR URL format: oneqr.dtechcode.in/{qrId}
    const qrUrl = `https://oneqr.dtechcode.in/${qrId}`;

    const newQr = new OneQr({
      qrId,
      qrUrl,
    });

    await newQr.save();

    return res.status(201).json({
      status: "success",
      message: "Unique QR code generated successfully!",
      data: newQr,
    });
  } catch (error) {
    console.error("Generate QR code error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while generating QR code.",
    });
  }
};

/**
 * @desc    Assign a QR code to a user
 * @route   POST /api/admin/qrs/assign
 * @access  Private (Admin)
 */
exports.assignQrCode = async (req, res) => {
  try {
    const { qrId, userId } = req.body;

    if (!qrId || !userId) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both qrId and userId.",
      });
    }

    // 1. Verify User exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    // 2. Verify QR exists
    const qr = await OneQr.findOne({ qrId });
    if (!qr) {
      return res.status(404).json({
        status: "error",
        message: "QR code not found.",
      });
    }

    // 3. Assign QR to User
    qr.assignedTo = userId;
    await qr.save();

    // 4. Upsert User's Profile
    // Connects QR to profile using the qrId as the slug and qrUrl as target
    const targetQrUrl = `https://oneqr.dtechcode.in/${qrId}`;
    
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      profile.slug = qrId;
      profile.qrUrl = targetQrUrl;
      await profile.save();
    } else {
      profile = new Profile({
        user: userId,
        slug: qrId,
        qrUrl: targetQrUrl,
        profilePhone: user.phone || "",
      });
      await profile.save();
    }

    return res.status(200).json({
      status: "success",
      message: `QR Code successfully assigned to user ${user.phone}!`,
      data: {
        qr,
        profile,
      },
    });
  } catch (error) {
    console.error("Assign QR code error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while assigning QR code.",
    });
  }
};
