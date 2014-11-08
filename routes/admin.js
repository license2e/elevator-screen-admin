var path = require('path')
  , fs = require('fs')
  , root_dir = path.join(__dirname, '/..')
  , lib_dir = path.join(root_dir, '/lib')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , sequelize = Models.sequelize
  , User = Models.User
  , Setting = Models.Setting
  , hat = require('hat')
  , write_json = require(lib_dir + '/json-response').write_json;

exports.usersFindAll = function(req, res, next){
  User.findAll({ limit:10 }).success(function(users) {
    res.render('jade/admin/user-all', {
      title: 'Users'
      , users: users
    });
  });
};

exports.usersAddGet = function(req, res, next){
  res.render('jade/admin/user-add', {
    title: 'Add User'
  });
};

exports.usersAddPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , user_data = {
      username: req.body.username
      , password: req.body.user_password
      , token: hat()
      , isAdmin: ((req.body.user_admin === 'true') ? true : false)
      , firstName: req.body.first_name
      , lastName: req.body.last_name
    };
  
  if( user_data.username == '' || user_data.password == '' ){
    return_obj = {
      'error': 'Missing username or password, please try again!'
    };
    return write_json(res, http_code, return_obj);
  } else if( !user_data.password.match(req.body.user_confirm_password) ) {    
    return_obj = {
      'error': 'Passwords don\'t match, please try again!'
    };
    return write_json(res, http_code, return_obj);
  } else {
    User.find({ where: {username:user_data.username} }).success(function(usr){
      if( null != usr ){
        return_obj = {
          'error': 'Username: ' + user_data.username + ' already exists, please try another username!'
        };
        return write_json(res, http_code, return_obj);
      } else {
        var enc_password = require('crypto').createHash('sha256').update(user_data.password+'.'+user_data.token).digest('hex');
        user_data.password = enc_password;
        User.create(user_data).success(function(new_usr){          
          return_obj = {
            'id': new_usr.id
          };
          return write_json(res, http_code, return_obj);
        });
      }
    });
  }
};

exports.usersDisable = function(req, res, next){
  var return_obj = {}
    , http_code = 200;
  
  User.find(req.params.user_id).success(function(usr){
    usr.destroy().success(function(){
      return_obj = {'user_id':req.params.user_id};
      return write_json(res, http_code, return_obj);
    }).error(function(){      
      return_obj = {'error':'Error deleting the user, please try again!'};
      return write_json(res, http_code, return_obj);
    });
  });
};

exports.usersEnable = function(req, res, next){
  var return_obj = {}
    , http_code = 200;
  
  sequelize.query("UPDATE `Users` SET `deletedAt`=NULL WHERE `id`=" + req.params.user_id).success(function(rows){
    return_obj = {'user_id':req.params.user_id};
    return write_json(res, http_code, return_obj);
  }).error(function(){      
    return_obj = {'error':'Error enabling the user, please try again!'};
    return write_json(res, http_code, return_obj);
  });
};

exports.themeGet = function(req, res, next){
  res.render('jade/admin/theme', {
    title: 'Theme'
  });
};

exports.themePost = function(req, res, next){
  var return_obj = {}
    , http_code = 200;
  
  Setting.find({ where:{ key:'app_token' } }).success(function(setting){
    fs.readFile(req.files.theme.path, function (err, data) {
      var fileName = "/theme/" + setting.value + ".zip"
        , newPath = root_dir + "/public" + fileName;
      fs.writeFile(newPath, data, function (err) {
        if( err ){
          req.session.flash = {type:'error',msg:err};
        } else {
          req.session.flash = {type:'success',msg:'Successfully saved file to: ' + fileName};
        }
        return res.redirect('/admin/theme/');
      });
    });
  });
};

exports.debugGet = function(req, res, next){
  Setting.find({ where:{ key:'enable_debug' } }).success(function(setting){
    res.render('jade/admin/debug', {
      title: 'Debug'
      , setting: setting
    });  
  });
};

exports.debugPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200;
  
  Setting.find({ where:{ key:'enable_debug' } }).success(function(setting){
    setting_data = {value:req.body.enable_debug}
    setting.updateAttributes(setting_data).success(function(){
      return_obj = {'id':setting.id};
      return write_json(res, http_code, return_obj);
    }).error(function(){      
      return_obj = {'error':'Error enabling debug mode, please try again!'};
      return write_json(res, http_code, return_obj);
    });
  });
};