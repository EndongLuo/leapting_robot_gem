const { DataTypes } = require('sequelize');

module.exports = function (sequelize, tableName) {
  const { STRING, INTEGER, FLOAT, JSONB } = DataTypes;

  return sequelize.define(tableName, {
    id: { type: INTEGER, primaryKey: true },
    PVMID: { type: STRING, allowNull: false, field: "PVMID" },
    sitename: { type: STRING },
    block: { type: STRING },
    row: { type: STRING },
    section: { type: STRING },
    col: { type: INTEGER },
    num: { type: INTEGER },
    position: { type: JSONB },
    pvm_height: { type: FLOAT, defaultValve: 0 },
    center: { type: JSONB },
    qsnav: { type: JSONB },
    zxjnav: { type: JSONB },
    fxjnav: { type: JSONB },
  }, {
    tableName,
    indexes: [
      {
        unique: true,
        fields: ['PVMID'] // 使用字段名而非字符串
      }
    ]
  });
};