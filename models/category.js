var path = require('path')
  , root_dir = path.join(__dirname, '/..')
  , lib_dir = path.join(root_dir, '/lib')
  , slugify = require(lib_dir + '/slugify').slugify;
  
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Category", {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true }
    , slug: { type: DataTypes.STRING(200), allowNull: false }
    , name: { type: DataTypes.STRING, allowNull: false, set: function(value){ this.setDataValue('slug', slugify(value,198)); this.setDataValue('name', value); } }
  },{
    paranoid: true
  });
};