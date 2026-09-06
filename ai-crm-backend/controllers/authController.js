const User = require('../models/User');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');

// @desc    Register new business (creates Company + first Admin user)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { companyName, industry, name, email, password, phone } = req.body;

    if (!companyName || !name || !email || !password) {
      res.status(400);
      throw new Error('Please fill all required fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    // Step 1: Company banao
    const company = await Company.create({
      name: companyName,
      industry: industry || 'general',
    });

    // Step 2: Pehla user 'admin' role ke saath banao (business owner)
    const user = await User.create({
      companyId: company._id,
      name,
      email,
      password,
      phone,
      role: 'admin',
    });

    // Step 3: Company mein ownerId update karo
    company.ownerId = user._id;
    await company.save();

    const token = generateToken(user._id, company._id, user.role);

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      company: {
        id: company._id,
        name: company.name,
        subscriptionPlan: company.subscriptionPlan,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a sales agent under existing company (admin only)
// @route   POST /api/auth/add-agent
// @access  Private (admin)
const addAgent = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    const agent = await User.create({
      companyId: req.companyId, // same company as the logged-in admin
      name,
      email,
      password,
      phone,
      role: 'agent',
    });

    res.status(201).json({
      message: 'Agent added successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // password field 'select: false' hai isliye explicitly select karna padega
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Your account has been deactivated. Contact admin.');
    }

    const company = await Company.findById(user.companyId);

    const token = generateToken(user._id, user.companyId, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      company: company
        ? { id: company._id, name: company.name, subscriptionPlan: company.subscriptionPlan }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const company = await Company.findById(req.companyId);

    res.status(200).json({ user, company });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, login, getMe, addAgent };
