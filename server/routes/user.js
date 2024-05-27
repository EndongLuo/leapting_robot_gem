const router = require('koa-router')()
const UserController = require('../controllers/user');
const { authJwt } = require("../utils/jwt")

router.prefix('/api/user')  // 路由器前缀
// router.get('/', async (ctx, next) => {
//   'use strict'
//   ctx.redirect('/user/login')
// })

/**
 * @swagger
 * /user/register:
 *   post: 
 *     description: 用户注册 
 *     summary: "用户注册" 
 *     tags: [User] 
 *     parameters: 
 *       - name: username
 *         description: 账号
 *         required: true
 *         in: query
 *         type: string
 *       - name: password
 *         description: 密码
 *         in: query
 *         required: true
 *         type: string
 *     produces: 
 *       - application/json 
 *     responses: 
 *       200:
 *         description: 获取数据列表 
 * */
router.post('/register',UserController.register);


/**
 * @swagger
 * /user/login:
 *   post: 
 *     description: 用户登录 
 *     tags: [User] 
 *     summary: "用户登录"
 *     parameters:
 *       - name: username
 *         description: 账号
 *         required: true
 *         in: query
 *         type: string
 *       - name: password
 *         description: 密码
 *         in: query
 *         required: true
 *         type: string
 *     produces: 
 *       - application/json 
 *     responses: 
 *       200:
 *         description: 获取数据列表 
 * */
router.post('/login',UserController.login);

router.post('/userInfo', authJwt ,UserController.getUserInfo)

router.post('/upload',UserController.updateUserAvatar)

module.exports = router
