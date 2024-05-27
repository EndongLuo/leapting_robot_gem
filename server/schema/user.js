const { cryptoPwd } = require('../utils/util');

module.exports = function (sequelize, DataTypes) {
  const { STRING, INTEGER, DATE } = DataTypes;
  return sequelize.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, field: "id", unique: true, },
    username: { type: STRING, allowNull: false, field: "username" },
    password: { type: STRING, allowNull: false,
      set(val) { this.setDataValue('password', cryptoPwd(val)); }, 
    },
    head_img: { type: STRING, },
    create_time: { type: DATE, },
    update_time: { type: DATE, defaultValue: sequelize.NOW },
    status: { type: INTEGER, defaultValue: 1}
  }, {
    tableName: 'user',
    indexes: [
      {
        unique: true,
        fields: ['username']
      }
    ]
  });
};
