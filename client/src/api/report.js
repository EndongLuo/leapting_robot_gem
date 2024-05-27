const { request } = require('@/utils/request1');

export const getReport = ({taskId})=> request.get(`/report?taskId=${taskId}`);

// getReport({taskId:426})