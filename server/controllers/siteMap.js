const siteMapModel = require('../models/siteMap');
const { dxf2geojson } = require('../utils/dxf2geojson');
const arrayToTree = require('../utils/arrayToTree');
const fs = require('fs');
const util = require('util');
const path = require('path');
let tree = [];

// 使用util.promisify将fs.unlink转换为返回Promise的函数，便于使用async/await
const unlinkAsync = util.promisify(fs.unlink);

class siteMapController {
  /**
   * 创建场地地图
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async setSiteMap(ctx) {
    try {
      const req = ctx.request.body;
      req.tablename = `map_${req.fileName.split('.')[0]}`;

      const dxf2geojsonPromise = dxf2geojson(req.fileName, req.P, req.toward);
      const initTablePromise = siteMapModel.init(req.tablename);

      const res = await dxf2geojsonPromise;
      req.map = res.geojsons;
      req.blocks = res.blocks;
      req.center = res.mapCenter;
      const userId = ctx.state.user.user_id;
      const siteResPromise = siteMapModel.createSite(req, userId);

      const createMapRequests = res.flatArr.map(i => {
        let obj = { ...i, sitename: req.sitename };

        // console.log(req.toward);
        // const offset = 3.715;
        const offset = 3.23;
        // 横
        if (Number(req.toward)) {
          obj.qsnav = [i.center[0], i.center[1] + 1.339];
          obj.zxjnav = [i.center[0], i.center[1] - offset];
          obj.fxjnav = [i.center[0], i.center[1] + offset];
        } else {
          obj.qsnav = [i.center[0] - 1.1, i.center[1]];
          obj.zxjnav = [i.center[0] - 3.1, i.center[1]];
          obj.fxjnav = [i.center[0] + 3.1, i.center[1]];
        }
        return obj

      });

      await initTablePromise;
      await siteMapModel.createMapBulk(createMapRequests);
      const siteRes = await siteResPromise;

      if (siteRes) ctx.body = { code: 200, msg: '创建场地成功' };
      else ctx.body = { code: 400, msg: '创建场地失败' };

      // 删除DXF文件
      const filePath = path.join(__dirname, '../public/uploads/DXF/', req.fileName);
      await unlinkAsync(filePath).catch((error) => {
        console.error('删除DXF文件失败', error);
      });

    } catch (error) {
      console.error('创建场地地图错误', error);
      ctx.body = { code: 500, msg: '创建场地地图错误' };
    }
  }

  /**
   * 获取所有场地名称
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getSiteName(ctx) {
    try {
      const { uid } = ctx.request.body;
      // console.log(uid);
      const res = await siteMapModel.getSiteName(uid);
      //  console.log(res[0].sites);
      if (res) {
        ctx.body = {
          code: 200,
          msg: '获取所有场地名称成功',
          data: [...res[0].sites]
        };
      } else {
        ctx.body = {
          code: 400,
          msg: '获取所有场地名称失败'
        };
      }
    } catch (error) {
      console.error('获取所有场地名称错误', error);
      ctx.body = {
        code: 500,
        msg: '获取所有场地名称错误'
      };
    }
  }

  /**
   * 获取场地信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async getSiteInfo(ctx) {
    try {
      let res = null;
      const req = ctx.request.body;
      if (req.id) {
        res = await siteMapModel.getSiteInfo(req.id);
        // console.log(req.block,res[0].map[req.block]);
        res[0].map = res[0].map[req.block || 'All'];
      }
      // else if (req.sitename) res = await siteMapModel.getSiteBlock(req.sitename);


      if (res) ctx.body = { code: 200, msg: '获取场地信息成功', data: res[0] };
      else ctx.body = { code: 400, msg: '获取场地信息失败' };

    } catch (error) {
      console.error('获取场地信息错误', error);
      ctx.body = { code: 500, msg: '获取场地信息错误' };
    }
  }



  /**
   * 更新场地信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async updateSite(ctx) {
    try {
      const data = ctx.request.body;
      // console.log(data);
      if (data.e_fence) {
        console.log('更新场地信息-电子围栏', data.e_fence);
      }
      var res = await siteMapModel.updateSite(data);

      if (res) {
        console.log('更新场地信息成功');
        ctx.body = { code: 200, msg: '更新场地信息成功', data: res };
      } else ctx.body = { code: 400, msg: '更新场地信息失败' };

    } catch (error) {
      console.error('更新场地信息错误', error);
      ctx.body = { code: 500, msg: '更新场地信息错误' };
    }
  }

  /**
 * 获取mapTree
 * @param ctx
 * @returns {Promise.<void>}
 */
  static async getMapTree(ctx) {
    try {
      const { name, id, label, treeId } = ctx.request.body;
      console.log('label', label, 'treeId', treeId);

      if (!tree[name]) {
        const res = await siteMapModel.getMap(name);
        tree[name] = arrayToTree(res);
      }

      const filteredData = newTree(tree[name], label, treeId);
      console.log(filteredData);


      // // 并行获取多个场地信息
      // const names = name.split(',');
      // const siteMaps = await Promise.all(names.map(n => siteMapModel.getMap(n)));
      // const results = siteMaps.flat(); // 将所有结果合并到一个数组中

      // // 获取电子围栏
      // const [{ dataValues: { e_fence: { features } } }] = await siteMapModel.getSiteEfence(id);
      // const fences = features.map(i => i.geometry.coordinates[0]);

      // // 过滤掉在任何电子围栏内的点
      // const Points = results.filter(point => !fences.some(fence => isPointInPolygon(point.center, fence)));

      // if (Points.length) {
      if (filteredData.length) {
        // var tree = arrayToTree(Points);
        ctx.body = { code: 200, msg: '获取mapTree成功', data: filteredData };
      } else ctx.body = { code: 400, msg: '获取mapTree失败' };
    } catch (error) {
      console.error('获取mapTree错误', error);
      ctx.body = { code: 500, msg: '获取mapTree错误' };
    }
  }

