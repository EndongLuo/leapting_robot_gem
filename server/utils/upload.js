const moment = require('moment');
const fs = require("fs");
const multer = require("koa-multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let date = moment().format('YYYY-MM-DD HH:mm:ss');
    let path = "./public/uploads/DXF";
    let stat = fs.existsSync(path);
    if (!stat) fs.mkdirSync(path);
    
    cb(null, path);
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//如需其他设置，请参考multer的limits,使用方法如下。
//var upload = multer({
//    storage,
//    limits
// });
const upload = multer({
  storage,
});
module.exports = upload;