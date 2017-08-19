var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    author: {
        id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
        username: String
    },
    imageUrl: String,
    imageAngle: 0,
    likes: 0,
    suggNames: [
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            username: String,
            suggName: String,
            likes: 0
        }
    ]
});

module.exports = mongoose.model('Post', PostSchema);
