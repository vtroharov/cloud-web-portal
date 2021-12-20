const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const Logs = require('../../models/Logs');
const User = require('../../models/User');

// @route   GET api/logs
// @desc    Get all logs
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const logs = await Logs.find().populate('user', ['name']);
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/logs/user/:user_id
// @desc    Get logs by user ID
// @access  Private
router.get('/user/:user_id', auth,  async (req, res) => {
    try {
        const logs = await Logs.find({ user: req.params.user_id }).populate('user', ['name']);
        
        if(!logs) return res.status(400).json({ msg: 'Logs not found' });

        res.json(logs);
        
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Logs not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/logs/:id
// @desc    Get logs by user ID
// @access  Private
router.get('/:id', auth,  async (req, res) => {
    try {
        const log = await Logs.findOne({ _id: req.params.id }).populate('user', ['name']);
        
        if(!log) return res.status(400).json({ msg: 'Log not found' });

        res.json(log);
        
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Log not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/log
// @desc    Create a log
// @access  Private
router.post('/', [ auth, [
    check('desc', 'Description is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { desc } = req.body;

    // Build Profile Object
    const logFields = {};
    logFields.user = req.user.id;
    if(desc) logFields.desc = desc;

    try {
        // Create
        let log = new Logs(logFields); 
        await log.save();

        res.json(log);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   DELETE api/log/
// @desc    Delete all logs
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove all Logs
        await Logs.deleteMany();

        res.json({ msg: 'All Logs Deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/log/:id
// @desc    Delete log
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Remove Log
        await Logs.findOneAndRemove({ _id: req.params.id });

        res.json({ msg: 'Log Deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;