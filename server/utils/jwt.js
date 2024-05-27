const jwt = require("jsonwebtoken");
const config = require('../config/config');

// 创建 Token
const createToken = (userInfo) => {
  return jwt.sign(userInfo, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

//  验证 token 结果 (验证 secret 和 检查有效期 exp)
const authJwt = async (ctx,next) => {
  // console.log('authorization',ctx.headers.authorization);
  const token = ctx.headers.authorization || ''
  if (token.startsWith('Bearer ')) {
    const tokenStr = token.substring(7)
    try {
      const user = await jwt.verify(tokenStr, config.jwt.secret)
      ctx.state.user = user
    }
    catch (err) {
      ctx.throw(401, 'Invalid token')
    }
  }
  else {
    ctx.throw(401, 'Invalid token')
  }
  await next()
}


module.exports = {
  createToken,
  authJwt,
};