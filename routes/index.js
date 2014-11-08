var path = require('path');

exports.index = function(req, res, next){
  res.render('jade/index', {
    title: 'Dashboard'
  });
};