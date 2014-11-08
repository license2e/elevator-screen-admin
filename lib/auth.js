auth = function (req, res, next) {
  if( !check(req) ) return res.redirect('/sign-in/');
  next();
};
auth_admin = function (req, res, next) {
  return auth(req, res, function(){
    if( !req.session.user.isAdmin ){
      req.session.flash = {type:'error',msg:'Sorry, only the admin can access that area!'};
      return res.redirect('/');
    }
    next();
  });
};
auth_super_admin = function (req, res, next) {
  return auth(req, res, function(){
    if( !req.session.user.isSuperAdmin ){
      req.session.flash = {type:'error',msg:'Sorry, only the super admin can access that area!'};
      return res.redirect('/');
    }
    next();
  });
};
check = function (req) {
  if( req.session.user.token ){
    var session_user = req.session.user;
    req.session.user = null;
    req.session.user = session_user;
    return true;
  }
  console.log('Session expired:');
  console.log(req.session.user);
  return false;
};

exports.auth = auth;
exports.auth_admin = auth_admin;
exports.auth_super_admin = auth_super_admin;