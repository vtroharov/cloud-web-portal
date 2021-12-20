const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const moment = require('moment');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Application = require('../../models/Application');

// @route   GET api/applications
// @desc    Get all applications
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const applications = await Application.find().populate('user', ['name']);
        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/applications/number
// @desc    Get application's next number
// @access  Private
router.get('/number', auth, async (req, res) => {
    try {
        const applications = await Application.find().select('number');
        let max_num = 0;
        if (applications) {
            applications.forEach((number) => {
                if (number.number > max_num) max_num = number.number;
                }
            )
            let date = moment().format('YYYY');
            if (max_num.toString().slice(0, 4) === date) {
                max_num += 1;
            } else {
                max_num = date * 1000 + 1;
            }
        } else {
            max_num = date * 1000 + 1;
        }

        res.json(max_num);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/application/user/:user_id
// @desc    Get applications by User ID
// @access  Private
router.get('/user/:user_id', auth, async (req, res) => {
    try {
        
        const application = await Application.find({ user: req.params.user_id }).populate('user', ['name']);
        
        if(!application) return res.status(400).json({ msg: 'Applications not found' });

        res.json(application);

    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Application not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET api/application/app/:id
// @desc    Get user's profile's Application
// @access  Private
router.get('/app/:id', auth, async (req, res) => {
    try {
        const application = await Application.findOne({ _id: req.params.id }).populate('user', ['name']);

        if(!application) {
            return res.status(400).json({ msg: 'Application not found' });
        }

        res.json(application);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/application
// @desc    Create or update an Application
// @access  Private
router.post('/', [auth, [
    check('number', 'Number is required').not().isEmpty(),
    check('project', 'Project is required').not().isEmpty(),
    check('tenant', 'Tenant is required').not().isEmpty(),
    check('cloud', 'Cloud is required').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { number, project, tenant, cloud, status } = req.body;

    // Build Application Object
    const appFields = {};
    if(number) appFields.number = number;
    if(project) appFields.project = project;
    if(tenant) appFields.tenant = tenant;
    if(cloud) appFields.cloud = cloud;
    if(status) appFields.status = status;

    try {
        let application = await Application.findOne({ number: req.body.number });

        // Update
        if(application) {
            application = await Application.findOneAndUpdate(
                { number: req.body.number }, 
                { $set: appFields }, 
                { new: true });

            return res.json(application);
        }

        // Create
        appFields.user = req.user.id;
        application = new Application(appFields); 
        await application.save();

        res.json(application);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route   DELETE api/application/:id
// @desc    Delete Application
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Remove Application
        await Application.findOneAndRemove({ _id: req.params.id });

        res.json({ msg: 'Application Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/application/vms/:app_id
// @desc    Add VM to the Application
// @access  Private
router.put('/vms/:app_id', [auth, [
    check('name', 'Name is required').not().isEmpty(),
    check('cluster', 'Cluster is required').not().isEmpty(),
    check('hostname', 'Hostname is required').not().isEmpty(),
    check('cpu', 'CPU is required').not().isEmpty(),
    check('ram', 'RAM is required').not().isEmpty(),
    check('space', 'Space is required').not().isEmpty()
]] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, cluster, hostname, cpu, ram, space } = req.body;
    
    const newVM = { name, cluster, hostname, cpu, ram, space }

    try {
        const application = await Application.findOne({ _id: req.params.app_id });

        let duplicate = false;

        application.vms.forEach((vm) => {
            if (vm.name === name) {
                duplicate = true;
            }   
        });

        if (!duplicate) {
            application.vms.push(newVM);

            await application.save();
            res.json(application);
        } else {
            return res.status(409).json({ msg: 'Name already Exists' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/application/vms
// @desc    Delete VM from the Application
// @access  Private
router.delete('/vms/:app_id/:vms_id', auth, async (req, res) => {
    try {
        // Get Application of User
        const application = await Application.findOne({ _id: req.params.app_id });
        // Get Remove ID
        const removeIndex = application.vms.map((item) => item.id).indexOf(req.params.vms_id);
        //Remove VMs
        application.vms.splice(removeIndex, 1);
        //Save Application
        await application.save();

        res.json(application);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;