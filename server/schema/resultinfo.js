module.exports = function (resultPool, DataTypes) {
  const { STRING, INTEGER, DATE, FLOAT,JSONB } = DataTypes;
  return resultPool.define('result_info', {
    id: { type: INTEGER, primaryKey: true, field: "id", unique: true },
    node_name: { type: STRING, },
    image_url: { type: STRING, },
    recognition_state: { type: INTEGER, },
    recognition_type: { type: INTEGER, },
    recognition_result: { type: INTEGER, },
    task_id: { type: INTEGER, },
    upload_state: { type: INTEGER, },
    update_time: { type: DATE, },
    pose_x: { type: FLOAT, },
    pose_y: { type: FLOAT, },
    task_name: { type: STRING, },
    sync_state: { type: INTEGER, },
    result_detail: { type: JSONB, },
  }, {
    tableName: 'result_info',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  });
};
