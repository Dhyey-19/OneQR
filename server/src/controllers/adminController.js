const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Profile = require("../models/Profile");
const OneQr = require("../models/OneQr");

const qrUrlPrefix = config.QR_URL_PREFIX;

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
    const activeSubscriptions = await OneQr.countDocuments({ subscriptionStatus: "active" });

    // Plan distributions
    const planCounts = await OneQr.aggregate([
      { $group: { _id: "$plan", count: { $sum: 1 } } }
    ]);

    const stats = {
      totalUsers,
      totalProfiles,
      totalQrs,
      assignedQrs,
      activeSubscriptions,
      plans: {
        free: 0,
        basic: 0,
        premium: 0,
        enterprise: 0,
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

    const newQr = new OneQr({
      qrId,
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
    const { qrId, userId, planId } = req.body;

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

    // 4. Assign Plan if provided
    if (planId) {
      const validPlans = ['free', 'basic', 'premium', 'enterprise'];
      if (validPlans.includes(planId)) {
        const planNames = {
          basic: "Basic Plan",
          premium: "Premium Plan",
          enterprise: "Enterprise Plan",
        };

        if (planId === 'free') {
          qr.plan = 'free';
          qr.subscriptionStatus = 'inactive';
          qr.subscriptionExpiresAt = null;
          qr.planAssignedByAdmin = false;
        } else {
          qr.plan = planId;
          qr.subscriptionStatus = 'active';
          qr.subscriptionExpiresAt = null;
          qr.planAssignedByAdmin = true;
        }

        // Add to user order history if plan changed
        if (!user.orderHistory) {
          user.orderHistory = [];
        }
        user.orderHistory.push({
          orderId: `admin_assign_${Date.now()}`,
          paymentId: `admin_pay_${Date.now()}`,
          planId: planId,
          planName: planId === 'free' ? "Free Plan reset" : `${planNames[planId]} (QR: ${qr.qrId})`,
          amount: 0,
          status: "success",
          paidAt: new Date(),
        });
        await user.save();
      }
    }

    await qr.save();

    // 5. Upsert User's Profile
    let profile = await Profile.findOne({ user: userId });
    if (profile) {
      profile.slug = qrId;
      await profile.save();
    } else {
      profile = new Profile({
        user: userId,
        slug: qrId,
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

/**
 * @desc    Delete a specific QR code
 * @route   DELETE /api/admin/qrs/:id
 * @access  Private (Admin)
 */
exports.deleteQrCode = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await OneQr.findById(id);
    if (!qr) {
      return res.status(404).json({
        status: "error",
        message: "QR code not found.",
      });
    }
    
    // Unlink from user profile if matched
    if (qr.assignedTo) {
      const profile = await Profile.findOne({ user: qr.assignedTo, slug: qr.qrId });
      if (profile) {
        profile.slug = null;
        profile.qrUrl = null;
        await profile.save();
      }
    }

    await OneQr.findByIdAndDelete(id);

    return res.status(200).json({
      status: "success",
      message: "QR code successfully deleted.",
    });
  } catch (error) {
    console.error("Delete QR code error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while deleting QR code.",
    });
  }
};

/**
 * @desc    Delete all generated QR codes
 * @route   DELETE /api/admin/qrs
 * @access  Private (Admin)
 */
exports.deleteAllQrCodes = async (req, res) => {
  try {
    // Reset all profiles linked to QR codes by nullifying slug
    await Profile.updateMany({}, { $set: { slug: null } });
    
    // Delete all QR codes
    await OneQr.deleteMany({});

    return res.status(200).json({
      status: "success",
      message: "All QR codes successfully deleted.",
    });
  } catch (error) {
    console.error("Delete all QR codes error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while deleting all QR codes.",
    });
  }
};

/**
 * @desc    Assign a subscription plan to a user
 * @route   POST /api/admin/users/assign-plan
 * @access  Private (Admin)
 */
exports.assignPlan = async (req, res) => {
  try {
    const { qrId, planId } = req.body;

    if (!qrId || !planId) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both qrId and planId.",
      });
    }

    const validPlans = ['free', 'basic', 'premium', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan selection.",
      });
    }

    // 1. Verify QR exists
    let qr = null;
    if (qrId.match(/^[0-9a-fA-F]{24}$/)) {
      qr = await OneQr.findById(qrId);
    }
    if (!qr) {
      qr = await OneQr.findOne({ qrId });
    }

    if (!qr) {
      return res.status(404).json({
        status: "error",
        message: "QR code not found.",
      });
    }

    const planNames = {
      basic: "Basic Plan",
      premium: "Premium Plan",
      enterprise: "Enterprise Plan",
    };

    // 2. Set plan details
    if (planId === 'free') {
      qr.plan = 'free';
      qr.subscriptionStatus = 'inactive';
      qr.subscriptionExpiresAt = null;
      qr.planAssignedByAdmin = false;
    } else {
      qr.plan = planId;
      qr.subscriptionStatus = 'active';
      qr.subscriptionExpiresAt = null;
      qr.planAssignedByAdmin = true;
    }

    await qr.save();

    // 3. Add to user order history if QR is assigned to a user
    if (qr.assignedTo) {
      const user = await User.findById(qr.assignedTo);
      if (user) {
        if (!user.orderHistory) {
          user.orderHistory = [];
        }
        user.orderHistory.push({
          orderId: `admin_assign_${Date.now()}`,
          paymentId: `admin_pay_${Date.now()}`,
          planId: planId,
          planName: planId === 'free' ? "Free Plan reset" : `${planNames[planId]} (QR: ${qr.qrId})`,
          amount: 0,
          status: "success",
          paidAt: new Date(),
        });
        await user.save();
      }
    }

    return res.status(200).json({
      status: "success",
      message: `Plan successfully updated for QR code ${qr.qrId}!`,
      data: {
        qrId: qr.qrId,
        plan: qr.plan,
        subscriptionStatus: qr.subscriptionStatus,
        subscriptionExpiresAt: qr.subscriptionExpiresAt,
      },
    });
  } catch (error) {
    console.error("Assign plan error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while assigning plan.",
    });
  }
};

