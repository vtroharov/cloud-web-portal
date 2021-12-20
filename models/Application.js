const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    project: {
        type: String,
        required: true
    },
    tenant: {
        type: String,
        required: true
    },
    cloud: {
        type: String,
        required: true
    },
    vms: [
        {
            name: {
                type: String,
                required: true,
            },
            cluster: {
                type: String,
                required: true
            },
            hostname: {
                type: String,
                required: true
            },
            cpu: {
                type: Number,
                required: true
            },
            ram: {
                type: Number,
                required: true
            },
            space: {
                type: Number,
                required: true
            }
        }
    ],
    status: {
        type: String,
        required: true,
        default: 'Init'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Application = mongoose.model('application', ApplicationSchema);