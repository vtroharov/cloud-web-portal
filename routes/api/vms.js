const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const data = require('../../nvi_vms_full.json');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const VMs = require('../../models/VMs');

// @route   GET api/vms
// @desc    Get all vms 
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const vms = await VMs.find();
        
        res.json(vms);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/vms
// @desc    Get all vms combined per tenant 
// @access  Private
router.get('/tenant', auth, async (req, res) => {
    try {
        const vms = await VMs.find();
        let vmsFiltered = [];
        await vms.forEach(async (item) => {
            if(vmsFiltered.length < 1) {
                await vmsFiltered.push(item);
            } else {
                let count = vmsFiltered.length - 1;
                await vmsFiltered.forEach(async (tenant) => {
                    if(tenant.tenant === item.tenant) {
                        tenant.num_cpu += item.num_cpu;
                        tenant.memory_alloc += item.memory_alloc;
                        tenant.uncommited_space += item.uncommited_space;
                        tenant.commited_space += item.commited_space;
                        if (item.uptime > tenant.uptime) tenant.uptime = item.uptime
                    } else if (count === 0) {
                        await vmsFiltered.push(item);
                    }
                    count -= 1;
                });
            }
        });
        res.json(vmsFiltered);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/vms/cluster/:name
// @desc    Get vms by cluster
// @access  Private
router.get('/cluster/:name', auth, async (req, res) => {
    try {
        const vms = await VMs.find({ cluster: req.params.name });

        if(!vms) {
            return res.status(404).json({ msg: 'VM not found' });
        }
        
        res.json(vms);

    } catch (err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'VM not found' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/vms/tenant/:name
// @desc    Get vms by tenant
// @access  Private
router.get('/tenant/:name', auth, async (req, res) => {
    try {
        let input = [];
        let output = [];
        if(req.params.name) {
           input = req.params.name.split(',').map((name) => name.trim());
        }

        await Promise.all(input.map( async (name) => {
            const vm_query = await VMs.find({ tenant: name });

            if(vm_query) {
                vm_query.forEach(vm => {
                    output.push(vm)
                })
            } else {
                return res.status(404).json({ msg: 'VMs not found' });
            } 
        }
        ));

        return res.json(output);

    } catch (err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'VMs not found' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/vms/vm/:name
// @desc    Get vm by name
// @access  Private
router.get('/vm/:name', auth, async (req, res) => {
    try {
        const vm = await VMs.find({ vm: req.params.name });

        if(!vm) {
            return res.status(404).json({ msg: 'VM not found' });
        }
        
        res.json(vm);

    } catch (err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'VM not found' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/vms
// @desc    Create a vm
// @access  Private
router.post('/', [auth, [
    check('vm.Virtual_Machine', 'VM is required').not().isEmpty()
    ]], async (req, res) => {

    try {
        let arrCreate = [];
        let arrUpdate = [];
        await Promise.all(data.combined_vm.map( async (vm) => {
            const vm_query = await VMs.findOne({ vm: vm.Virtual_Machine });

            const vmSet = {};
            vmSet.cluster = vm.Cluster;
            vmSet.commited_space = Math.round(vm.Commited_space/1073741824);
            vmSet.uncommited_space = Math.round(vm.Uncommited_space/1073741824);
            vmSet.hostname = vm.Hostname;
            vmSet.memory_alloc = Math.round(vm.Memmory_Alloc/1024);
            vmSet.num_cpu = vm.Num_CPU;
            vmSet.power_status = vm.Power_Status;
            vmSet.tenant = vm.Tenant.split("/").slice(-1).pop();
            vmSet.uptime = Math.round(vm.UPtime/360);
            vmSet.vm = vm.Virtual_Machine;
            vmSet.vm1 = vm.Virtual_Machine1;

            if(vm_query) {
                // Update
                if(vm_query.cluster !== vm.Cluster || 
                    vm_query.commited_space !== Math.round(vm.Commited_space/1073741824) || 
                    vm_query.uncommited_space !== Math.round(vm.Uncommited_space/1073741824) || 
                    vm_query.hostname !== vm.Hostname || 
                    vm_query.memory_alloc !== Math.round(vm.Memmory_Alloc/1024) || 
                    vm_query.num_cpu !== vm.Num_CPU || 
                    vm_query.power_status !== vm.Power_Status || 
                    vm_query.tenant !== vm.Tenant.split("/").slice(-1).pop() || 
                    vm_query.uptime !== Math.round(vm.UPtime/360) || 
                    vm_query.vm !== vm.Virtual_Machine || 
                    vm_query.vm1 !== vm.Virtual_Machine1) {
                    await arrUpdate.push(vm);
                    await VMs.findOneAndUpdate(
                        { vm: vm.Virtual_Machine }, 
                        { $set: vmSet }, 
                        { new: true });
                }
            } else {
                // Create
                await arrCreate.push(vm);
                newVM = new VMs(vmSet); 
                await newVM.save();
            } 
        }
        ));
        let arr = [arrCreate.length, arrUpdate.length];
        return res.json(arr); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/vms/
// @desc    Delete all VMs
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        // const vm = await VMs.findById(req.params.id);
        const vms = await VMs.find();

        if(!vms) {
            return res.status(404).json({ msg: 'VMs not found' });
        }

        const user = await User.findById(req.user.id).select('-password');
        // Check user
        if(user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await VMs.deleteMany();

        res.json({ msg: 'VMs Removed' });

    } catch (err) {
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'VMs not found' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;