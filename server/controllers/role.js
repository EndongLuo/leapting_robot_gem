const RoleModel = require('../models/role');
const jwt = require('jsonwebtoken');
const ApiErrorNames = require('../error/ApiErrorNames.js')
const config = require('./../config/config');

class RoleController {
  /**
   * 创建角色
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getRole(ctx) {
    const req = ctx.request.body;
    console.log(req);
    if (req.rolename && req.text) {
      const result = await RoleModel.checkRole({
        rolename: req.rolename,
        text: req.text 
      });

      if (result !== null) {
        return ctx.body = ApiErrorNames.getErrorInfo(ApiErrorNames.USER_HAS_EXISTED)
      } else {
        const user = await RoleModel.createRole(req);
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

module.exports = RoleController;
