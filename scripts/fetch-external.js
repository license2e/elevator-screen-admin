#!/usr/bin/env node

var path = require('path')
  , fs = require('fs')
  , moment = require('moment')
  , root_dir = path.join(__dirname, '/..')
  , models_dir = path.join(root_dir, '/models')
  , Models = require(models_dir + '/load-models')
  , SequelizeLib = Models.SequelizeLib
  , sequelize = Models.sequelize
  , ExternalRSS = Models.ExternalRSS
  , Setting = Models.Setting
  , parser = require('blindparser')
  , chainer = new SequelizeLib.Utils.QueryChainer;

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

Setting.findAll({ where : ["`key` LIKE 'external%'"], limit:5 }).success(function(settings){
  var set_length = settings.length;
  for(var i = 0; i<set_length; i++){
    var set = settings[i];
    if( set.value != '' && set.value != null ){
      parser.parseURL(set.value, function(err, out){
        if(!err){
          var total = out.items.length;
          for(i=0;i<total;i++){
            var news_item = out.items[i]
              , title = news_item.title[0]
              , desc = news_item.desc[0]
              , date = moment(news_item.date).format("YYYY-MM-DD HH:mm:ss")
              , guid = get_guid(news_item)
              , createdAt = date//.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDay()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
              , slug = require('crypto').createHash('md5').update(guid).digest("hex");
            chainer.add(ExternalRSS.destroy({slug:slug}));
            chainer.add(ExternalRSS.build({slug:slug,title:title,description:desc,createdAt:createdAt}).save());
          }
        }
      });
    }
  }
  /* */
  chainer.run().success(function(){
    
    console.log("\n\n" + 'Successfully, added the items..' + "\n\n");
    
    // var last_month = new Date()
      // , last_month_datetime = '';
    // last_month.setMonth(last_month.getMonth()-1);
    // last_month_datetime = last_month.getFullYear()+'-'+(last_month.getMonth()+1)+'-'+last_month.getDate()+' '+last_month.getHours()+':'+last_month.getMinutes()+':'+last_month.getSeconds();
    var last_month_datetime = moment().subtract('months', 1).format("YYYY-MM-DD HH:mm:ss")
    sequelize.query("DELETE FROM ExternalRSSes WHERE createdAt < ?", null, {raw: true}, [last_month_datetime]).success(function() {
      console.log("\n\n" + 'Successfully, deleted old items..' + "\n\n");
    });
  }).error(function(errors){
    console.log("\n\n" + 'Error(s) occurred: ' + "\n\t" + errors.join(", \n\t") + "\n\n");
  });
  /* */
});
