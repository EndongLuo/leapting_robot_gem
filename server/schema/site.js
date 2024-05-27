const { DataTypes, JSONB } = require('sequelize');

module.exports = (sequelize) => {
  const { STRING, INTEGER, DATE, TEXT, JSONB } = DataTypes;

  return sequelize.define('site', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    sitename: { type: STRING, allowNull: false },
    tablename: STRING,
    site_img: STRING,
    address: STRING,
    lat_lng: JSONB,
    center: JSONB,
    map: JSONB,
    blocks: JSONB,
    zoom: INTEGER,
    data_save: INTEGER,
    mapoffset: JSONB,
    e_fence: JSONB,
    create_time: { type: DATE, defaultValue: DataTypes.NOW },
    update_time: { type: DATE, defaultValue: DataTypes.NOW },
    status: { type: INTEGER, defaultValue: 1 },
  }, {
    tableName: 'site',
    indexes: [
      {
        unique: true,
        fields: ['sitename']
      }
    ]
  });
};

