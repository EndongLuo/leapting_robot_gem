const { request } = require('@/utils/request');


/**
 * @description 获取机器人
 * @returns {Object}
 */
export const getRobot = id => request.get(`/robot/robot?siteId=${id}`);
export const getRobots = id => request.get(`/robot/robots?siteId=${id}`);


/**
 * @description 修改机器人
 * @returns {Object}
 */
export const updateRobot = data => request.put(`/robot/robot`, data);


/**
 * @description 添加机器人
 * @returns {Object}
 */
export const addRobot = data => request.post(`/robot/robot`, data);


/**
 * @description 删除机器人
 * @returns {Object}
 */
export const deleteRobot = id => request.delete(`/robot/robot?id=${id}`);