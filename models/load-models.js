var path = require('path')
  , root_dir = path.join(__dirname, '/..')
  , SequelizeLib = require('sequelize-mysql').sequelize
  , settings = require(root_dir + '/config/settings')
  , sequelize = new SequelizeLib(settings.connection)
  , User = sequelize.import(__dirname + '/user')
  , Feed = sequelize.import(__dirname + '/feed')
  , Category = sequelize.import(__dirname + '/category')
  , ExternalRSS = sequelize.import(__dirname + '/external-rss')
  , Setting = sequelize.import(__dirname + '/setting')
  , Stat = sequelize.import(__dirname + '/stat');
  
Feed.belongsTo(User);
Feed.belongsTo(Category);

exports.SequelizeLib = SequelizeLib;
exports.sequelize = sequelize;
exports.User = User;
exports.Feed = Feed;
exports.Category = Category;
exports.ExternalRSS = ExternalRSS;
exports.Setting = Setting;
exports.Stat = Stat;