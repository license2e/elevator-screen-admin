module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Stat", {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true }
    , key: DataTypes.STRING
    , value: DataTypes.STRING
  },{
    paranoid: true
  });
};