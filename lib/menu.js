var menu = function (req, res, next) {
  var path = req.route.path
    , menu = {
      home_active: ''
      , feed_active: ''
      , setting_active: ''
      , admin_active: ''
    }
    , path_sliced = path.slice(1)
    , path_check = path.substring(0, (path_sliced.indexOf('/')+1));
  if( req.path == '/' ){
    menu.home_active = 'active';
  } else if( path_check == '/feed' ){
    menu.feed_active = 'active';
  } else if( path_check == '/setting' ){
    menu.setting_active = 'active';
  } else if( path_check == '/admin' ){
    menu.admin_active = 'active';
  }
  res.locals.menu = menu;
  next();
};

exports.menu = menu;