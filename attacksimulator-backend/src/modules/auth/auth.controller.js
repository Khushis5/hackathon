import { registerUser, loginUser } from './auth.service.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await registerUser(name, email, password, role);

    res.status(201).json({
      message: 'User registered successfully',
      user
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const data = await loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      ...data
    });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};