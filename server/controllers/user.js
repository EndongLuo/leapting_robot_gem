const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const ApiErrorNames = require('../error/ApiErrorNames.js')
const config = require('./../config/config');
const swaggerJSDoc = require('swagger-jsdoc');
const { createToken, authJwt} = require('../utils/jwt')

class UserController {
  /**
   * 注册
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async register(ctx) {
    const req = ctx.request.body;
    console.log(req);
    if (req.username && req.password) {
      const result = await UserModel.checkUser({
        username: req.username,
        password: req.password
      });

      if (result !== null) {
        return ctx.body = ApiErrorNames.getErrorInfo(ApiErrorNames.USER_HAS_EXISTED)
      } else {
        const user = await UserModel.createUser(req);
        if (user) {
          ctx.body = ApiErrorNames.getSuccessInfo()
        } else {
          ctx.body = ApiErrorNames.getErrorInfo(ApiErrorNames.USER_REGISTER_ERROR)
        }
      }
    } else {
      ctx.body = ApiErrorNames.getErrorInfo(ApiErrorNames.PARAM_NOT_COMPLETE)
    }
  }

  /**
   * 登录
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async login(ctx) {
    const req = ctx.request.body;
    // console.log('user constrollers',ctx.request);
    console.log('user constrollers',req);
    if (req.username && req.password) {
      const result = await UserModel.findUser(req);
      // findOne 查询空时为null
      if (result !== null) {
        const payload = {
          user_id: result.id,
          username: result.username
        };
        // console.log(result.role.rolename);

        const token = createToken(payload);

        ctx.body = {
          code: 200,
          msg: '登录成功',
          data:{
            token,
            role:result.role.rolename
          }
          
        };
      } else {
        ctx.body = ApiErrorNames.getErrorInfo(ApiErrorNames.USER_LOGIN_ERROR)
      }
    } else {
      ctx.body = ApiErrorNames.getErrorInfo(ApiErrorNames.PARAM_IS_INVALID)
    }
  }

  /**
   * 获取用户信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getUserInfo(ctx) {
    const user = ctx.state.user;
    console.log(ctx.state);

    if (user.user_id) {
      const result = await UserModel.userInfo(user.user_id);
      // console.log('getUserInfo',result);
      if (result) {
        ctx.body = {
          code: 200,
          msg: '查询成功',
          data:{
            result,
            role:result.role.rolename
          } 
          
        };
      } else {
        ctx.body = {
          code: 400,
          msg: '查询失败'
        };
      }
    } else {
      ctx.body = {
        code: 400,
        msg: '缺少user_id'
      };
    }
  }

  /**
   * 更新用户头像
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async updateUserAvatar(ctx) {
    const user_id = ctx.state.user.user_id;
    const req = ctx.request.body;
    if (req.headimgurl) {
      const result = await UserModel.updateUserAvatar(
        req.headimgurl,
        user_id
      );
      if (result) {
        ctx.body = {
          code: 200,
          msg: '用户头像保存成功',
          data: {
            result
          }
        };
      } else {
        ctx.body = {
          code: 400,
          msg: '用户头像保存失败'
        };
      }
    } else {
      ctx.body = {
        code: 400,
        msg: '缺少参数'
      };
    }
  }
}


/* 获取一个期限为1小时的token */
function getToken(payload = {}) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

/* 通过headers的token获取JWT的payload部分 */
function getJWTPayload(token) {
  // 验证并解析JWT
  return jwt.verify(token.split(' ')[1], config.jwt.secret);
}

module.exports = UserController;
