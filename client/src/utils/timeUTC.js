/**
 * UTC时间转换
 * @returns {string}
 * @param datetime UTC时间
 * @param dateSeprator 日期拼接符
 * @param timeSeprator 时间拼接符
 * @Eexample dateFormat("2021-09-03T22:42:05.659+00:00", "/", ":")
 *           dateFormat("2021-09-03T22:42:05.659+00:00")
 */
export function transTimestamp(datetime, dateSeprator = '/', timeSeprator = ':') {
    if (datetime) {
      const date = new Date(datetime)
      const year = `${date.getUTCFullYear()}`
      let month = `${date.getUTCMonth() + 1}`
      let day = `${date.getUTCDate()}`
      let hour = `${date.getUTCHours()}`
      let minute = `${date.getUTCMinutes()}`
      let second = `${date.getUTCSeconds()}`
  
      if (month.length === 1) {
        month = `0${month}`
      }
      if (day.length === 1) {
        day = `0${day}`
      }
      if (day.length === 1) {
        day = `0${day}`
      }
      if (hour.length === 1) {
        hour = `0${hour}`
      }
      if (minute.length === 1) {
        minute = `0${minute}`
      }
      if (second.length === 1) {
        second = `0${second}`
      }
      return `${year}${dateSeprator}${month}${dateSeprator}${day} ${hour}${timeSeprator}${minute}${timeSeprator}${second}`
    }
  }
  

  export function  formatDate(time) {
    // console.log(time);
    const offset = 8 * 60 * 60 * 1000; // 8小时的毫秒数
    const date = new Date(new Date(time).getTime() + offset);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };
  
  