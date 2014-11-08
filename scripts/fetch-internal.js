#!/usr/bin/env node

var path = require('path')
  , fs = require('fs')
  , root_dir = path.join(__dirname, '/..')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , SequelizeLib = Models.SequelizeLib
  , sequelize = Models.sequelize
  , Feed = Models.Feed
  , Setting = Models.Setting
  , Category = Models.Category
  , parser = require('blindparser')
  , chainer = new SequelizeLib.Utils.QueryChainer
  , category_news = null
  , category_alerts = null;

var get_guid = function(news_item){
  var return_guid = ''
    , link_obj = news_item;
    
  if( news_item.hasOwnProperty('guid') ){
    link_obj = news_item['guid'];
  }
  
  if( link_obj.hasOwnProperty('link') ) {
    return_guid = link_obj['link'];
  } else {
    return_guid = link_obj;
  }
  return_guid = JSON.stringify(return_guid);
  return return_guid;
}


Category.findAll().success(function(categories){
  for(var c = 0, cl = categories.length; c<cl; c++){
    var cat = categories[c];
    if( cat.slug == 'news' ){
      category_news = cat;
    } else if( cat.slug == 'alerts' ){
      category_alerts = cat;
    }
  }
  /* */
  Setting.findAll({ where : ["`key` LIKE 'internal%'"], limit:5 }).success(function(settings){
    var set_length = settings.length;
    for(var i = 0; i<set_length; i++){
      var set = settings[i];
      if( set.value != '' && set.value != null ){
        var category_id = null;
        if( set.value == 'internal_news' ){
          category_id = category_news.id;
        } else if( set.value == 'internal_alerts' ){
          category_id = category_alerts.id;
        }
        parser.parseURL(set.value, function(err, out){
          if(!err){
            var total = out.items.length;
            for(i=0;i<total;i++){
              var news_item = out.items[i]
                , title = news_item.title[0]
                , desc = news_item.desc[0]
                , date = new Date(news_item.date)
                , guid = get_guid(news_item)
                , createdAt = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDay()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
                , slug = require('crypto').createHash('md5').update(guid).digest("hex")
                , category_id = null;
              chainer.add(Feed.destroy({slug:slug}));
              chainer.add(Feed.build({
                slug:slug
                , title:title
                , description:desc
                , createdAt:createdAt
                , UserId:1
                , CategoryId:category_id
              }).save());
            }
          }
        });
      }
    }
    chainer.run().success(function(){

      console.log("\n\n" + 'Successfully, added the items..' + "\n\n");

    }).error(function(errors){
      console.log("\n\n" + 'Error(s) occurred: ' + "\n\t" + errors.join(", \n\t") + "\n\n");
    });
  });
  /* */
});