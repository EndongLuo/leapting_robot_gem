module.exports = function (sequelize, DataTypes) {
  const { INTEGER, DATE } = DataTypes;
  return sequelize.define('timed_task', {
    id: { type: INTEGER, primaryKey: true,autoIncrement: true, field: "id", unique: true },
    task_state: { type: INTEGER, defaultValue: 0 }, // 0:待执行 1:进行中 2:已执行 3:未执行
    start_time: { type: DATE, },
  }, {
    tableName: 'timed_task',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  });
};