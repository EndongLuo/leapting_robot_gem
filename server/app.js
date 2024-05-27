const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('koa-jwt')
const cors = require('koa2-cors')

const { koaSwagger } = require('koa2-swagger-ui')
const scheduleDataUpdate = require('./utils/scheduleTasks');

// 启动定时任务
scheduleDataUpdate();

// 配置文件
const config = require('./config/config')
//引入路由
const router = require('./routes/index');

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// cors
app.use(cors({
  origin: function (ctx) { //设置允许来自指定域名请求
    // return 'http://localhost:8888'; //只允许http://localhost:8888这个域名的请求
    return '*'
  },
  maxAge: 5, //指定本次预检请求的有效期，单位为秒。
  // credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
}))


/* 当token验证异常时候的处理，如token过期、token错误 */
app.use((ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      // 未授权，访问被拒绝
      ctx.body = {
        code: 401,
        msg: err.originalError ? err.originalError.message : err.message
      }
    } else {
      throw err;
    }
  });
});

/* 路由权限控制 */
app.use(jwt({
  secret: config.jwt.secret
}).unless({
  // 设置login、register接口，可以不需要认证访问
  path: [
    /\/api\/user\/register/,
    /\/api\/user\/login/,
    /\/api\/public\/getCaptcha/,
    /\/api\/public\/upload/,
    /^((?!\/api).)*$/   // 设置除了私有接口外的其它资源，可以不需要认证访问
  ]
}));



/*自定义中间件*/
const test = require('./middlewares/test')
app.use(test())
/**************/

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router.routes()).use(router.allowedMethods());


// swagger
const swagger = require('./utils/swagger')
app.use(swagger.routes(), swagger.allowedMethods())
// 配置Swagger-ui
app.use(koaSwagger({
  routePrefix: '/swagger', // host at /swagger instead of default /docs
  swaggerOptions: {
    url: '/swagger.json', // example path to json
  },
}))

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