/**
 * @desc    Create a new user manually
 * @route   POST /api/admin/users
 * @access  Private (Admin)
 */
exports.createUser = async (req, res) => {
  try {
    const { phone, password, email } = req.body;

    // 1. Validation
    if (!phone || !password) {
      return res.status(400).json({
        status: "error",
        message: "Mobile number and password are required.",
      });
    }

    if (phone.trim().length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Phone number must be at least 8 characters long.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 6 characters long.",
      });
    }

    // 2. Check duplicate phone
    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return res.status(400).json({
        status: "error",
        message: "A user with this mobile number already exists.",
      });
    }

    // 3. Check duplicate email (if provided)
    if (email && email.trim()) {
      const existingEmail = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({
          status: "error",
          message: "A user with this email address already exists.",
        });
      }
    }

    // 4. Create and save user
    const newUser = new User({
      phone: phone.trim(),
      password,
      email: email && email.trim() ? email.trim().toLowerCase() : undefined,
    });

    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User account created successfully.",
      data: {
        id: newUser._id,
        phone: newUser.phone,
        email: newUser.email || null,
        createdAt: newUser.createdAt,
        profilesCount: 0,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message || "Server error occurred while creating user.",
    });
  }
};

/**
 * @desc    Get all profiles for a specific user
 * @route   GET /api/admin/users/:userId/profiles
 * @access  Private (Admin)
 */
exports.getUserProfiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found.",
      });
    }

    const profiles = await Profile.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "success",
      data: profiles,
    });
  } catch (error) {
    console.error("Get user profiles error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while fetching user profiles.",
    });
  }
};

/**
 * @desc    Assign a plan directly to a user (creating a profile slot without a QR)
 * @route   POST /api/admin/users/assign-plan
 * @access  Private (Admin)
 */
exports.assignPlanToUser = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both userId and planId.",
      });
    }

    const validPlans = ['free', 'basic', 'premium', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan selection.",
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

    // 2. Create a new Profile slot for the user
    const profileSlug = await generateUniqueProfileSlug();
    const newProfile = new Profile({
      user: userId,
      plan: planId,
      subscriptionStatus: planId === 'free' ? 'inactive' : 'active',
      subscriptionExpiresAt: null,
      slug: profileSlug,
      isStandyConnected: false,
      profilePhone: user.phone || "",
    });

    await newProfile.save();

    // 3. Add to user order history
    const planNames = {
      basic: "Basic Plan",
      premium: "Premium Plan",
      enterprise: "Enterprise Plan",
    };

    if (!user.orderHistory) {
      user.orderHistory = [];
    }
    user.orderHistory.push({
      orderId: `admin_assign_${Date.now()}`,
      paymentId: `admin_pay_${Date.now()}`,
      planId: planId,
      planName: planId === 'free' ? "Free Plan slot (Admin Assigned)" : `${planNames[planId]} (Admin Assigned)`,
      amount: 0,
      status: "success",
      paidAt: new Date(),
    });
    await user.save();

    return res.status(200).json({
      status: "success",
      message: `Plan successfully assigned to user ${user.phone}!`,
      data: newProfile,
    });
  } catch (error) {
    console.error("Assign plan to user error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while assigning plan to user.",
    });
  }
};

/**
 * @desc    Connect a physical QR/Standy code to an existing profile slot
 * @route   POST /api/admin/profiles/connect-qr
 * @access  Private (Admin)
 */
