const mongoose = require('mongoose');

const LogsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    desc: {
        type: String,
        required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
});

module.exports = Logs = mongoose.model('logs', LogsSchema);