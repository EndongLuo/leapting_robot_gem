const router = require('koa-router')()
const SettingController = require('../controllers/setting');

router.prefix('/api/setting')  // 路由器前缀


/**
 * @swagger
 * /api/setting/rosparam:
 *   get:
 *     summary: 获取Ros参数
 *     description: 获取Ros参数
 *     tags:
 *       - Setting
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功获取Ros参数
 *       400:
 *         description: 获取Ros参数失败
 */
router.get('/rosparam', SettingController.getRosParam);




module.exports = router;