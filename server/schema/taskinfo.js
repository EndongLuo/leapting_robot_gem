module.exports = function (sequelize, DataTypes) {
  const { STRING, INTEGER, DATE, TEXT } = DataTypes;
  return sequelize.define('taskinfo', {
    id: { type: INTEGER, primaryKey: true, field: "id", unique: true },
    odom: { type: STRING, },
    path: { type: TEXT, },
    task_state: { type: STRING, },
    result: { type: STRING, },
    start_time: { type: STRING, },
    end_time: { type: STRING, },
  }, {
    tableName: 'taskinfo',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  });
};
