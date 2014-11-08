var path = require('path')
  , root_dir = path.join(__dirname, '/..')
  , lib_dir = path.join(root_dir, '/lib')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , sequelize = Models.sequelize
  , User = Models.User
  , Feed = Models.Feed
  , Category = Models.Category
  , ExternalRSS = Models.ExternalRSS
  , write_json = require(lib_dir + '/json-response').write_json;

exports.feedsFindAll = function(req, res, next){
  Feed.findAll({ where: { deletedAt:null }, limit:10, include: [User,Category] }).success(function(feeds) {
    /* */
    var feeds_length = feeds.length
      , return_obj = [];
    for(var i = 0; i < feeds_length; i++ ){
      var feed = feeds[i];
      return_obj.push({
        id: feed.id
        , title: feed.title
        , description: feed.description
        , user_firstName: feed.user.firstName
        , user_lastName: feed.user.lastName
        , category_name: feed.category.name
      });
    }
    /* */
    res.render('jade/feed-all', {
      title: 'Feeds'
      , feeds: return_obj
    });
  });
};

exports.feedsAddGet = function(req, res, next){
  Category.findAll().success(function(categories){
    res.render('jade/feed-add', {
      title: 'Add Feed Item'
      , categories: categories
    });
  });
};

exports.feedsAddPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , feed_data = {
      title: req.body.title
      , description: req.body.description
    };
  
  if( feed_data.title == '' || feed_data.description == '' ){
    return_obj = {
      'error': 'Missing title or description, please try again!'
    };
    return write_json(res, http_code, return_obj);
  } else {
    User.find({token:req.session.user.token}).success(function(usr){
      Category.find(req.body.category).success(function(cat){
        Feed.create(feed_data).success(function(feed){
          feed.setCategory(cat).success(function(){});
          feed.setUser(usr).success(function(){});
          return_obj = {
            'id': feed.id
            , 'slug': feed.dataValues.slug
          };
          return write_json(res, http_code, return_obj);
        });
      });
    });
  }
};

exports.feedsDelete = function(req, res, next){
  var return_obj = {}
    , http_code = 200;
  
  Feed.find(req.params.feed_id).success(function(feed){
    feed.destroy().success(function(){
      return_obj = {'feed_id':req.params.feed_id};
      return write_json(res, http_code, return_obj);
    }).error(function(){      
      return_obj = {'error':'Error deleting the feed item, please try again!'};
      return write_json(res, http_code, return_obj);
    });
  });
};