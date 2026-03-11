const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d'
    });
};

exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password, staffId, department, organization, collegeName, role } = req.body;

    const userExists = await User.findOne({ 
        $or: [{ email }, { staffId }] 
    });

    if (userExists) {
        return res.status(400).json({ message: 'User with this Email or Staff ID already exists' });
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        staffId,
        department,
        organization,
        collegeName,
        role: role || 'employee'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('organization');

    if (user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            staffId: user.staffId,
            department: user.department,
            organization: user.organization,
            collegeName: user.collegeName,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).populate('organization');

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            staffId: user.staffId,
            department: user.department,
            organization: user.organization
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
