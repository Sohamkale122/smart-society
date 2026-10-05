import { dbStore } from '../data/dbStore.js';
import { generateToken } from '../middleware/authMiddleware.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await dbStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User does not exist.' });
    }

    // In demo environment, compare plain or hash
    if (password && user.password && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = generateToken(user);
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userSafe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, flatNumber, block, phone } = req.body;

    if (!name || !email || !flatNumber) {
      return res.status(400).json({ success: false, message: 'Name, email, and flat number are required.' });
    }

    const existing = await dbStore.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'A resident with this email is already registered.' });
    }

    const newUser = await dbStore.createUser({
      name,
      email,
      password: password || 'default123',
      role: role || 'resident',
      flatNumber,
      block: block || 'Block A',
      phone: phone || '+91 99000 00000',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80`,
      status: 'active'
    });

    const token = generateToken(newUser);
    const { password: _, ...userSafe } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: userSafe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const { password: _, ...userSafe } = req.user;
    res.json({ success: true, user: userSafe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDemoAccounts = async (req, res) => {
  try {
    const users = await dbStore.getUsers();
    const demoAccounts = users.map(u => ({
      id: u.id || u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      flatNumber: u.flatNumber,
      block: u.block,
      designation: u.designation || (u.role === 'admin' ? 'Committee Head' : u.role === 'security' ? 'Gate Security' : 'Resident')
    }));
    res.json({ success: true, accounts: demoAccounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
