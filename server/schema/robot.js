const { JSONB } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const { STRING, INTEGER, DATE, JSONB } = DataTypes;
  return sequelize.define('robot', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, field: "id", unique: true, },
    robotname: { type: STRING, allowNull: false, field: "robotname" },
    robot_type: { type: STRING, },
    ip: { type: STRING, },
    robot_img: { type: STRING, },
    create_time: { type: DATE, defaultValue: DataTypes.NOW },
    update_time: { type: DATE, defaultValue: DataTypes.NOW },
    status: { type: INTEGER, defaultValue: 1},
    ptzurl: { type: JSONB, },
  }, {
    tableName: 'robot',
    indexes: [
      {
        unique: true,
        fields: ['robotname']
      }
    ]
  });
};