exports.connectQrToProfile = async (req, res) => {
  try {
    const { profileId, qrId } = req.body;

    if (!profileId || !qrId) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both profileId and qrId.",
      });
    }

    const cleanQrId = qrId.trim();

    // 1. Verify that the QR code exists in the ONEQRS collection
    const qr = await OneQr.findOne({ qrId: cleanQrId });
    if (!qr) {
      return res.status(404).json({
        status: "error",
        message: "QR Code ID not found. Make sure it is generated first.",
      });
    }

    // 2. Find the profile
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile slot not found.",
      });
    }

    // 3. Check if the QR code is already assigned to someone else
    if (qr.assignedTo && qr.assignedTo.toString() !== profile.user.toString()) {
      return res.status(400).json({
        status: "error",
        message: "This QR Code is already assigned to another user.",
      });
    }

    // 4. Check if the QR code is already connected to another profile
    const existingProfileWithQr = await Profile.findOne({ slug: cleanQrId });
    if (existingProfileWithQr && existingProfileWithQr._id.toString() !== profileId.toString()) {
      return res.status(400).json({
        status: "error",
        message: "This QR Code is already connected to another profile.",
      });
    }

    // 5. Connect the QR code to the profile
    profile.slug = cleanQrId;
    profile.isStandyConnected = true;
    await profile.save();

    // 6. Update the OneQr record to align with the profile's plan and status
    qr.assignedTo = profile.user;
    qr.plan = profile.plan;
    qr.subscriptionStatus = profile.subscriptionStatus;
    qr.planAssignedByAdmin = true;
    await qr.save();

    return res.status(200).json({
      status: "success",
      message: `QR code ${cleanQrId} successfully connected to the profile!`,
      data: {
        profile,
        qr,
      },
    });
  } catch (error) {
    console.error("Connect QR to profile error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while connecting QR to profile.",
    });
  }
};

/**
 * @desc    Update the plan of a specific profile slot
 * @route   POST /api/admin/profiles/:profileId/plan
 * @access  Private (Admin)
 */
exports.updateProfilePlan = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({
        status: "error",
        message: "Please provide planId.",
      });
    }

    const validPlans = ['free', 'basic', 'premium', 'enterprise'];
    if (!validPlans.includes(planId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid plan selection.",
      });
    }

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found.",
      });
    }

    profile.plan = planId;
    profile.subscriptionStatus = planId === 'free' ? 'inactive' : 'active';
    await profile.save();

    // If there is a connected QR, update it too
    if (profile.slug) {
      const qr = await OneQr.findOne({ qrId: profile.slug });
      if (qr) {
        qr.plan = planId;
        qr.subscriptionStatus = planId === 'free' ? 'inactive' : 'active';
        await qr.save();
      }
    }

    // Add to user order history
    const user = await User.findById(profile.user);
    if (user) {
      const planNames = {
        basic: "Basic Plan",
        premium: "Premium Plan",
        enterprise: "Enterprise Plan",
      };

      if (!user.orderHistory) {
        user.orderHistory = [];
      }
      user.orderHistory.push({
        orderId: `admin_update_${Date.now()}`,
        paymentId: `admin_pay_${Date.now()}`,
        planId: planId,
        planName: planId === 'free' ? `Free Plan reset (Admin)` : `${planNames[planId]} (Updated by Admin)`,
        amount: 0,
        status: "success",
        paidAt: new Date(),
      });
      await user.save();
    }

    return res.status(200).json({
      status: "success",
      message: "Profile plan updated successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Update profile plan error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while updating profile plan.",
    });
  }
};

/**
 * @desc    Unlink a QR code from a profile slot
 * @route   POST /api/admin/profiles/:profileId/unlink
 * @access  Private (Admin)
 */
exports.unlinkQrFromProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found.",
      });
    }

    const qrId = profile.slug;
    if (qrId) {
      const qr = await OneQr.findOne({ qrId });
      if (qr) {
        qr.assignedTo = null;
        qr.plan = 'free';
        qr.subscriptionStatus = 'inactive';
        qr.planAssignedByAdmin = false;
        await qr.save();
      }
      const newSlug = await generateUniqueProfileSlug();
      profile.slug = newSlug;
      profile.isStandyConnected = false;
      await profile.save();
    }

    return res.status(200).json({
      status: "success",
      message: "QR code unlinked successfully.",
      data: profile,
    });
  } catch (error) {
    console.error("Unlink QR error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while unlinking QR code.",
    });
  }
};

/**
 * @desc    Delete a profile slot
 * @route   DELETE /api/admin/profiles/:profileId
 * @access  Private (Admin)
 */
exports.deleteProfileSlot = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found.",
      });
    }

    const qrId = profile.slug;
    if (qrId) {
      const qr = await OneQr.findOne({ qrId });
      if (qr) {
        qr.assignedTo = null;
        qr.plan = 'free';
        qr.subscriptionStatus = 'inactive';
        qr.planAssignedByAdmin = false;
        await qr.save();
      }
    }

    await Profile.findByIdAndDelete(profileId);

    return res.status(200).json({
      status: "success",
      message: "Profile slot deleted successfully.",
    });
  } catch (error) {
    console.error("Delete profile slot error:", error);
    return res.status(500).json({
      status: "error",
      message: "Server error occurred while deleting profile slot.",
    });
  }
};


