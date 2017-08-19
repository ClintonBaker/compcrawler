var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var middleware = require('../middleware');


router.get('/', middleware.isLoggedIn, function(req, res){
    res.redirect('/crawl/randomize');
});

//Get new post to crawl
router.get('/randomize', middleware.isLoggedIn, function(req, res){
    var postCount;
    Post.count({}, function(err, c){
        if(err){
            console.log(err);
        } else {
            postCount = Math.ceil(Math.random() * c);
            Post.findOne({}).skip(postCount-1).exec(function(err, foundPost){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/crawl/' + foundPost._id);
                }
            });
        }
    });


});

router.get('/:id',middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            req.flash('error', 'Oops! Looks like can\'t find that...');
            res.redirect('/' + req.params.id);
        } else {
            res.render('crawl', {post: foundPost});
        }
    });
});

router.post('/:id', middleware.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            var name = {username: req.user.username, suggName: req.body.name, likes: 0};
            foundPost.suggNames.push(name);
            foundPost.save();
            res.redirect('back');
        }
    });
});

//Add upvotes
router.post('/:id/upvote', middleware.isLoggedIn, function(req, res){
    //Find Post to be upvoted by ID
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            var voted = false;
            //Check to make sure user has not already voted
            req.user.votedPosts.forEach(function(votedPost){
            if(votedPost._id.equals(foundPost._id)){
                voted = true;
              }
            });
            if(!voted){
                req.user.votedPosts.push(req.params.id);
                req.user.save();
                foundPost.likes += 1;
                foundPost.save();
                res.redirect('back');
              }else{
                  res.redirect('back');
              }
        }
    });
});

//Add upvotes
router.post('/:id/upvote/:nameId', middleware.isLoggedIn, function(req, res){
    //Find Post to be upvoted by ID
    Post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            var voted = false;
            //Check to make sure user has not already voted
            req.user.votedNames.forEach(function(votedName){
                if(votedName.postId.equals(foundPost._id) && votedName._id.equals(req.params.nameId)){
                    voted = true;
                }
            });
            if(!voted){

                req.user.votedNames.push({_id: req.params.nameId, postId: req.params.id});
                req.user.save();

                for(var i = 0; i < foundPost.suggNames.length; i++){
                    if(foundPost.suggNames[i]._id.equals(req.params.nameId)){
                        foundPost.suggNames[i].likes++;
                        foundPost.suggNames[i].save();

                        //If there is more than one name suggestion, it finds the new position of
                        //the name upvoted based off the number of likes it has gotten
                        if(foundPost.suggNames.length > 1){
                            if(i>0){ //If name is the first name, there is no need to sort it again
                                var buff = foundPost.suggNames.splice(i, 1);
                                for(var j = 0; j < i; j++){
                                    if(foundPost.suggNames[j].likes < buff[0].likes || j === i){
                                        foundPost.suggNames.splice(j, 0, buff[0]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                foundPost.save();

                res.redirect('back');
            }else{
                res.redirect('back');
            }
        }
    });
});



module.exports = router;
