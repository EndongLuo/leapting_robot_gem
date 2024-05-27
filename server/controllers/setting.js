const SettingModel = require('../models/setting');

class SettingController {
  /**
   * 获取ros参数
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getRosParam(ctx) {
    try {
      var res = await SettingModel.getRosParam();
      // console.log(res);
      if (res) {
        ctx.body = { code: 200, msg: '获取Ros参数成功', data: res };
        console.log('获取Ros参数成功');
      } else {
        ctx.body = { code: 400, msg: '获取Ros参数失败' };
      }

    } catch (error) {
      console.error('获取Ros参数错误', error);
      ctx.body = { code: 500, msg: '获取Ros参数错误' };
    }

  }

}


module.exports = SettingController;
