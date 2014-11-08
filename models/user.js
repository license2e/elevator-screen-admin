module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true }
    , username: DataTypes.STRING
    , password: DataTypes.STRING
    , token: DataTypes.STRING
    , isAdmin: DataTypes.BOOLEAN
    , isSuperAdmin: DataTypes.BOOLEAN
    , firstName: DataTypes.STRING
    , lastName: DataTypes.STRING  
  },{
    paranoid: true
  });
};