  /**
 * 获取mapBlock
 * @param ctx
 * @returns {Promise.<void>}
 */
  static async getMapBlock(ctx) {
    try {
      const { name, block } = ctx.request.body;

      // 获取电子围栏
      const res = await siteMapModel.getMapBlock(name, block);
      // console.log(res);


      if (res.length) {
        // var tree = arrayToTree(Points);
        ctx.body = { code: 200, msg: '获取mapTree成功', data: res };
      } else ctx.body = { code: 400, msg: '获取mapTree失败' };
    } catch (error) {
      console.error('获取mapTree错误', error);
      ctx.body = { code: 500, msg: '获取mapTree错误' };
    }
  }

  // static async getMapTree(ctx) {
  //   try {
  //     const { name, id } = ctx.request.body;

  //     // 获取多个场地信息
  //     var names = name.split(',');
  //     var res = await names.reduce(async (accumulatorPromise, currentValue) => {
  //       const accumulator = await accumulatorPromise; // 确保上个累加器处理完毕
  //       const result = await siteMapModel.getMap(currentValue);
  //       return [...accumulator, ...result]; // 拼接上一个累加器的结果和当前结果
  //     }, Promise.resolve([])); // 初始值设为解决了的 Promise 包裹的空数组

  //     // 获取电子围栏
  //     var res1 = await siteMapModel.getSiteEfence(id);
  //     const features = res1[0].dataValues.e_fence.features;

  //     var fences = features.map(i => i.geometry.coordinates[0])
  //     console.log(fences);

  //     var Points = res.filter(i => {
  //       for (let fence of fences) {
  //         if (isPointInPolygon(i.center, fence)) {
  //           return false;
  //         }
  //       }
  //       return true;
  //     });

