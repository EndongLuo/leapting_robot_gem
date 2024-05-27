const { User, Role} = require('../schema/index');

class RoleModel {
  /**
   * 创建角色
   * @param data
   * @returns {Promise<*>}
   */
  static async createRole(data) {
    return await Role.create({
      rolename: data.rolename,
      text: data.text,
    });
  }

  /**
   * 检查角色是否存在
   * @param data
   * @returns {Promise<*>}
   */
  static async checkRole(data) {
    return await Role.findOne({
      where: {
        rolename: data.rolename
      }
    });
  }

  /**
   * 查询用户名密码
   * @param data
   * @returns {Promise<*>}
   */
  static async findRole(data) {
    return await Role.findOne({
      where: {
        rolename: data.rolename
      }
    });
  }

}

module.exports = RoleModel;
