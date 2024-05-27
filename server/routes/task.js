const router = require('koa-router')()
const TaskController = require('../controllers/task');

router.prefix('/api/task')  // 路由器前缀

/**
 * @swagger
 * /api/task/task:
 *   post:
 *     summary: 创建任务
 *     description: 创建任务
 *     tags:
 *       - Task
 *     parameters:
 *       - name: task_name
 *         in: query
 *         required: false
 *         description: 任务名称
 *         type: string
 *       - name: nodes
 *         in: query
 *         required: false
 *         description: 任务区域
 *         type: string
 *       - name: founder
 *         in: query
 *         required: false
 *         description: 创建人
 *         type: string
 *       - name: recognition_type
 *         in: query
 *         required: false
 *         description: 识别类型
 *         type: string
 *       - name: isback
 *         in: query
 *         required: false
 *         description: 是否回库
 *         type: string
 *       - name: task_type
 *         in: query
 *         required: false
 *         description: 任务类型
 *         type: string
 *       - name: robotId
 *         in: query
 *         required: false
 *         description: 机器人ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.post('/task', TaskController.createTask);

/**
 * @swagger
 * /api/task/task:
 *   get:
 *     summary: 获取任务
 *     description: 获取任务
 *     tags:
 *       - Task
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.get('/task', TaskController.getTask);

/**
 * @swagger
 * /api/task/task:
 *   put:
 *     summary: 修改任务
 *     description: 修改任务
 *     tags:
 *       - Task
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.put('/task', TaskController.updateTask);

/**
 * @swagger
 * /api/task/task:
 *   delete:
 *     summary: 删除任务
 *     description: 删除任务
 *     tags:
 *       - Task
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.delete('/task', TaskController.deleteTask);


/**
 * @swagger
 * /api/task/taskinfo:
 *   post:
 *     summary: 创建任务信息
 *     description: 创建任务信息
 *     tags:
 *       - Task
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *       - name: odom
 *         in: query
 *         required: false
 *         description: 里程
 *         type: string
 *       - name: path
 *         in: query
 *         required: false
 *         description: 路径
 *         type: string
 *       - name: task_state
 *         in: query
 *         required: false
 *         description: 任务状态
 *         type: string
 *       - name: start_time
 *         in: query
 *         required: false
 *         description: 开始时间
 *         type: string
 *       - name: end_time
 *         in: query
 *         required: false
 *         description: 结束时间
 *         type: string
 *       - name: taskId
 *         in: query
 *         required: false
 *         description: 任务池ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.post('/taskinfo', TaskController.setTaskInfo);


/**
 * @swagger
 * /api/task/taskinfo:
 *   get:
 *     summary: 获取任务信息
 *     description: 获取任务信息
 *     tags:
 *       - Task
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.get('/taskinfo', TaskController.getTaskInfo);

/**
 * @swagger
 * /api/task/taskinfo:
 *   put:
 *     summary: 修改任务信息
 *     description: 修改任务信息
 *     tags:
 *       - Task
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *       - name: odom
 *         in: query
 *         required: false
 *         description: 里程
 *         type: string
 *       - name: path
 *         in: query
 *         required: false
 *         description: 路径
 *         type: string
 *       - name: task_state
 *         in: query
 *         required: false
 *         description: 任务状态
 *         type: string
 *       - name: start_time
 *         in: query
 *         required: false
 *         description: 开始时间
 *         type: string
 *       - name: end_time
 *         in: query
 *         required: false
 *         description: 结束时间
 *         type: string
 *       - name: taskId
 *         in: query
 *         required: false
 *         description: 任务池ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.put('/taskinfo', TaskController.updateTaskInfo);

/**
 * @swagger
 * /api/task/taskinfo:
 *   put:
 *     summary: 修改任务信息
 *     description: 修改任务信息
 *     tags:
 *       - Task
 *     parameters:
 *       - name: task_state
 *         in: query
 *         required: false
 *         description: 任务状态
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.put('/taskinfoState', TaskController.updateTaskInfoState);

/**
 * @swagger
 * /api/task/taskInfo:
 *   delete:
 *     summary: 删除任务信息
 *     description: 删除任务信息
 *     tags:
 *       - Task
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.delete('/taskInfo', TaskController.deleteTaskInfo);

/**
 * @swagger
 * /api/task/resultinfo:
 *   get:
 *     summary: 获取结果信息
 *     description: 获取结果信息
 *     tags:
 *       - Task
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.post('/resultinfo', TaskController.getResultInfo);

/**
 * @swagger
 * /api/task/security:
 *   get:
 *     summary: 获取安全检测
 *     description: 获取安全检测
 *     tags:
 *       - Task
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.get('/security', TaskController.getSecurity);

/**
 * @swagger
 * /api/task/resultinfo:
 *   get:
 *     summary: 获取结果信息PDF
 *     description: 获取结果信息PDF
 *     tags:
 *       - Task
 *     parameters:
 *       - name: taskId
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.post('/resultpdf', TaskController.getReportPDF);

/**
 * @swagger
 * /api/task/timedtask:
 *   post:
 *     summary: 创建定时任务
 *     description: 创建定时任务
 *     tags:
 *       - Task
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *       - name: task_state
 *         in: query
 *         required: false
 *         description: 任务状态
 *         type: string
 *       - name: start_time
 *         in: query
 *         required: false
 *         description: 开始时间
 *         type: string
 *       - name: taskId
 *         in: query
 *         required: false
 *         description: 任务池ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.post('/timedtask', TaskController.setTimedTask);


/**
 * @swagger
 * /api/task/timedtask:
 *   get:
 *     summary: 获取定时任务
 *     description: 获取定时任务
 *     tags:
 *       - Task
 *     parameters:
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.get('/timedtask', TaskController.getTimedTask);


/**
 * @swagger
 * /api/task/timedtask:
 *   delete:
 *     summary: 删除定时任务
 *     description: 删除定时任务
 *     tags:
 *       - Task
 *     parameters:
 *       - name: id
 *         in: query
 *         required: false
 *         description: 任务ID
 *         type: string
 *     responses:
 *       200:
 *         description: 成功获取
 *       400:
 *         description: 获取失败
 */
router.delete('/timedtask', TaskController.deleteTimedTask);

module.exports = router;