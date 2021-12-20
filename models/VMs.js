const mongoose = require('mongoose');

const VMsSchema = new mongoose.Schema({
    cluster: {
        type: String,
        required: true
    },
    commited_space: {
        type: Number,
        required: true
    },
    uncommited_space: {
        type: Number,
        required: true
    },
    hostname: {
        type: String,
        required: true
    },
    memory_alloc: {
        type: Number,
        required: true
    },
    num_cpu: {
        type: Number,
        required: true
    },
    power_status: {
        type: String,
        required: true
    },
    tenant: {
        type: String,
        required: true
    },
    uptime: {
        type: Number,
        required: true
    },
    vm: {
        type: String,
        required: true
    },
    vm1: {
        type: String,
        required: true
    }
});

module.exports = VMs = mongoose.model('vms', VMsSchema);