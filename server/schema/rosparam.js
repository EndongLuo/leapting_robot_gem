module.exports = function (resultPool, DataTypes) {
  const { STRING, INTEGER } = DataTypes;
  return resultPool.define('ros_param', {
    id: { type: INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    param: { type: STRING, allowNull: false,},
    type: { type: STRING, },
    value: { type: STRING, },
  }, {
    tableName: 'ros_param',
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ['id']
    //   }
    // ]
  });
};