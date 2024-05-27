module.exports = function (sequelize, DataTypes) {
  const { STRING, INTEGER } = DataTypes;
  return sequelize.define('role', {
    id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    rolename: { type: STRING, allowNull: false },
    text: { type: STRING, allowNull: false },
    status: { type: INTEGER, defaultValue: 1 }
  }, {
    tableName: 'role',
  });
};
