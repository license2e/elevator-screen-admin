var path = require('path')
  , fs = require('fs')
  , moment = require('moment')
  , root_dir = path.join(__dirname, '/..')
  , lib_dir = path.join(root_dir, '/lib')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , sequelize = Models.sequelize
  , User = Models.User
  , Feed = Models.Feed
  , Category = Models.Category
  , ExternalRSS = Models.ExternalRSS
  , Setting = Models.Setting
  , write_json = require(lib_dir + '/json-response').write_json;

exports.apiUpdated = function(req, res, next){
  var return_obj = {
      'external_news': null
      , 'internal_news': null
      , 'internal_alerts': null
      , 'theme_updated': null
    }
    , http_code = 200;
  
  Feed.findAll({ attributes:['(MAX(`Feeds`.`updatedAt`)) as updatedAt'], group:['CategoryId'], include:[Category] }).success(function(feeds) {
    var feeds_length = feeds.length;
    for(var i = 0; i<feeds_length; i++){
      var feed = feeds[i]
        , key = 'internal_' + feed.category.slug;
      return_obj[key] = parseInt(moment(feed.updatedAt).format("X")) * 1000;
    }
    ExternalRSS.find({ attributes:['(MAX(`updatedAt`)) as updatedAt'], group:['id'] }).success(function(rss) {
      if( null != rss ){
        console.log("\n\n");
        console.log(rss);
        console.log("\n\n");
        return_obj['external_news'] = parseInt(moment(rss.updatedAt).format("X")) * 1000;
      }
      Setting.find({ where:{ key:'app_token' } }).success(function(setting){
        var fileName = "/theme/" + setting.value + ".zip"
          , newPath = root_dir + "/public" + fileName;
        if( !fs.existsSync( newPath ) ){
          return_obj['theme_updated'] = null;
          return write_json(res, http_code, return_obj);
        } else {
          fs.stat(newPath, function (err, stats) {
            if( !err ){
              return_obj['theme_updated'] = stats.mtime.getTime();
            }
            return write_json(res, http_code, return_obj);
          });
        }
      });
    });
  });
};

exports.apiSettings = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , where_statement = { 
      key:[
        'app_version'
        , 'app_token'
        , 'forecast_api'
        , 'forecast_lat'
        , 'forecast_long'
        , 'enable_debug'
      ]
      , deletedAt: null
    };
  if( null != req.query.attrs && 'all' === req.query.attrs ){
    where_statement = { deletedAt: null }
  }
  Setting.findAll({ 
    where: where_statement
    //, attributes: ['id', 'key', 'name', 'value']
  }).success(function(settings) {
    var return_settings = {}
      , settings_length = settings.length;
    for( var i = 0; i<settings_length; i++){
      var set = settings[i];
      try {
        set.value = JSON.parse(set.value)
      } catch (e){}
      return_settings[set.key] = set;
    };
    return_obj = {
      settings:return_settings
    };
    return write_json(res, http_code, return_obj);
  });
};

exports.apiExternalNews = function(req, res, next){
  var return_obj = {}
    , http_code = 200;
  ExternalRSS.findAll({ limit:10 }).success(function(feeds) {
    return_obj = {
      feeds:feeds
    }
    return write_json(res, http_code, return_obj);
  });
};

exports.apiInternalNews = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , category_slug = 'news';
  Category.find({ where: { slug: category_slug }}).success(function(cat){
    Feed.findAll({ where: { CategoryId: cat.id, deletedAt:null }, limit:10 }).success(function(feeds) {
      return_obj = {
        feeds:feeds
      }
      return write_json(res, http_code, return_obj);
    });
  });
};

exports.apiInternalAlerts = function(req, res, next){
  var return_obj = {}
    , http_code = 200
    , category_slug = 'alerts';
  Category.find({ where: { slug: category_slug }}).success(function(cat){
    Feed.findAll({ where: { CategoryId: cat.id, deletedAt:null }, limit:10 }).success(function(feeds) {
      return_obj = {
        feeds:feeds
      }
      return write_json(res, http_code, return_obj);
    });
  });
};
