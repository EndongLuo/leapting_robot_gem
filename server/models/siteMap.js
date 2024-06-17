const { Site, User } = require('../schema/index')
const { sequelize } = require("../config/db");
const { Op, Sequelize, where } = require('sequelize');

class siteMapModel {
  static baseMap; // 静态属性，用于存储 baseMap
  // 表关系，创建
  static async init(tablename) {
    this.baseMap = require('../schema/baseMap')(sequelize, tablename);
    await this.baseMap.sync(); // force: alter
    // await this.baseMap.sync({ force: true }); // force: alter
    return this.baseMap;
  }
  // 创建场地
  static async createSite(data, userId) {
    const site = await Site.create({
      sitename: data.sitename,
      tablename: data.tablename,
      site_img: data.site_img,
      address: data.address,
      lat_lng: { lng: 0, lat: 0 },
      map: data.map,
      center: data.center,
      blocks: data.blocks,
      P: data.P,
      mapoffset: { to: 0, tx: 0, ty: 0, theta: 0 },
      e_fence: { type: 'FeatureCollection', features: [] },
      zoom: 0,
      data_save: 3,
    });
    await site.addUser(userId);
    return site;
  }

  // 批量创建地图
  static async createMapBulk(dataArray) {
    return await this.baseMap.bulkCreate(dataArray.map(data => ({
      id: data.id,
      PVMID: data.PVMID,
      sitename: data.sitename,
      block: data.block,
      row: data.row,
      section: data.section,
      num: data.num,
      col: data.col,
      center: data.center,
      zxjnav: data.zxjnav,
      fxjnav: data.fxjnav,
      position: data.position,
      qsnav: data.qsnav,
      pvm_height: 0,
    })));
  }

  // 查询所有场地名称
  static async getSiteName(uid) {
    return await User.findAll({
      where: { id: uid },
      include: {
        model: Site,
        where: { status: 1 },
        // attributes: ['id', 'sitename','tablename'],
        attributes: { exclude: ['map'] },
      }
    });
  }

  // 获取场地信息（地图）
  static async getSiteInfo(id) {
    return await Site.findAll({
      where: { id },
    });
  }

  // 获取场地偏移量
  static async getMapOffset(id) {
    return await Site.findAll({
      where: { id },
      attributes: ['mapoffset', 'tablename'],
    });
  }

  // 获取场地的子阵信息（地图）
  static async getSiteBlock(sitename) {
    return await Site.findAll({
      where: { sitename }
    });
  }

  // 获取场地信息（地图）
  static async getSiteEfence(id) {
    return await Site.findAll({
      where: { id },
      attributes: ['e_fence'],
    });
  }

  // 更新场地信息（地图）
  static async updateSite(data) {
    return await Site.update({
      sitename: data.sitename,
      address: data.address,
      lat_lng: data.lat_lng,
      center: data.center,
      zoom: data.zoom,
      data_save: data.data_save,
      e_fence: data.e_fence,
      mapoffset: data.mapoffset,
    }, {
      where: { id: data.id }
    });
  }

  // 获取地图
  static async getMap(mapName) {
    this.init(mapName)
    return await this.baseMap.findAll({
      attributes: ['sitename', 'block', 'row', 'section', 'PVMID', 'num', 'center'],
    });
  }

  static async getMapPVMID(mapName, {block, row, section, num}) {
    this.init(mapName);

    const whereClause = {};
    if (block !== undefined) whereClause.block = block;
    if (row !== undefined) whereClause.row = row;
    if (section !== undefined) whereClause.section = section;
    if (num !== undefined) whereClause.num = num;
    return await this.baseMap.findAll({
      where: whereClause,
      attributes: ['PVMID'],
    });
  }

  // 获取block
  static async getMapBlock(mapName, block) {
    this.init(mapName)
    return await this.baseMap.findAll({
      where: { block },
      attributes: ['PVMID', 'position'],
    });
  }

  // 获取MapDot
  static async getMapDot(data) {
    this.init(data.mapName)
    return await this.baseMap.findAll({
      where: { PVMID: data.PVMIDS },
      attributes: ['position', 'PVMID']
    });
  }
}

module.exports = siteMapModel;