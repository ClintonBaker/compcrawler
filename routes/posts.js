var express = require('express');
var router = express.Router();
var multer = require('multer');
var Post = require('../models/post');
var middleware = require('../middleware');



multer = multer({storage: multer.MemoryStorage, fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(null, false);
    }
    return cb(null, true);
}});
  
var upload = multer.single('upl');

//INDEX - Show all posts
router.get('/', middleware.isLoggedIn, function(req, res){
    //Get all posts from DB
    Post.find({'author.username': req.user.username}, function(err, allPosts){
        if(err){
            console.log(err);
        } else {
            res.render('posts/index', {posts:allPosts});
        }
    });
});

//New post form
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('posts/new');
});

//Create the new post
router.post('/new', middleware.isLoggedIn, upload, middleware.sendUploadToGCS, function(req, res){

    var data = req.body;
    
    if (req.file && req.file.cloudStoragePublicUrl) {
        data.imageUrl = req.file.cloudStoragePublicUrl;
        var author = {
            id: req.user._id,
            username: req.user.username
            },
            imageUrl = data.imageUrl;
        
        var newPost = {author: author, imageUrl: imageUrl, imageAngle: 0, likes: 0, suggNames: []};
        //Create new post and save to Database
        Post.create(newPost, function(err, newlyCreated){
            if(err){
                console.log(err);
                res.redirect('/posts');
            } else {
                res.redirect('/posts');
            }
        });
    } else {
        req.flash('error', 'File must be an image!');
        res.redirect('back');
    }
});

//SHOW - Shows post
router.get('/:id', middleware.isLoggedIn,function(req, res){
    //Find post by ID provided
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            //render show template with post
            res.render('posts/show', {post: foundPost});
        }
    });
});

//EDIT - Allows image rotation
router.get('/:id/edit', middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        res.render('posts/edit', {post: foundPost});
    });
});

//UPDATE - Save updated post
router.post('/:id/edit/:angle', middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            foundPost.imageAngle = req.params.angle;
            foundPost.save();
            res.redirect('back');
        }
    });
})

//DELETE - Destroys post
router.delete('/:id', middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/posts');
        } else {
            res.redirect('/posts');
        }
    })
})

module.exports = router;