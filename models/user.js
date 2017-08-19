var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    votedPosts: [{_id: mongoose.Schema.Types.ObjectId}],
    votedNames: [{
        _id: mongoose.Schema.Types.ObjectId,
        postId: mongoose.Schema.Types.ObjectId
    }]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);