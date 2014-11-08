module.exports = function(sequelize, DataTypes) {
  return sequelize.define("ExternalRSS", {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true }
    , slug: { type: DataTypes.STRING(200), allowNull: false }
    , title: { type: DataTypes.STRING, allowNull: false }
    , description: DataTypes.TEXT
    , startAt: DataTypes.DATE
    , endAt: DataTypes.DATE
  });
};