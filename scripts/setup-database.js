#!/usr/bin/env node

var path = require('path')
  , fs = require('fs')
  , root_dir = path.join(__dirname, '/..')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , sequelize = Models.sequelize
  , User = Models.User
  , Feed = Models.Feed
  , Category = Models.Category
  , Setting = Models.Setting
  , hat = require('hat')
  , default_categories = {
    'alerts': 'Alerts'
    , 'news': 'News'
  }
  , default_settings = [
      {key:'app_version',     name:'App Version',           value:'1.0.0'}
    , {key:'app_token',       name:'App Token',             value:''}
    , {key:'enable_debug',    name:'App Debug',             value:'false'}
    , {key:'forecast_api',    name:'Forecast API key',      value:''}
    , {key:'forecast_lat',    name:'Forecast Latitude',     value:''}
    , {key:'forecast_long',   name:'Forecast Longitude',    value:''}
    , {key:'external_news1',  name:'External News Feed #1', value:''}
    , {key:'external_news2',  name:'External News Feed #2', value:''}
    , {key:'external_news3',  name:'External News Feed #3', value:''}
    , {key:'internal_news',   name:'Internal News Feed',    value:''}
    , {key:'internal_alerts', name:'Internal Alerts Feed',  value:''}
  ];

sequelize.sync({ force:true }).success(function() {
  console.log("\n\n" + '..finished!');
  
  console.log("\n\n" + "Checking for the admin user.." + "\n\n");

  User.find({ where: { username: 'admin' } }).success(function(user) {
    if( null == user ){
      console.log("\n\n" + "Creating the admin..");
      var token = hat()
        , password = require('crypto').createHash('sha256').update('admin12345.'+token).digest('hex')
        , user_data = { 
          username: 'admin'
          , password: password
          , token: token
          , isAdmin: true
          , isSuperAdmin: true
          , firstName: 'Admin'
          , lastName: 'User' 
        }
      User.create(user_data).success(function(admin){
        console.log("\n\n" + "Admin created:" + admin.id + "\n\n");
      });
    } else {
      console.log("\n\n" + "Admin already exists:" + user.id + "\n\n");
    }
    
    console.log("\n\n");
      
  }).error(function(error){  
    console.log("\n\n" + "Error:");
    console.log(error);
  });
  
  console.log("\n\n" + "Checking for the default categories.." + "\n\n");
  
  Category.findAll().success(function(categories){
    var categoriesToString = categories.toString();
    console.log('Categories: "' + categoriesToString + '"');
    if( "" == categoriesToString ){
      for( slug in default_categories ){
        var name = default_categories[slug];
        Category.create({
          name: name
        }).success(function(category){
          console.log("\n\n"+'Created category: ' + category.id + ':' + category.dataValues.slug + "\n\n");
        });
      }
      
      console.log("\n\n" + "Adding sample data.." + "\n\n");
      
      Category.find(1).success(function(cat){
        User.find(1).success(function(usr){
          Feed.create({title:'test1', description:'test1 description'}).success(function(feed_item){
            feed_item.setCategory(cat).success(function(){
              console.log('Added category!');
            });
            feed_item.setUser(usr).success(function(){
              console.log('Added user!');
            });
          });
        });
      });
    } else {
      console.log(categories);
    }
  });
  
  for( s in default_settings ){
    setting_data = default_settings[s];
    if( setting_data['key'] == 'app_token' ){
      setting_data['value'] = hat();
    } else if( setting_data['key'] == 'app_version' ){
      setting_data['value'] = '1.0.0';
    }
    Setting.create(setting_data).success(function(setting_item){
      console.log("\n\n"+'Created setting: ' + setting_item.id + ':' + setting_item.dataValues.key + "\n\n");
    });
  }
  
}).error(function(error) {  
  console.log("\n\n" + "Error:");
  console.log(error);
});