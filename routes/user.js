var path = require('path')
  , fs = require('fs')
  , root_dir = path.join(__dirname, '/..')
  , lib_dir = path.join(root_dir, '/lib')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , sequelize = Models.sequelize
  , User = Models.User
  , hat = require('hat')
  , write_json = require(lib_dir + '/json-response').write_json;

exports.usersEditGet = function(req, res, next){
  User.find({username:req.session.user.username}).success(function(usr){
    res.render('jade/user-edit', {
      title: 'Edit User'
      , usr: usr
    });
  });
};

exports.usersEditPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , user_data = {
      username: req.body.username
      , password: null
      , firstName: req.body.first_name
      , lastName: req.body.last_name
    };

  if( user_data.username == '' || user_data.password == '' ){
    return_obj = {
      'error': 'Missing username or password, please try again!'
    };
    return write_json(res, http_code, return_obj);
  } else if( req.body.user_password != '' && !req.body.user_password.match(req.body.user_confirm_password) ) {    
    return_obj = {
      'error': 'Passwords don\'t match, please try again!'
    };
    return write_json(res, http_code, return_obj);
  } else {
    User.find({username:user_data.username}).success(function(usr){
      if( null == usr ){
        return_obj = {
          'error': 'An error occurred while updating the user info, please try again!'
        };
        return write_json(res, http_code, return_obj);
      } else {
        if( null != req.body.user_password && req.body.user_password != '' ){
          user_data.password = req.body.user_password;
          var session_user = req.session.user
            , enc_password = require('crypto').createHash('sha256').update(user_data.password+'.'+session_user.token).digest('hex');
          user_data.password = enc_password;
        } else {
          console.log('didnt update password: ' + usr.password);
          user_data.password = usr.password;
        }
        usr.updateAttributes(user_data).success(function(){          
          usr.reload().success(function(){
            req.session.user = {
              token: session_user.token
              , isAdmin: usr.isAdmin
              , isSuperAdmin: usr.isSuperAdmin
              , firstName: usr.firstName
              , lastName: usr.lastName
              , expired: false
            };
            return_obj = {
              'id': usr.id
            };
            return write_json(res, http_code, return_obj);
          });
        });
      }
    });
  }
};