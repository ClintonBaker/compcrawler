var gcs = require('@google-cloud/storage')({
    projectId: 'compcrawler-177305',
    keyFilename: './CompCrawler-510ee1f7c8c1.json'
});
var CLOUD_BUCKET = 'compcrawler1';
var bucket = gcs.bucket(CLOUD_BUCKET);
var Post = require('../models/post');

function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You must be logged in to do that!');
    res.redirect('/login');
};

middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            if(err){
                req.flash('error', 'Post not found');
                res.redirect('/posts');
            } else {
                //does user own post?
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect('back');
                }
                
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that!');
        res.redirect('back');
    }
}

middlewareObj.sendUploadToGCS = function (req, res, next) {
  if (!req.file) {
    return next();
  }

  const gcsname = Date.now() + req.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {
    req.file.cloudStorageObject = gcsname;
    req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    next();
  });

  stream.end(req.file.buffer);
};

module.exports = middlewareObj;
