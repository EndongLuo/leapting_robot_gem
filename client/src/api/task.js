const { request } = require('@/utils/request');

/**
 * @description 创建任务
 * @returns {Object}
 */
export const createTask = data => request.post('/task/task', data);

/**
 * @description 获取任务
 * @returns {Object}
 */
export const getTask = () => request.get('/task/task');

/**
 * @description 修改任务
 * @returns {Object}
 */
export const updateTask = () => request.put('/task/task');

/**
 * @description 删除任务
 * @returns {Object}
 */
export const deleteTask = id => request.delete(`/task/task?id=${id}`);

/**
 * @description 创建任务信息
 * @returns {Object}
 */
export const setTaskInfo = data => request.post('/task/taskinfo', data);


/**
 * @description 获取任务信息
 * @returns {Object}
 */
export const getTaskInfo = id => request.get(`/task/taskinfo?id=${id}`);

/**
 * @description 更新任务信息
 * @returns {Object}
 */
export const updateTaskInfo = data => request.put('/task/taskinfo', data);

/**
 * @description 更新任务信息状态
 * @returns {Object}
 */
export const updateTaskInfoState = data => request.put('/task/taskinfoState', data);


/**
 * @description 删除任务信息
 * @returns {Object}
 */
export const deleteTaskInfo = id => request.delete(`/task/taskInfo?id=${id}`);

/**
 * @description 获取结果信息
 * @returns {Object}
 */
export const getResultInfo = data => request.post('/task/resultinfo', data);

/**
 * @description 获取安全检测
 * @returns {Object}
 */
export const getSecurity = () => request.get('/task/security');

/**
 * @description 获取结果信息
 * @returns {Object}
 */
export const getReportPDF = data => request.post('/task/resultpdf', data);

/**
 * @description 创建定时任务
 * @returns {Object}
 */
export const setTimedTask = data => request.post('/task/timedtask', data);


/**
 * @description 获取定时任务
 * @returns {Object}
 */
export const getTimedTask = () => request.get('/task/timedtask');

/**
 * @description 删除定时任务
 * @returns {Object}
 */
export const deleteTimedTask = id => request.delete(`/task/timedtask?id=${id}`);