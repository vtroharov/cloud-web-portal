const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            },
            text: {
                type: String
            },
            name: {
                type: String,
            },
            date: {
                type: Date,
                detault: Date.now
            }
        }
    ],
    date: {
        type: Date,
        detault: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);