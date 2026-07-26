const validateSignup = (req, res, next) => {
  const { role, password } = req.body;

  if (!role || !password) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  if (!['superadmin', 'subadmin', 'student'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  if (role === 'superadmin' || role === 'subadmin') {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    if (role === 'subadmin' && !req.body.hostel) {
      return res.status(400).json({ message: 'Hostel is required for subadmin' });
    }
  }

  if (role === 'student') {
    if (!req.body.referenceId) {
      return res.status(400).json({ message: 'Booking reference ID is required' });
    }
  }

  next();
};

module.exports = validateSignup;