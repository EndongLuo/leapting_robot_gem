const { rosParam } = require('../schema/index');

// rosParam.sync({ alter: true });

class SettingModel {
  /**
   * 获取ros参数
   * @param null
   * @returns {Promise<*>}
   */
  static async getRosParam() {
    return await rosParam.findAll();
  }

}

module.exports = SettingModel;
