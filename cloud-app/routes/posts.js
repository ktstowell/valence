var Posts = require('../models/Posts');

/**
 * INIT ROUTE
 * @return {[type]} [description]
 */
exports.initRoute = function(app, Posts, auth) {

  var Auth = require('./auth');

  /**
   * GET
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  app.get('/posts', function(req, res, next) {
    if(req.query.author_id) {
      Posts.getPostsByAuthorId(req.query.author_id, function(err, posts) {
        if(err) {
          res.send(500, err);
        } else {
          res.send(posts);
        }
      })
    } else {
      Posts.getPosts(req.query.post_id, function(err, status, posts) {
        if(err) {
          res.send(status, err);
        } else {
          res.send(200, posts);
        }
      })
    }
  });

  /**
   * POST
   */
  app.post('/posts', app.expressJWT({secret: app.secret}), function(req, res, next) {
    var required = ['title', 'body'];
    var failedReqs = [];
    var matchedReqs = 0;

    for(var i=0; i<required.length; i++) {
      if(req.body.hasOwnProperty(required[i])) {
        matchedReqs++;
      } else {
        failedReqs.push(require[i]);
      }
    }

    if(matchedReqs == required.length) {
      var postsData = req.body;

      postsData.author_id = req.user._id;

      Posts.newPost(postsData, function(err, doc) {
        if(err) res.send(400, 'Could not save post: '+err);
        res.send(200, doc);
      });
    } else {
      res.send(400, failedReqs);
    }
  });

  app.put('/posts', app.expressJWT({secret: app.secret}), function(req, res, next) {
    if(!req.query.post_id) {
      res.send(400, 'Please send the ID of the Post you wish to update.')
    }

    Posts.updatePost(req.body, req.query.post_id, function(err, post) {
      if(err) res.send(400, 'Could not update post: '+err);
      res.send(200, post);
    });
  });

  // Inserts a lot of test data;
  // Posts.insertPosts();
};