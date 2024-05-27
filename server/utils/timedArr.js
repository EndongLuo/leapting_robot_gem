const moment = require('moment');

function generateDateTimeArray({ taskDate, period, step, taskId }) {
  if (!taskDate || taskDate.length !== 2) {
      throw new Error('Invalid taskDate input');
  }

  const [startDateTimeString, endDateTimeString] = taskDate;
  const startDateTime = moment(startDateTimeString);
  const endDateTime = moment(endDateTimeString);

  if (startDateTime.isAfter(endDateTime)) {
      throw new Error('Start date-time must be before end date-time');
  }

  let dateTimes = [];

  while (startDateTime <= endDateTime) {
      // 直接构建所需的对象结构并加入数组
      dateTimes.push({
          start_time: startDateTime.clone().toISOString(), // 存储 ISO 格式的日期时间字符串
          taskId: taskId // 保留对应的任务 ID
      });

      switch (period) {
          case 'm':
              startDateTime.add(step, 'minutes');
              break;
          case 'H':
              startDateTime.add(step, 'hours');
              break;
          case 'D':
              startDateTime.add(step, 'days');
              break;
          case 'W':
              startDateTime.add(step, 'weeks');
              break;
          case 'M':
              startDateTime.add(step, 'months');
              break;
          case 'Y':
              startDateTime.add(step, 'years');
              break;
          default:
              throw new Error('Invalid period input');
      }
  }

  // 已直接构建了需要的对象格式，无需额外映射处理
  return dateTimes;
}

module.exports = { generateDateTimeArray }