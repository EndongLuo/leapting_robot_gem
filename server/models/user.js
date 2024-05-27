const { User, Role} = require('../schema/index')
const moment = require('moment');
const { cryptoPwd } = require('../utils/util');

class UserModel {
  /**
   * 注册
   * @param data
   * @returns {Promise<*>}
   */
  static async createUser(data) {
    return await User.create({
      username: data.username,
      password: data.password,
      roleId: 3,
      create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      update_time: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
  }

  /**
   * 检查用户名称是否存在
   * @param data
   * @returns {Promise<*>}
   */
  static async checkUser(data) {
    return await User.findOne({
      where: {
        username: data.username
      }
    });
  }

  /**
   * 查询用户名密码
   * @param data
   * @returns {Promise<*>}
   */
  static async findUser(data) {
    return await User.findOne({
      where: {
        username: data.username,
        password: cryptoPwd(data.password)
      },
      include: Role

    });
  }

  /**
   * 获取用户信息
   * @param id  用户id
   * @returns {Promise<Model>}
   */
  static async userInfo(id) {
    return await User.findOne(
      {
        where:{
          id,
        },
        include: Role
    });
  }

  /**
   * 更新用户头像
   * @param user_id
   * @returns {Promise<Model>}
   */
  static async updateUserAvatar(url, user_id) {
    try {
      return await User.update(
        {
          headimgurl: url
        },
        {
          where: {
            id: user_id
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }


  /**
   * 查询用户列表
   * @returns {Promise<*>}
   */
  static async findAllUserList() {
    return await User.findAll({
      attributes: ['id', 'username']
    })
  }

  /**
   * 查询用户信息
   * @param username  姓名
   * @returns {Promise.<*>}
   */
  static async username(username) {
    return await User.findOne({
      where: {
        username
      }
    })
  }
}

module.exports = UserModel;
