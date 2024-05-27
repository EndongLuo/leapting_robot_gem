const { request } = require('@/utils/request');

/**
 * @description 创建场地地图
 * @returns {Object}
 */
export const setSiteMap = data => request.post('/siteMap/setSiteMap', data);

/**
 * @description 获取所有场地名称
 * @returns {Array}
 */
export const getSiteName = data => request.post('/siteMap/getSiteName', data);

/**
 * @description 获取场地详细信息
 * @returns {Array}
 */
export const getSiteInfo = data => request.post('/siteMap/getSiteInfo', data);

/**
 * @description 获取MapTree
 * @returns {Array}
 */
export const getMapTree = data => request.post('/siteMap/getMapTree', data);

/**
 * @description 获取MapBlock
 * @returns {Array}
 */
export const getMapBlock = data => request.post('/siteMap/getMapBlock', data);


/**
 * @description 获取MapDot
 * @returns {Array}
 */
export const getMapDot = data => request.post('/siteMap/getMapDot', data);

/**
 * @description 更新场地信息
 * @returns {Array}
 */
export const updateSite = data => request.put('/siteMap/updateSite', data);