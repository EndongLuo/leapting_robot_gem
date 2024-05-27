const router = require('koa-router')()
const RoleController = require('../controllers/role');

router.prefix('/role')  // 路由器前缀

// get 获取列表
/**
 * @swagger
 * /role:
 *   get:
 *     summary: 获取列表
 *     description: 获取列表
 *     tags:
 *       - Role
 *     parameters:
 *       - name: rolename
 *         in: query
 *         required: false
 *         description: 角色名
 *         type: string
 *       - name: text
 *         in: query
 *         required: false
 *         description: 描述
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 */


/**
 * @swagger
 * /user/register:
 *   post: 
 *     description: 用户注册 
 *     summary: "用户注册" 
 *     tags: [用户模块] 
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
router.post('/addrole',RoleController.getRole);


module.exports = router
