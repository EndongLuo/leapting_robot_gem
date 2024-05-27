module.exports = function (resultPool, DataTypes) {
  const { STRING, INTEGER, DATE, FLOAT } = DataTypes;
  return resultPool.define('security_functions', {
    id: { type: INTEGER, primaryKey: true, field: "id", unique: true },
    type: { type: STRING, },
    image_url: { type: STRING, },
    recongition_time: { type: STRING, },
    upload_state: { type: INTEGER, },
    sync_state: { type: INTEGER, },
    position_x: { type: FLOAT, },
    position_y: { type: FLOAT, },
  }, {
    tableName: 'security_functions',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  });
};