  //     if (res) {
  //       var tree = arrayToTree(Points);
  //       ctx.body = { code: 200, msg: '获取mapTree成功', data: tree };
  //     } else ctx.body = { code: 400, msg: '获取mapTree失败' };
  //   } catch (error) {
  //     console.error('获取mapTree错误', error);
  //     ctx.body = { code: 500, msg: '获取mapTree错误' };
  //   }
  // }

  /**
 * 获取getMapDot
 * @param ctx
 * @returns {Promise.<void>}
 */
  static async getMapDot(ctx) {
    try {
      const data = ctx.request.body;
      data.PVMIDS = data.PVMIDS.split(',')
      console.log(data.PVMIDS);
      const res = await siteMapModel.getMapDot(data);
      res.forEach(i => {
        i.position = JSON.parse(i.position);
      });
      if (res) {
        // console.log('getMapDot',res); 
        ctx.body = {
          code: 200,
          msg: '获取成功',
          data: res
        };
      } else {
        ctx.body = {
          code: 400,
          msg: '获取失败'
        };
      }
    } catch (error) {
      console.error('获取getMapDot错误', error);
      ctx.body = {
        code: 500,
        msg: '获取getMapDot错误'
      };
    }
  }
}

module.exports = siteMapController;


// function newTree(treeData, label, treeId) {
//   let targetNode = null;
//   const stack = [];
//   let stackIndex = 0;

//   // 初始将treeData中的所有节点加入栈中
//   for (let i = treeData.length - 1; i >= 0; i--) {
//     stack[stackIndex++] = treeData[i];
//   }

//   // 使用一个哈希表来快速查找节点
//   const nodeMap = new Map();
//   while (stackIndex > 0) {
//     const node = stack[--stackIndex];
//     nodeMap.set(node.id, node);

//     if (node.label === label || node.id === treeId) {
//       targetNode = node;
//       break; // 找到目标节点后立即停止遍历
//     }

//     if (node.children) {
//       for (let i = node.children.length - 1; i >= 0; i--) {
//         stack[stackIndex++] = node.children[i]; // 将子节点加入栈中
//       }
//     }
//   }

//   if (targetNode && targetNode.children) {
//     const result = new Array(targetNode.children.length);
//     for (let i = 0; i < targetNode.children.length; i++) {
//       const child = targetNode.children[i];
//       result[i] = {
//         id: child.id,
//         label: child.label,
//         leaf: !child.children || child.children.length === 0
//       };
//     }
//     return result;
//   }

//   return [];
// }


// function newTree(treeData, label, treeId) {
//   let result = [];

//   function findNode(data) {
//     for (const node of data) {
//       if (node.label === label) {
//         if (node.children) {
//           result = node.children.map(child => ({ id: child.id, label: child.label, leaf: !child.children || child.children.length === 0 }));
//         }
//         return true;  // 节点找到，提前返回
//       } else if (node.id === treeId) {
//         result = node.children.map(child => ({ id: child.id, label: child.label, leaf: true }));
//         return true;  // 节点找到，提前返回
//       }

//       if (node.children && findNode(node.children)) {
//         return true;  // 节点找到，提前返回
//       }
//     }
//     return false;  // 节点未找到
//   }

//   findNode(treeData);
//   return result;
// }

function newTree(treeData, label, treeId) {
  let result = [];

  function findNode(data) {
    for (const node of data) {
      if (node.label === label && node.id === treeId) {
        if (node.children) {
          result = node.children.map(child => ({ id: child.id, label: child.label, leaf: !child.children || child.children.length === 0 }));
        }
        return true;  // 节点找到，提前返回
      } else if (node.id === treeId) {
        result = node.children.map(child => ({ id: child.id, label: child.label, leaf: true }));
        return true;  // 节点找到，提前返回
      }

      if (node.children && findNode(node.children)) {
        return true;  // 节点找到，提前返回
      }
    }
    return false;  // 节点未找到
  }

  findNode(treeData);
  return result;
}

function isPointInPolygon(point, polygon) {
  let [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}