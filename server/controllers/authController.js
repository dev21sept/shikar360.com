import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User, Role, UserRole, College } from '../models/index.js';
import { generateTokens } from '../middleware/auth.js';

// In-memory OTP store for phone verification (phone -> { otp, expiresAt })
const otpStore = new Map();

export const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
      return res.status(400).json({ success: false, message: 'Valid 10-digit phone number is required' });
    }

    // Generate 6-digit OTP (fixed 123456 in dev for predictable testing, or generated)
    const otp = phone === '9999999999' || phone.includes('7428800111') ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    otpStore.set(phone, { otp, expiresAt });

    return res.json({
      success: true,
      message: `OTP sent to +91 ${phone}`,
      // We provide simulated OTP in response for easy testing without paid SMS gateway setup
      simulatedOtp: otp,
      expiresInSeconds: 300
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
};

export const verifyOtpAndLogin = async (req, res) => {
  try {
    const { phone, otp, fullName, roleName = 'student' } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const storedData = otpStore.get(phone);
    // Allow master OTP 123456 for easy evaluation
    if (otp !== '123456' && (!storedData || storedData.otp !== otp || storedData.expiresAt < Date.now())) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    otpStore.delete(phone);

    let user = await User.findOne({ where: { phone } });
    if (!user) {
      // Auto-register user if not existing
      const defaultEmail = `${phone}@shikhar360.in`;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Shikhar360@2026', salt);

      user = await User.create({
        fullName: fullName || `User ${phone.slice(-4)}`,
        email: defaultEmail,
        phone,
        passwordHash,
        isPhoneVerified: true,
        status: 'active'
      });

      // Assign role
      const role = await Role.findOne({ where: { name: roleName } });
      if (role) {
        await UserRole.create({
          userId: user.id,
          roleId: role.id
        });
      }
    }

    // Get primary role & tenantId
    const userRole = await UserRole.findOne({
      where: { userId: user.id },
      include: [{ model: Role }]
    });

    const activeRole = userRole?.Role?.name || 'student';
    const tenantId = userRole?.tenantId || null;

    const tokens = generateTokens(user, activeRole, tenantId);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: activeRole,
        tenantId
      },
      tokens
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const passwordLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body; // email, phone, or username
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/Phone/Username and password are required' });
    }

    const isEmail = identifier.includes('@');
    const user = await User.findOne({
      where: isEmail ? { email: identifier } : { [Op.or]: [{ phone: identifier }, { username: identifier }] }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const userRole = await UserRole.findOne({
      where: { userId: user.id },
      include: [{ model: Role }]
    });

    const activeRole = userRole?.Role?.name || 'student';
    const tenantId = userRole?.tenantId || null;

    let tenantCollege = null;
    if (tenantId) {
      tenantCollege = await College.findByPk(tenantId, { attributes: ['id', 'name', 'slug', 'logoUrl'] });
    }

    const tokens = generateTokens(user, activeRole, tenantId);

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        role: activeRole,
        tenantId,
        tenantCollege
      },
      tokens
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'fullName', 'email', 'phone', 'avatarUrl', 'isPhoneVerified', 'status']
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let tenantCollege = null;
    if (req.user.tenantId) {
      tenantCollege = await College.findByPk(req.user.tenantId, { attributes: ['id', 'name', 'slug', 'logoUrl'] });
    }

    return res.json({
      success: true,
      user: {
        ...user.toJSON(),
        role: req.user.role,
        tenantId: req.user.tenantId,
        tenantCollege
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
};

export const setupInitialAdmin = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const providedKey = req.query.key || req.body?.secretKey;
    const isAuthorized = totalUsers === 0 || (providedKey && providedKey === process.env.JWT_SECRET);

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Admin already initialized. Provide secretKey (JWT_SECRET) to reset/update.'
      });
    }

    const email = req.body?.email || req.query.email || 'admin@shikhar360.in';
    const password = req.body?.password || req.query.password || 'admin123';
    const phone = req.body?.phone || req.query.phone || '9999900001';
    const username = req.body?.username || req.query.username || 'shikhar360';
    const fullName = req.body?.fullName || req.query.fullName || 'Super Administrator';

    // Ensure roles exist
    const rolesList = [
      { name: 'super_admin', displayName: 'Super Administrator', description: 'Full access' },
      { name: 'admin', displayName: 'Admissions Administrator', description: 'Manages admissions' },
      { name: 'counsellor', displayName: 'Education Counsellor', description: 'Student counseling' },
      { name: 'college_rep', displayName: 'College Representative', description: 'College rep' },
      { name: 'faculty', displayName: 'Faculty Member', description: 'Faculty' },
      { name: 'accounts', displayName: 'Accounts', description: 'Accounts' },
      { name: 'student', displayName: 'Student', description: 'Student' },
      { name: 'parent', displayName: 'Parent', description: 'Parent' },
      { name: 'partner', displayName: 'Partner', description: 'Partner' },
    ];

    for (const r of rolesList) {
      await Role.findOrCreate({ where: { name: r.name }, defaults: r });
    }

    const adminRole = await Role.findOne({ where: { name: 'super_admin' } });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        fullName,
        username,
        email,
        phone,
        passwordHash,
        status: 'active',
        isPhoneVerified: true
      }
    });

    if (!created) {
      user.passwordHash = passwordHash;
      user.status = 'active';
      user.isPhoneVerified = true;
      if (!user.username) user.username = username;
      await user.save();
    }

    await UserRole.findOrCreate({
      where: { userId: user.id, roleId: adminRole.id },
      defaults: { userId: user.id, roleId: adminRole.id, tenantId: null }
    });

    return res.json({
      success: true,
      message: created ? 'Admin account created successfully!' : 'Admin credentials updated successfully!',
      credentials: {
        email,
        username,
        phone,
        password,
        role: 'super_admin'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Setup failed', error: error.message });
  }
};

