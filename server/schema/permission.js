module.exports = function (sequelize, DataTypes) {
  const { STRING, INTEGER } = DataTypes;
  return sequelize.define('permission', {
    id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    permission_name: { type: STRING, allowNull: false },
    permission_note: { type: STRING, allowNull: false },
    status: { type: INTEGER, defaultValue: 1 }
  }, {
    tableName: 'permission'
  });
};
