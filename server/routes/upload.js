const router = require('koa-router')();

// const Koa = require('koa')
// const app = new Koa()
// const {koaBody} = require('koa-body');
// const multer = require('koa-multer');
// // 处理文件上传的中间件
// const storage = multer.diskStorage({
//   destination (req, file, cb) {
//     console.log(file, cb);
//     console.log('aaa',file);
//     cb(null, './JSON'); // 指定上传文件的存储目录
//   },
//   filename (req, file, cb) {
//     cb(null, file.originalname); // 指定上传文件的文件名
//   }
// });
// const upload = multer({ storage });

// // 使用koa-body中间件来解析请求体
// app.use(koaBody({ multipart: true }));

const upload = require('../utils/upload');

// console.log('upload',upload,upload.single('file'));

// 处理文件上传的路由
router.post('/upload', upload.single('file'), async (ctx) => {
  // console.log(ctx);
  const file = ctx.request.files; // 获取上传的文件对象
  console.log(file);
  // 进行相应的处理，比如保存文件信息到数据库等

  ctx.body = '文件上传成功';
});

module.exports = router