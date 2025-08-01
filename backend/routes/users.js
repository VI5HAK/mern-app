// routes/users.js
var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const XLSX = require('xlsx');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLS, and XLSX files are allowed!'));
    }
  }
});

// Register new user (admin or agent)
router.post('/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { name, email, mobile, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Create new user
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: role || 'agent'
    });

    console.log('Attempting to save user...');
    await newUser.save();
    console.log('User saved successfully');

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration error details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ===== AGENT MANAGEMENT ROUTES (Admin Only) =====

// Create new agent (Admin only)
router.post('/agents', adminAuth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if agent already exists
    const existingAgent = await User.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new agent
    const newAgent = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: 'agent'
    });

    await newAgent.save();

    res.status(201).json({
      message: 'Agent created successfully',
      agent: {
        id: newAgent._id,
        name: newAgent.name,
        email: newAgent.email,
        mobile: newAgent.mobile,
        role: newAgent.role
      }
    });

  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all agents (Admin only)
router.get('/agents', adminAuth, async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    
    res.json({
      message: 'Agents retrieved successfully',
      agents,
      count: agents.length
    });

  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single agent by ID (Admin only)
router.get('/agents/:id', adminAuth, async (req, res) => {
  try {
    const agent = await User.findOne({ 
      _id: req.params.id, 
      role: 'agent' 
    }).select('-password');

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      message: 'Agent retrieved successfully',
      agent
    });

  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update agent (Admin only)
router.put('/agents/:id', adminAuth, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check if agent exists
    const agent = await User.findOne({ 
      _id: req.params.id, 
      role: 'agent' 
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== agent.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update fields
    if (name) agent.name = name;
    if (email) agent.email = email;
    if (mobile) agent.mobile = mobile;
    if (password) {
      const saltRounds = 10;
      agent.password = await bcrypt.hash(password, saltRounds);
    }

    await agent.save();

    res.json({
      message: 'Agent updated successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        role: agent.role
      }
    });

  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete agent (Admin only)
router.delete('/agents/:id', adminAuth, async (req, res) => {
  try {
    const agent = await User.findOneAndDelete({ 
      _id: req.params.id, 
      role: 'agent' 
    });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      message: 'Agent deleted successfully',
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email
      }
    });

  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload and distribute tasks (Admin only)
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    console.log('Upload route hit');
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse the file
    console.log('Parsing file...');
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log('Parsed data:', data);

    // Validate data
    if (!Array.isArray(data) || data.length === 0) {
      console.log('File is empty or invalid format');
      return res.status(400).json({ message: 'File is empty or invalid format' });
    }

    // Get all agents
    const agents = await User.find({ role: 'agent' });
    console.log('Agents found:', agents.length);
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents found to distribute tasks' });
    }

    // Distribute tasks equally among agents
    const distributed = [];
    data.forEach((item, idx) => {
      const agent = agents[idx % agents.length];
      distributed.push({
        firstName: item.FirstName || item.firstName || item.Name || '',
        phone: item.Phone || item.phone || '',
        notes: item.Notes || item.notes || '',
        assignedAgent: agent._id
      });
    });
    console.log('Distributed tasks:', distributed.length);

    // Save tasks to DB
    const createdTasks = await Task.insertMany(distributed);
    console.log('Tasks saved:', createdTasks.length);

    res.status(201).json({
      message: 'Tasks uploaded and distributed successfully',
      count: createdTasks.length,
      tasks: createdTasks
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tasks for a specific agent (Admin only)
router.get('/tasks/:agentId', adminAuth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedAgent: req.params.agentId });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tasks for the logged-in agent (Agent can view their own tasks)
router.get('/my-tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedAgent: req.user._id });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
