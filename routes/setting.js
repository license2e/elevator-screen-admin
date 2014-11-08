var path = require('path')
  , root_dir = path.join(__dirname, '/..')
  , lib_dir = path.join(root_dir, '/lib')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , SequelizeLib = Models.SequelizeLib
  , sequelize = Models.sequelize
  , Setting = Models.Setting
  , ExternalRSS = Models.ExternalRSS
  , write_json = require(lib_dir + '/json-response').write_json;
  
exports.settingsFindAll = function(req, res, next){
  Setting.findAll({ where: { deletedAt:null } }).success(function(settings) {
    res.render('jade/setting-all', {
      title: 'Settings'
      , settings: settings
    });
  });
};

exports.settingEditGet = function(req, res, next){
  Setting.find(req.params.setting_id).success(function(setting) {
    res.render('jade/setting-edit', {
      title: 'Edit Setting'
      , setting: setting
    });
  });
};

exports.settingEditPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , setting_data = {
      value: req.body.value
    };
  
  Setting.find(req.params.setting_id).success(function(setting){
    setting.updateAttributes(setting_data).success(function(){
      return_obj = {
        'id': setting.id
      };
      return write_json(res, http_code, return_obj);
    }).error(function(){
      return_obj = {
        'error': 'Error while updating the setting, please try again!'
      };
      return write_json(res, http_code, return_obj);
    });
  });
};

exports.settingsTokenGet = function(req, res, next){
  var settings = {};
  Setting.find({ where : { key: 'app_token' } }).success(function(setting){
    res.render('jade/setting-token', {
      title: 'App Token'
      , setting: setting
    });
  });
};

exports.settingsForecastGet = function(req, res, next){
  var settings = {};
  Setting.findAll({ where : ["`key` LIKE 'forecast%'"], limit:5 }).success(function(settings){
    var set_length = settings.length
      , return_settings = {
        'forecast_api': {}
        , 'forecast_lat': {}
        , 'forecast_long': {}
      };
    for(var i = 0; i<set_length; i++){
      var set = settings[i];
      return_settings[set.key] = {
        'key': set.key
        , 'value': set.value
      };
    }
    res.render('jade/setting-forecast', {
      title: 'Edit Forecast Setting'
      , settings: return_settings
    });
  });
};


exports.settingsForecastPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , chainer = new SequelizeLib.Utils.QueryChainer
    , update_ids = null;
  
  Setting.findAll({ where : ["`key` LIKE 'forecast%'"], limit:5 }).success(function(settings){
    
    var set_length = settings.length;
    for(var i = 0; i < set_length; i++ ){
      var setting_data = {}
        , set = settings[i];
      if( set.key == 'forecast_api' ){
        setting_data = {value: req.body.api};
      } else if( set.key == 'forecast_lat' ){
        setting_data = {value: req.body.lat};
      } else if( set.key == 'forecast_long' ){
        setting_data = {value: req.body.long};
      }
      update_ids = update_ids + ', ' + set.id;
      chainer.add(set.updateAttributes(setting_data));
    }
    
    chainer.run().success(function(){
      return_obj = {
        id: update_ids
      };
      return write_json(res, http_code, return_obj);
    }).error(function(errors){
      return_obj = {
        'error': 'Error while updating the settings, please try again!'
        , 'error_msgs': errors
      };
      return write_json(res, http_code, return_obj);
    });
  });
};

exports.settingsExternalGet = function(req, res, next){
  var settings = {};
  Setting.findAll({ where : ["`key` LIKE 'external%'"], limit:5 }).success(function(settings){
    var set_length = settings.length
      , return_settings = {
        'external_news': {value:''}
        , 'external_news2': {value:''}
        , 'external_news3': {value:''}
      };
    for(var i = 0; i<set_length; i++){
      var set = settings[i];
      return_settings[set.key] = {
        'key': set.key
        , 'value': set.value
      };
    }
    res.render('jade/setting-external', {
      title: 'Edit External Urls Setting'
      , settings: return_settings
    });
  });
};

exports.settingsExternalPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , chainer = new SequelizeLib.Utils.QueryChainer
    , update_ids = null;
  
  Setting.findAll({ where : ["`key` LIKE 'external%'"], limit:5 }).success(function(settings){
    
    var set_length = settings.length;
    for(var i = 0; i < set_length; i++ ){
      var setting_data = {}
        , set = settings[i];
      if( set.key == 'external_news1' ){
        setting_data = {value: req.body.news1};
      } else if( set.key == 'external_news2' ){
        setting_data = {value: req.body.news2};
      } else if( set.key == 'external_news3' ){
        setting_data = {value: req.body.news3};
      }
      update_ids = update_ids + ', ' + set.id;
      chainer.add(set.updateAttributes(setting_data));
    }
    
    chainer.run().success(function(){
      return_obj = {
        id: update_ids
      };
      return write_json(res, http_code, return_obj);
    }).error(function(errors){
      return_obj = {
        'error': 'Error while updating the settings, please try again!'
        , 'error_msgs': errors
      };
      return write_json(res, http_code, return_obj);
    });
  });
};

exports.settingsInternalGet = function(req, res, next){
  var settings = {};
  Setting.findAll({ where : ["`key` LIKE 'internal%'"], limit:5 }).success(function(settings){
    var set_length = settings.length
      , return_settings = {
        'internal_news': {}
        , 'internal_alerts': {}
      };
    for(var i = 0; i<set_length; i++){
      var set = settings[i];
      return_settings[set.key] = {
        'key': set.key
        , 'value': set.value
      };
    }
    res.render('jade/setting-internal', {
      title: 'Edit Internal Urls Setting'
      , settings: return_settings
    });
  });
};

exports.settingsInternalPost = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , chainer = new SequelizeLib.Utils.QueryChainer
    , update_ids = null;
  
  Setting.findAll({ where : ["`key` LIKE 'internal%'"], limit:5 }).success(function(settings){
    
    var set_length = settings.length;
    for(var i = 0; i < set_length; i++ ){
      var setting_data = {}
        , set = settings[i];
      if( set.key == 'internal_news' ){
        setting_data = {value: req.body.news};
      } else if( set.key == 'internal_alerts' ){
        setting_data = {value: req.body.alerts};
      }
      update_ids = update_ids + ', ' + set.id;
      chainer.add(set.updateAttributes(setting_data));
    }
    
    chainer.run().success(function(){
      return_obj = {
        id: update_ids
      };
      return write_json(res, http_code, return_obj);
    }).error(function(errors){
      return_obj = {
        'error': 'Error while updating the settings, please try again!'
        , 'error_msgs': errors
      };
      return write_json(res, http_code, return_obj);
    });
  });
};