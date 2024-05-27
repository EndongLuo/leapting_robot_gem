const { request } = require('@/utils/request');

/**
 * @description 获取Ros参数
 * @returns {Object}
 */
export const getRosParam = () => request.get('/setting/rosparam');