const { Robot } = require('../schema/index');
const { Op } = require("sequelize");

class RobotModel {
  // 创建机器人
  static async addRobot(data) {
    return await Robot.create({
      robotname: data.robotname,
      ip: data.ip,
      ptzurl: { h: "", k: "", q: "" },
      robot_type: data.robot_type,
      siteId: data.siteId
    });
  }

  // 获取机器人
  static async getRobot(siteId) {
    return await Robot.findAll({
      where: { status: 1, siteId },
    });
  }

  // 删除任务
  static async deleteRobot(id) {
    // return await Robot.destroy({ where: { id } });
    // 软删除
    return await Robot.update({ status: 0 }, { where: { id } });
  }


  // 更新机器人信息
  static async updateRobot(data) {
    return await Robot.update({
      robotname: data.robotname,
      ip: data.ip,
      ptzurl: data.ptzurl,
      robot_type: data.robot_type,
    }, {
      where: { id: data.id }
    });
  }


}

module.exports = RobotModel;