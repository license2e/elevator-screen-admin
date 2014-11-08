var express = require('express')
  , app = express()
  , home = require('./routes')
  , signin = require('./routes/sign-in')
  , feed = require('./routes/feed')
  , api = require('./routes/api')
  , setting = require('./routes/setting')
  , admin = require('./routes/admin')
  , usr = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , AuthLib = require('./lib/auth')
  , auth = AuthLib.auth
  , auth_admin = AuthLib.auth_admin
  , auth_super_admin = AuthLib.auth_super_admin
  , menu = require('./lib/menu').menu;

app.configure(function(){
  app.set('port', process.env.PORT || 9393);
  app.set('views', path.join(__dirname, 'views'));
  app.set('data', path.join(__dirname, 'data'));
  app.set('public', path.join(__dirname, 'public'));
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.cookieParser('usdfLZKR%K>M$#zs9LWKL#$Vg!$#diJALAo4'));
  app.use(express.session({ cookie: { maxAge: 1000 * 60 * 20 } }));
  app.use(express.bodyParser());
  app.use(express.csrf());
  app.use(function (req, res, next) {
    req.portno = app.get('port');
    res.locals.token_csrf = req.session._csrf;
    if( undefined == req.session.user ){
      req.session.user = {token: null, isAdmin: false, firstName: null, lastName: null, expired: false};
    }
    if( undefined != req.session.flash ){
      res.locals.flash = req.session.flash;
      req.session.flash = undefined;
    }
    res.locals.user = req.session.user;
    next();
  });
  app.use(express.static(app.get('public')));
  app.use(app.router);
  app.use(function(req, res, next){
    res.status(404);
    res.locals.title = "404 Not Found";
    // respond with html page
    if (req.accepts('html')) {
      res.render('jade/error-404', { url: req.url });
      return;
    }
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: '404 Not found' });
      return;
    }
    // default to plain-text. send()
    res.type('txt').send('404 Not found');
  });
});

// process in development environment
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/* ---------------------------------------------------------------
 *  NON-AUTH
 * ---------------------------------------------------------------*/
app.get('/sign-out/?', signin.signOutGet);
app.get('/sign-in/?', signin.signInGet);
app.post('/sign-in/?', signin.signInPost);
app.get('/api/updated/?', api.apiUpdated);
app.get('/api/settings/?', api.apiSettings);
app.get('/api/external-news/?', api.apiExternalNews);
app.get('/api/internal-news/?', api.apiInternalNews);
app.get('/api/internal-alerts/?', api.apiInternalAlerts);
/* ---------------------------------------------------------------
 *  AUTH
 * ---------------------------------------------------------------*/
app.get('/', auth, menu, home.index);
app.get('/feed/?', auth, menu, feed.feedsFindAll);
app.get('/feed/add/?', auth, menu, feed.feedsAddGet);
app.post('/feed/add/?', auth, menu, feed.feedsAddPost);
app.delete('/feed/:feed_id/?', auth, menu, feed.feedsDelete);
//app.get('/settings/?', auth, setting.settingsFindAll);
app.get('/setting/token/?', auth, menu, setting.settingsTokenGet);
app.get('/setting/forecast/?', auth, menu, setting.settingsForecastGet);
app.post('/setting/forecast/?', auth, menu, setting.settingsForecastPost);
app.get('/setting/external/?', auth, menu, setting.settingsExternalGet);
app.post('/setting/external/?', auth, menu, setting.settingsExternalPost);
app.get('/setting/internal/?', auth, menu, setting.settingsInternalGet);
app.post('/setting/internal/?', auth, menu, setting.settingsInternalPost);
app.get('/setting/:setting_id/?', auth, menu, setting.settingEditGet);
app.post('/setting/:setting_id/?', auth, menu, setting.settingEditPost);
app.get('/user/profile/?', auth, menu, usr.usersEditGet);
app.post('/user/profile/?', auth, menu, usr.usersEditPost);
/* ---------------------------------------------------------------
 *  ADMIN
 * ---------------------------------------------------------------*/
app.get('/admin/user/?', auth_admin, menu, admin.usersFindAll);
app.get('/admin/user/add/?', auth_admin, menu, admin.usersAddGet);
app.post('/admin/user/add/?', auth_admin, menu, admin.usersAddPost);
app.delete('/admin/user/:user_id/?', auth_admin, menu, admin.usersDisable);
app.put('/admin/user/:user_id/?', auth_admin, menu, admin.usersEnable);
app.get('/admin/theme/?', auth_super_admin, menu, admin.themeGet);
app.post('/admin/theme/?', auth_super_admin, menu, admin.themePost);
app.get('/admin/debug/?', auth_super_admin, menu, admin.debugGet);
app.post('/admin/debug/?', auth_super_admin, menu, admin.debugPost);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
