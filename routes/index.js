var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var middleware = require('../middleware');

router.get('/', middleware.isLoggedIn, function(req, res){
    res.render('landing');
});

// ==============
//  AUTH ROUTES
// ==============

//Show registration form
router.get('/register', function(req, res){
    res.render('register');
});

//Handle registration logic
router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('/register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/posts');
        });
    });
});

//Show login form
router.get('/login', function(req, res){
    res.render('login');
});

//Handle login logic
router.post('/login', passport.authenticate('local',{
    successRedirect: '/posts',
    failureRedirect: '/login'
    }), function(req, res){
});

//Logout route
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Successfully logged out!');
    res.redirect('/');
});

module.exports = router;
