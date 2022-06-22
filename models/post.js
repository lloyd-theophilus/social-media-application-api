const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30
    },
    content: {
        type: String,
        required: true,
        maxlength: 100
    },
    img: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
