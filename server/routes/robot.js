const router = require('koa-router')()
const RobotController = require('../controllers/robot');
const MapTransformer = require('../utils/mapOffset');

router.prefix('/api/robot')  // 路由器前缀


/**
 * @swagger
 * /api/robot/robot:
 *   get:
 *     summary: 获取机器人
 *     description: 获取机器人
 *     tags:
 *       - Robot
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.get('/robot', RobotController.getRobot);
router.get('/robots', MapTransformer.loadSiteInfo.bind(MapTransformer));

/**
 * @swagger
 * /api/robot/robot:
 *   get:
 *     summary: 修改机器人
 *     description: 修改机器人
 *     tags:
 *       - Robot
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功修改
 *       400:
 *         description: 修改失败
 */
router.put('/robot', RobotController.updateRobot);


/**
 * @swagger
 * /api/robot/robot:
 *   get:
 *     summary: 添加机器人
 *     description: 添加机器人
 *     tags:
 *       - Robot
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功修改
 *       400:
 *         description: 修改失败
 */
router.post('/robot', RobotController.addRobot);


/**
 * @swagger
 * /api/robot/robot:
 *   get:
 *     summary: 删除机器人
 *     description: 删除机器人
 *     tags:
 *       - Robot
 *     parameters:
 *     responses:
 *       200:
 *         description: 删除成功
 *       400:
 *         description: 删除失败
 */
router.delete('/robot', RobotController.deleteRobot);




module.exports = router;