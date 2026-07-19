const validateSignup = (req, res, next) => {
  const { name, email, password, role, block } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  if (!['admin', 'warden', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  if ((role === 'warden' || role === 'student') && !block) {
    return res.status(400).json({ message: 'Block is required for warden and student' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

module.exports = validateSignup;