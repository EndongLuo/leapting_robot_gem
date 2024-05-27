const Sequelize = require('sequelize');
const {db,r_db} = require('./config');

const sequelize = new Sequelize(db.database, db.user, db.password,{
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    dialectOptions:{
        //字符集
        charset:'utf8mb4',
        collate:'utf8mb4_unicode_ci',
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    pool:db.pool,
    //默认输出执行sql语句
    // logging: console.log,
    logging: false,
    // 数据表全局配置
    define:{
        //是否冻结表名,最好设置为true，要不sequelize会自动给表名加上复数s造成查询数据失败。
        //mongoose也有这样的问题...
        freezeTableName:true,
        // 是否为表添加 createdAt 和 updatedAt 字段
        // createdAt 记录表的创建时间
        // updatedAt 记录字段更新时间
        timestamps:false,
        // 是否为表添加 deletedAt 字段
        // 在日常开发中删除数据记录是一大禁忌，因此我们删除数据并不会真正删除，而是为他添加
        // deletedAt字段
        paranoid:false,
        //是否开启op
        operatorsAliases: false
    },
    timezone: '+08:00'  //东八时区
});

const resultPool = new Sequelize(r_db.database, r_db.user, r_db.password,{
    host: r_db.host,
    port: r_db.port,
    dialect: r_db.dialect,
    dialectOptions:{
        //字符集
        charset:'utf8mb4',
        collate:'utf8mb4_unicode_ci',
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    pool:r_db.pool,
    //默认输出执行sql语句
    // logging: console.log,
    logging: false,
    // 数据表全局配置
    define:{
        //是否冻结表名,最好设置为true，要不sequelize会自动给表名加上复数s造成查询数据失败。
        //mongoose也有这样的问题...
        freezeTableName:true,
        // 是否为表添加 createdAt 和 updatedAt 字段
        // createdAt 记录表的创建时间
        // updatedAt 记录字段更新时间
        timestamps:false,
        // 是否为表添加 deletedAt 字段
        // 在日常开发中删除数据记录是一大禁忌，因此我们删除数据并不会真正删除，而是为他添加
        // deletedAt字段
        paranoid:false,
        //是否开启op
        operatorsAliases: false
    },
    timezone: '+08:00'  //东八时区
});

//测试连接
async function testConnect(){
    try {
        await resultPool.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

// testConnect();

module.exports = {
    sequelize, resultPool
};
