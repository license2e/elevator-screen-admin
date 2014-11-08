var path = require('path')
  , root_dir = path.join(__dirname, '/..')
  , models_dir = path.join(root_dir, '/models')
  , lib_dir = path.join(root_dir, '/lib')
  , Models = require(models_dir + '/load-models')
  , sequelize = Models.sequelize
  , User = Models.User
  , Feed = Models.Feed
  , Category = Models.Category
  , write_json = require(lib_dir + '/json-response').write_json;

exports.signOutGet = function(req, res, next){
  req.session.user = null;
  res.redirect('/');
};

exports.signInGet = function(req, res, next){
  // render the home index view
  res.render('jade/signin', {
    title: 'Sign In'
  });
};

exports.signInPost = function(req, res, next){
  //console.log(req.body.username);
  //console.log(req.session._csrf);
  
  var return_obj = {}
    , http_code = 200;
  User.find({ where: { username: req.body.username } }).success(function(user) {
    if( null == user ){
      return_obj = {'error':'Incorrect username!'};
    } else if( null != user.deletedAt ) {
      return_obj = {'error':'Sorry, your account has been disabled, please contact your administrator!'};
    } else {
      var password_check = req.body.password + '.' + user.token
        , hash = require('crypto').createHash('sha256').update(password_check).digest('hex');
      console.log(password_check);
      console.log(hash);
      console.log(user.password);
      if( user.password === hash ){
        req.session.user = {
          token: user.token
          , isAdmin: user.isAdmin
          , isSuperAdmin: user.isSuperAdmin
          , firstName: user.firstName
          , lastName: user.lastName
          , expired: false
        };
        return_obj = {'token':user.token};
      } else {
        return_obj = {'error':'Incorrect password!'};
      }
    }
    return write_json(res, http_code, return_obj);
  });
};