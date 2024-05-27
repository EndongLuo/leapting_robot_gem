const { getMapOffset } = require('../models/siteMap');

class MapTransformer {
  static mapoffset = { tx: 0, ty: 0, theta: 0, to: 0 };

  // 获取地图偏移量
  static async loadSiteInfo(ctx) {
    const { siteId } = ctx.query;

    try {
      const res = await getMapOffset(siteId);

      if (!res || res.length === 0) {
        ctx.body = { code: 400, msg: '获取失败' };
        return;
      }
      // console.log(res[0]);
      const mapoffset = res[0].mapoffset;
      Object.keys(mapoffset).forEach(key => {
        this.mapoffset[key] = parseFloat(mapoffset[key]);
      });

      // console.log('mapoffset',this.mapoffset);
      ctx.body = { code: 200, msg: '获取成功', data: res };
    } catch (error) {
      console.error(`loadSiteInfo:  ${siteId}`, error);
      throw error;
    }
  }

  mapOffset(poses) {
    if (Array.isArray(poses)) return poses.map(i => ({
      pose: { position: this.poseFn(i.pose.position), orientation: this.orienteFn(i.pose.orientation) }
    }));
    else return { position: this.poseFn(poses.position), orientation: this.orienteFn(poses.orientation) };
  }

  mapInverseOffset(poses) {
    if (Array.isArray(poses)) return poses.map(i => ({
      pose: { position: this.poseInverseFn(i.pose.position), orientation: this.orienteInverseFn(i.pose.orientation) }
    }));
    else return { position: this.poseInverseFn(poses.position), orientation: this.orienteInverseFn(poses.orientation) };
  }

  // 点位正转换
  poseFn({ x, y }) {
    const { tx, ty, theta } = MapTransformer.mapoffset;
    return {
      x: Math.cos(theta) * (x - tx) + Math.sin(theta) * (y - ty),
      y: -Math.sin(theta) * (x - tx) + Math.cos(theta) * (y - ty),
    };
  }

  // 点位逆转换
  poseInverseFn({ x, y }) {
    const { tx, ty, theta } = MapTransformer.mapoffset;
    return {
      x: Math.cos(theta) * x - Math.sin(theta) * y + tx,
      y: Math.sin(theta) * x + Math.cos(theta) * y + ty,
      z: 0,
    };
  }

  // 方向正转换
  orienteFn(orientation) {
    const { theta, to } = MapTransformer.mapoffset;
    var { yaw } = this.quaternionToEuler(orientation);
    yaw = -(yaw + theta) * 180 / Math.PI - to;
    return yaw;
  }

  // 方向逆转换
  orienteInverseFn(yaw) {
    const { theta, to } = MapTransformer.mapoffset;
    yaw = -(yaw + to) * Math.PI / 180 - theta;
    return this.eulerToQuaternion(0, 0, yaw);
  }

  // 四元数到欧拉角的转换
  quaternionToEuler({ x, y, z, w }) {
    const roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x ** 2 + y ** 2));
    const pitch = Math.asin(2 * (w * y - z * x));
    const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y ** 2 + z ** 2));

    return { roll, pitch, yaw };
  }

  // 欧拉角到四元数的转换
  eulerToQuaternion(roll, pitch, yaw) {
    const cy = Math.cos(yaw / 2);
    const sy = Math.sin(yaw / 2);
    const cp = Math.cos(pitch / 2);
    const sp = Math.sin(pitch / 2);
    const cr = Math.cos(roll / 2);
    const sr = Math.sin(roll / 2);

    const w = cr * cp * cy + sr * sp * sy;
    const x = sr * cp * cy - cr * sp * sy;
    const y = cr * sp * cy + sr * cp * sy;
    const z = cr * cp * sy - sr * sp * cy;

    return { x, y, z, w };
  }
}

module.exports = MapTransformer;