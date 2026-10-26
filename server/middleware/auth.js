import jwt from 'jsonwebtoken';
import { User, Role, UserRole } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shikhar360_super_secret_jwt_key_2026';

export const generateTokens = (user, roleName, tenantId = null) => {
  const payload = {
    id: user.id,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    role: roleName,
    tenantId: tenantId
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

export const authenticateToken = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Auth error', error: error.message });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};

export const tenantIsolation = (req, res, next) => {
  // If user is super_admin or admin, allow unrestricted access
  if (['super_admin', 'admin'].includes(req.user.role)) {
    return next();
  }

  // College-scoped roles (college_rep, faculty, accounts)
  const targetCollegeId = Number(req.params.collegeId || req.body.collegeId || req.query.collegeId);
  if (!targetCollegeId) {
    return next();
  }

  if (Number(req.user.tenantId) !== targetCollegeId) {
    return res.status(403).json({ 
      success: false, 
      message: 'Tenant violation: You do not have permission to access or modify data for this college.' 
    });
  }

  next();
};
