const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Register new user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Username and password are required.' 
        });
    }

    if (password.length < 6) {
        return res.status(400).json({ 
            success: false,
            message: 'Password must be at least 6 characters long.' 
        });
    }

    try {
        const existingUser = await User.findOne({ 
            $or: [
                { username },
                ...(email ? [{ email }] : [])
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: existingUser.username === username 
                    ? 'Username already exists.' 
                    : 'Email already exists.'
            });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({ 
            success: true,
            message: 'User registered successfully.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error registering user.',
            error: error.message
        });
    }
};

// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Username and password are required.' 
        });
    }

    try {
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password.' 
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid username or password.' 
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({ 
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error logging in.',
            error: error.message
        });
    }
};

// Verify token (for protected routes)
exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided.' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found.' 
            });
        }

        res.status(200).json({ 
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token.' 
        });
    }
};

