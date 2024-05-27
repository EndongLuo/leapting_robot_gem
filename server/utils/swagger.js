const router = require('koa-router')() //引入路由函数
const swaggerJSDoc = require('swagger-jsdoc')

// http://localhost:5000/swagger

const swaggerDefinition = {
    info: {
        title: '丽天机器人云平台  接口文档',
        version: '1.0.0',
        description: 'API',
    },
    host: 'localhost:5000',
    basePath: '/' // Base path (optional)
};
const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options)
// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
})
module.exports = router