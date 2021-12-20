const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', 
[ 
    check('name', 'Name is required').not().isEmpty(),
    check('role', 'Role is required').not().isEmpty(),
    check('team', 'Team is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, role, team, permissions, password} = req.body;

    try {
        // See if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists" }]});
        }

        user = new User({
            name, email, role, team, permissions, password
        });

        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save User
        await user.save();

        // Return json webtoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 3600 }, (err, token) => {
            if(err) throw err;
            res.json({ token });
        });

    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

// @route   PUT api/users
// @desc    Edit User
// @access  Private
router.put('/', auth,
[ 
    check('email', 'Email is required').not().isEmpty(), 
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, role, team, permissions} = req.body;

    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (role) userFields.role = role;
    if (team) userFields.team = team;
    if(typeof permissions  === 'string') {
        userFields.permissions = permissions.split(',').map((permission) => permission.trim());
    } else {
        userFields.permissions = permissions;
    }

    try {
        // See if user exists and update
        let user = await User.findOneAndUpdate(
            { email },
            { $set: userFields},
            { upsert: true, returnOriginal : false }
        ).select('-password');

        res.json(user);

    } catch(err) {
        console.error(err.message);
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "User not found" }]});
        }
        res.status(500).send('Server error');
    }

});

// @route   DELETE api/user/:id
// @desc    Delete User by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // See if user exists and update
        await User.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'User Deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;