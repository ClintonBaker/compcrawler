var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var mongoose        = require('mongoose');
var passport        = require('passport');
var LocalStrategy   = require('passport-local');
var User            = require('./models/user');
var flash           = require('connect-flash-plus');
var methodOverride  = require('method-override');

var indexRoutes = require('./routes/index'),
    postRoutes = require('./routes/posts'),
    crawlRoutes = require('./routes/crawl');

mongoose.connect('mongodb://crawler:pass123@ds151993.mlab.com:51993/compcrawler');

//App Config
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));




//Passport Configuration
app.use(require('express-session')({
    secret: 'Hey now fo fum Fee cowat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(flash());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');

    next();
});

//Routes
app.use(indexRoutes);
app.use('/posts', postRoutes);
app.use('/crawl', crawlRoutes);

app.listen(3000, function(req, res){
    console.log('Serving Up Comp Crawler!');
});
