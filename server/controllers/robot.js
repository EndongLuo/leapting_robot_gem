const RobotModel = require('../models/robot');

class RobotController {
  /**
   * 获取机器人
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getRobot(ctx) {
    try {
      const { siteId } = ctx.query;
      console.log('siteId', siteId);
      var res = await RobotModel.getRobot(siteId);

      if (res) {
        console.log('获取机器人成功');
        ctx.body = { code: 200, msg: '获取机器人成功', data: res };
      } else {
        ctx.body = { code: 400, msg: '获取机器人失败' };
      }
    } catch (error) {
      console.error('获取机器人错误', error);
      ctx.body = { code: 500, msg: '获取机器人错误' };
    }
  }

  /**
   * 修改机器人
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async updateRobot(ctx) {
    try {
      const data = ctx.request.body;
      const res = await RobotModel.updateRobot(data);

      if (res) {
        console.log('更新机器人成功');
        ctx.body = { code: 200, msg: '更新机器人成功', data: res };
      } else {
        ctx.body = { code: 400, msg: '更新机器人失败' };
      }
    } catch (error) {
      console.error('更新机器人失败', error);
      ctx.body = { code: 500, msg: '更新机器人失败' };
    }
  }


  /**
   * 添加机器人
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async addRobot(ctx) {
    try {
      const data = ctx.request.body;
      const res = await RobotModel.addRobot(data);

      if (res) {
        console.log('添加机器人成功');
        ctx.body = { code: 200, msg: '添加机器人成功', data: res };
      } else {
        ctx.body = { code: 400, msg: '添加机器人失败' };
      }
    } catch (error) {
      console.error('添加机器人失败', error);
      ctx.body = { code: 500, msg: '添加机器人失败' };
    }
  }


    /**
 * 删除机器人
 * @param ctx
 * @returns {Promise.<void>}
 */
    static async deleteRobot(ctx) {
      try {
        const id = ctx.query.id;
        const res = await RobotModel.deleteRobot(id);
        
        if (res) {
          console.log('删除机器人成功');
          ctx.body = { code: 200, msg: '删除机器人成功' };
        } else {
          ctx.body = { code: 400, msg: '删除机器人失败' };
        }
      } catch (error) {
        console.error('删除机器人错误', error);
        ctx.body = { code: 500, msg: '删除机器人错误' };
      }
    }
  
  

}

module.exports = RobotController;
