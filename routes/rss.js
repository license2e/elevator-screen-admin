/* * /
var RSS = require('rss');

exports.getFeedRss = function(req, res, next){
  var host = req.host
    , port = ((req.portno != 80) ? ':'+req.portno : '')
    , url = host + '' + port
    , feed = new RSS({
      title: 'Elevator Screen RSS'
      , description: 'Settings and feeds for the Elevator Screen app.'
      , feed_url: url + '/rss.xml'
      , site_url: host
      , image_url: ''
      , author: 'Elevator Screen'
    });
  
  Feed.findAll({ limit: 10 }).success(function(feeds){
    for( item in feeds ){
      feed.item({
        title: item.title
        , description: item.description
        , url: 'http://example.com/article4?this&that', // link to the item
        guid: '1123', // optional - defaults to url
        author: 'Guest Author', // optional - defaults to feed author property
        date: 'May 27, 2012' // any format that js Date can parse.
      });
    }
    res.set("Content-Type", "text/xml");
    res.send(feed.xml());
  });
};
/* */