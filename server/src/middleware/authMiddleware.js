import jwt from 'jsonwebtoken';
import { dbStore } from '../data/dbStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smart_society_super_secret_jwt_key_2026_secure';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      flatNumber: user.flatNumber,
      block: user.block
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Look up user
    const user = await dbStore.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token: User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token', error: error.message });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}]. Current role: '${req.user.role}'`
      });
    }
    next();
  };
};
