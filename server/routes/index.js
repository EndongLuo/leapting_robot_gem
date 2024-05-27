
const Router = require('koa-router')

// 创建实例
const router = new Router()
// router.prefix('/api')  // 路由器前缀

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'API test!'
  })
})

const user = require('./user')
const role = require('./role')
const map = require('./map')
const upload = require('./upload')
const task = require('./task')
const setting = require('./setting')
const robot = require('./robot')



router.use(user.routes())
router.use(role.routes())
router.use(map.routes())
router.use(upload.routes())
router.use(task.routes())
router.use(setting.routes())
router.use(robot.routes())

module.exports = router
