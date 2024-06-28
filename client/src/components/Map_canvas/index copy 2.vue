<template>
  <div @contextmenu.prevent>
    <div style="position: fixed; top: 100px;left: 300px; z-index: 1001;">
      <el-select v-model="changeBlock" :placeholder="changeBlock" @change="changeBlockChange">
        <el-option v-for="b, i in blockName" :label="b" :value="b" :key="i"></el-option>
        <!-- <el-option label="区域一" value="shanghai"></el-option>
      <el-option label="区域二" value="beijing"></el-option> -->
      </el-select>

    </div>
    <l-map ref="map" @click="innerClick" style="height: calc(100vh - .15rem); width: 100%" :center="center"
      :options="mapOptions" :zoom="zoom" @mousedown="startAddingMarker" @mouseup="stopAddingMarker">
      <div v-for="r in Robots" :key="r.id">

        <l-polyline :lat-lngs="Robot[r.ip].navPath" :options="polylineOptions" />
        <!-- <l-polyline :lat-lngs="Robot[r.ip].navPath" :options="mainPathOptions" /> -->
        <!-- <l-polyline :lat-lngs="Robot[r.ip].navPath" :options="dashPathOptions" /> -->
        <!-- <l-marker v-for="(point, index) in Robot[r.ip].navPath" :key="index" :lat-lng="point" :icon="getArrowIcon(r.ip,index)" /> -->
        <!-- 点云 -->
        <l-marker-cluster>
          <l-marker v-for="m, i in Robot[r.ip].scanPoints" :key="i" :lat-lng="[m.y, m.x]"
            :icon="scanPointsIcon"></l-marker>
        </l-marker-cluster>

        <!-- robotPose -->
        <l-marker :lat-lng="Robot[r.ip].robotPose" :options="Robot[r.ip].markerOp" :icon="customIcon">
          <l-tooltip>{{ r.robotname }}</l-tooltip>
        </l-marker>
      </div>

      <l-geo-json :geojson="lz" :options="lzJsonOptions" :options-style="resetHighlight"></l-geo-json>

      <l-geo-json :geojson="totalJson" :options="totalJsonOptions" :options-style="resetHighlight"></l-geo-json>
      <l-geo-json :geojson="geojson" :options="geoJsonOptions" :options-style="styleFunction"></l-geo-json>

      <l-marker v-if="isAddingMarker" :lat-lng="currentMarkerLatLng" :options="markerOp1" :icon="markerIcon"></l-marker>
      <l-marker v-if="isdot" :lat-lng="currentMarkerLatLng" :icon="dotIcon"></l-marker>



      <!-- <l-feature-group>
        <l-geo-json :geojson="totalJson" :options-style="e_fenceStyle"></l-geo-json>
        <l-polygon v-for="(p, i) in blocks" :key="i" :lat-lngs="p.position"></l-polygon>
      </l-feature-group> -->


      <!---
      <l-feature-group ref="drawnItems">
        <l-geo-json :geojson="e_fence" :options-style="e_fenceStyle"></l-geo-json>
        <l-tooltip>电子围栏</l-tooltip>
      </l-feature-group>
      --->

    </l-map>
  </div>
</template>

<script>
import L, { CRS, Control, Draw } from "leaflet";
import { LMap, LIcon, LTileLayer, LMarker, LGeoJson, LControl, LPolyline, LPolygon, LTooltip, LFeatureGroup, LMarkerCluster } from 'vue2-leaflet';
import { mapState, mapActions, mapGetters } from 'vuex';
import { getSiteName, getSiteInfo, getMapTree, updateSite, getMapBlock } from '@/api/siteMap';
import { db } from "@/utils/db";
import 'leaflet-rotatedmarker';
import 'leaflet-draw';

import lz from './wj_2p_lz.json'

// 大量点位
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

export default {
  props: ['initialpose', 'nowpose', 'IP'],
  data() {
    return {
      lz: null,
      scanPointsIcon: L.icon({
        iconUrl: require('./img/cp.png'), // 自定义图标的路径
        iconSize: [10, 10], // 图标尺寸
        iconAnchor: [5, 16],
      }),
      list: [],
      blockName: [],
      changeBlock: localStorage.getItem('changeBlock') || localStorage.getItem('site'),
      blocks: [
        {
          PVMID: 'B1_R1_S1_1',
          position: [[46.18500000000046, 35.84428210489825], [47.319, 35.84428210489825], [47.319, 33.87147623507726], [46.18500000000046, 33.87147623507726], [46.18500000000046, 35.84428210489825]]
        },
        {
          PVMID: 'B1_R1_S1_2',
          position: [[47.33900000000046, 35.84428210489825], [48.473, 35.84428210489825], [48.473, 33.87147623507726], [47.33900000000046, 33.87147623507726], [47.33900000000046, 35.84428210489825]]
        },
      ],
      marker1: [525589.6412658691, 1060216.533457116],
      dots: [],
      mapOptions: {
        // dragging: false, // 禁止拖动
        maxZoom: 5,
        attributionControl: false,
        doubleClickZoom: false,
        crs: CRS.EPSG4326,
        preferCanvas: true,
        // drawControl: true,
        zoomControl: false
      },
      customIcon: L.icon({
        iconUrl: require('./img/robot.png'), // 自定义图标的路径
        iconSize: [32, 32], // 图标尺寸
        iconAnchor: [16, 16],
      }),
      miniMapPosition: "bottomright", // 鹰眼控件位置S
      zoom: 0,
      geojson: null,
      enableTooltip: true,
      formLabelWidth: '200',
      sites: [],
      site: localStorage.getItem('site'),
      markerLatLng: [-1000, -1000],
      fillColor: '#3388ff',
      e_fenceStyle: {
        weight: 1,
        color: '#F56C6C',
        opacity: 1,
        fillColor: "#F56C6C50",
        fillOpacity: 1
      },
      highlightStyle: {
        weight: 1,
        color: '#40a5f4',
        opacity: 1,
        fillColor: "#04ffff",
        fillOpacity: 1
      },
      resetHighlight: {
        weight: 1,
        color: "#ECEFF1",
        opacity: 0.5,
        fillColor: "#3388ff",
        fillOpacity: 0.1
      },
      taskNodeStyle: {
        weight: 1,
        color: "#ECEFF1",
        opacity: 0.5,
        fillColor: "#edeff6",
        fillOpacity: 0.2
      },
      doneNodeStyle: {
        weight: 1,
        color: "#ECEFF1",
        opacity: 0.5,
        fillColor: "#67C23A",
        fillOpacity: 1
      },
      navName: '', // 导航名称
      polylineOptions: {
        color: '#00bd00',
        weight: 10,
        opacity: 0.7,
        smoothFactor: 1.0,    // Smooth factor (0.0 to 1.0)
        fillColor: "#00bd00",
        fillOpacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round'
      },
      mainPathOptions: {
        color: '#00BFFF',      // 主路径颜色（深蓝色）
        weight: 8,             // 主路径宽度
        opacity: 0.9,          // 主路径透明度
        lineJoin: 'round'      // 主路径连接方式
      },
      dashPathOptions: {
        color: '#00aaff',    // 虚线路径颜色
        weight: 5,           // 线宽
        opacity: 0.5,        // 透明度
        dashArray: '10, 10', // 虚线样式
        lineJoin: 'round'    // 线连接方式
      },
      mapName: localStorage.getItem('mapName'),
      geoJsonOptions: null,

      isAddingMarker: false,
      currentMarkerLatLng: [0, 0], // 初始化为无效值
      markerIcon: L.icon({
        iconUrl: require('./img/nav.png'), // 替换成您的图标路径
        iconSize: [32, 32], // 调整图标大小
        iconAnchor: [16, 16],
      }),
      dotIcon: L.icon({
        iconUrl: require('./img/dot.png'), // 替换成您的图标路径
        iconSize: [32, 32], // 调整图标大小
        iconAnchor: [16, 16],
      }),
      isdot: false,
      markerOp1: {
        rotationAngle: 0
      },
      count: 1,
      isStart: false,
      center: JSON.parse(localStorage.getItem('center')) || [0, 0],
      // taskState: {},
      timer: null,
      nowTime: '',
      forceUpdate: 0,
      drawnItems: null,
      e_fence: null,
      totalJson: null,
      totalJsonOptions: null,
      lzJsonOptions: null,
    };
  },
  components: { LMap, LIcon, LTileLayer, LMarker, LGeoJson, LControl, LPolyline, LPolygon, LTooltip, LFeatureGroup, LMarkerCluster },
  async created() {
    console.log(lz);
    this.lz = lz;
    this.site = localStorage.getItem('site')
    this.list = await db.maps.where("sitename").equals(`${this.site}`).toArray();
    this.totalJson = this.list[0].total;
    this.$store.commit('socket/SET_TOTALJSON', { totalJson: this.totalJson, P: this.list[0].P });
    this.zoom = JSON.parse(localStorage.getItem('zoom')) || 0;
    // console.log(this.list);

    // if (this.list.length) {
    //   // this.$loading.show();
    //   // console.log(this.list[0].map);
    //   this.geojson = this.list[0].map[`${this.changeBlock}`];
    //   // this.geojson = JSON.parse(list[0].map);
    //   this.center = JSON.parse(localStorage.getItem('center'))|| [0, 0];
    //   this.zoom = this.list[0].zoom;
    //   // this.$loading.hide();
    // }
    // else this.changeMap();

    // test
    // const res = await getSiteInfo({ sitename: this.site });
    this.blockName = this.list[0].blocks

  },
  computed: {
    ...mapState('socket', ['Robot', 'ips', 'Robots', 'taskState', 'siteId', 'blockNames']),
    ...mapGetters(['uid']),
    Robot() {
      return this.$store.state.socket.Robot;
    },
    styleFunction() {
      var fillColor = this.fillColor
      return () => {
        return {
          weight: 1,
          color: "#ECEFF1",
          opacity: 0.5,
          fillColor: fillColor,
          fillOpacity: 0.5
        }
      };
    },
  },
  watch: {
    blockNames(val, oldVal) {
      try {
        // console.log('watch blockName', val, oldVal);
        this.changeBlock = val;
        this.changeBlockChange(val);
      } catch (error) {
        console.log(error);
      }

      // this.geojson = this.list[0].map[`${val}`];
      // var c = this.list[0].map[`${val}`].features[0].properties.center;
      // this.center = [c[1],c[0]];
      // localStorage.setItem('changeBlock',val)
      // localStorage.setItem('center',JSON.stringify(this.center))
    },
    taskState(val, oldVal) {
      // console.log('watch 2', val, oldVal);
      if (!oldVal.done_nodes) return
      if (val.done_nodes.length !== oldVal.done_nodes.length) {
        this.geoJsonOptions = { onEachFeature: this.onEachFeatureFunction() }
      }
      else if (this.taskStatus) this.geoJsonOptions = { onEachFeature: this.onEachFeatureFunction() }
      if ((val.task_type == 4 || val.task_type == 0) && val.task_type !== oldVal.task_type) {
        console.log('watch 1', val.task_type);
        this.geoJsonOptions = { onEachFeature: this.onEachFeatureFunction() }
      }
    },
    nowpose(val, oldVal) {
      // console.log('watch nowpose', val, oldVal); 
      this.center = val
    }
  },

  async mounted() {

    this.changeBlockChange()
    // this.totalJson = bb;
    // console.log(this.totalJson);

    // this.getSiteInfo();
    // this.initDraw();

    // console.log(this.navPath.length);
    this.geoJsonOptions = { onEachFeature: this.onEachFeatureFunction() }
    this.totalJsonOptions = { onEachFeature: this.onEachFeatureFunction1() }
    this.lzJsonOptions = { pointToLayer: this.onEachFeatureFunction2() }


    window.navGo = this.navGo;
  },
  methods: {
    getArrowIcon(index) {
      if (index === 0 || index >= this.navPath.length - 1) {
        return new L.DivIcon({
          className: 'arrow-icon',
          html: `<div><img src="path/to/arrow-icon.png" style="width: 20px; height: 20px;" /></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
      }
      const angle = this.calculateAngle(this.navPath[index], this.navPath[index + 1]);
      return new L.DivIcon({
        className: 'arrow-icon',
        html: `<div style="transform: rotate(${angle}deg);"><img src="path/to/arrow-icon.png" style="width: 20px; height: 20px;" /></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    },
    calculateAngle(pointA, pointB) {
      const deltaY = pointB[0] - pointA[0];
      const deltaX = pointB[1] - pointA[1];
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      return angle;
    },
    async changeBlockChange(block) {
      block = block || this.changeBlock;
      console.log('changeBlock', block);

      // 获取当前Block的geoJson
      var res = await getSiteInfo({ id: this.siteId, block })
      // console.log(res.data);
      this.geojson = res.data.map;
      // console.log(res.data.map.features);
      if (!res.data.map.features.length) return;
      else {
        var c = res.data.map.features[0].properties.center
        this.center = [c[1], c[0]]
      }

      // 获取当前Block的geoJson
      // var res = await getMapBlock({name:'map_grm_all',block:this.changeBlock})
      // console.log(res);
      // this.blocks = res.data;
      // console.log(this.blocks);

      // this.geojson = this.list[0].map[`${this.changeBlock}`];
      // var c = this.list[0].map[`${this.changeBlock}`].features[0].properties.center;
      // this.center = [c[1],c[0]];
      // localStorage.setItem('changeBlock',this.changeBlock)
      // localStorage.setItem('center',JSON.stringify(this.center))

      // 在地图数据库中筛选Block
      // console.log(this.changeBlock);
      // var res = await getMapBlock({name:'map_grm_all',block:this.changeBlock})
      // console.log(res);
      // this.blocks = res.data;
      // console.log(this.blocks);
    },
    initDraw() {
      this.$nextTick(() => {
        const map = this.$refs.map.mapObject;
        this.drawnItems = this.$refs.drawnItems.mapObject;
        map.addLayer(this.drawnItems);
        var options = {
          position: 'topright',
          draw: {
            polyline: {
              shapeOptions: {
                color: '#F56C6C',
              }
            },
            polygon: {
              allowIntersection: false, // Restricts shapes to simple polygons
              shapeOptions: {
                color: '#F56C6C'
              }
            },
            rectangle: {
              shapeOptions: {
                color: '#F56C6C'
              }
            },
          },
          edit: {
            featureGroup: this.drawnItems,
            edit: false,
            // edit: true,
            remove: true,
          }
        }
        const drawControl = new L.Control.Draw(options);
        map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, this.drawCreated);
        map.on(L.Draw.Event.EDITED, this.drawEdited, map, drawControl);
        map.on(L.Draw.Event.DELETED, this.drawDeleted);
      })
    },
    drawCreated(e) {
      const { layer } = e;
      // console.log(e,layer);
      let lastLayer = null;
      if (layer) {
        // this.drawnItems.clearLayers();
        if (lastLayer) this.drawnItems.removeLayer(lastLayer);
        this.drawnItems.addLayer(layer);
        console.log('电子围栏', this.drawnItems.toGeoJSON());
        this.updateSite(this.drawnItems.toGeoJSON())
        lastLayer = layer;
      }
      else console.error('Event layer is undefined.');
    },
    drawEdited(e, map, drawControl) {
      const { layers } = e;
      console.log(e, layers);
      if (layers) {
        this.drawnItems.addLayer(layers);
        console.log('电子围栏', this.drawnItems.toGeoJSON());
        this.updateSite(this.drawnItems.toGeoJSON())
      }
      else console.error('Event layer is undefined.');
    },
    drawDeleted(e) {
      const { layers } = e;
      if (layers) {
        console.log('this.drawnItems', this.drawnItems);
        this.updateSite({ "type": "FeatureCollection", "features": [] })
      }
      else console.error('Event layer is undefined.');
    },
    async updateSite(e_fence) {
      var res = await updateSite({ id: this.siteId, e_fence })
      if (res.code == 200) this.$message.success('Successfully set up electronic fence.')
      else this.$message.error('Setting Failed!')
      // this.getSiteInfo()
    },
    async getSiteInfo() {
      const res = await getSiteInfo({ id: this.siteId });
      const { e_fence, tablename } = res.data;

      // console.log(e_fence);
      this.e_fence = e_fence;
      var { data } = await getMapTree({ name: tablename, id: this.siteId });
      console.log(data);
      const tree = JSON.stringify(data);
      // console.log('tree data',tree);
      db.maps.where('siteId').equals(Number(this.siteId)).modify({ tree }).then(updatedCount => {
        console.log(`总共更新了 ${updatedCount} 条数据。`); // 输出更新的记录数
      }).catch(error => {
        console.error("更新数据时出错：", error);
      });
    },
    _isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      return flag
    },
    startAddingMarker(e) {
      if (!this.initialpose) return;
      // if (this._isMobile()) {
        if (this.count == 1) {
          this.isdot = true;
          this.currentMarkerLatLng = [e.latlng.lat, e.latlng.lng];
          this.count = 2;
        }
        else {
          this.isdot = false;
          this.rotationFn(e);
          this.count = 1;
        }
      // }
      // else {
      //   e.target.dragging.disable() // 禁止拖动
      //   this.isStart = true;
      //   this.isdot = true;
      //   this.currentMarkerLatLng = [e.latlng.lat, e.latlng.lng]
      // }
    },
    stopAddingMarker(e) {
      if (!this.isStart) return;
      this.isdot = false;
      this.rotationFn(e);
      this.isStart = false;
    },
    rotationFn(e) {
      // console.log(3);
      let timer = null;
      if (timer) clearTimeout(timer);

      const deltaX = e.latlng.lat - this.currentMarkerLatLng[0];
      const deltaY = e.latlng.lng - this.currentMarkerLatLng[1];
      var rawRotation = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
      this.markerOp1.rotationAngle = (rawRotation + 360) % 360;

      this.isAddingMarker = true;

      this.$store.dispatch('socket/initPose', {
        ip: this.IP,
        poses: {
          position: { x: this.currentMarkerLatLng[1], y: this.currentMarkerLatLng[0] },
          orientation: this.markerOp1.rotationAngle
        }

      })

      timer = setTimeout(() => {
        this.isAddingMarker = false;
        this.currentMarkerLatLng = [0, 0];
        e.target.dragging.enable();
      }, 1000)
      this.$emit('change', '')
    },
    innerClick(e) {
      console.log(e.latlng.lat + ',' + e.latlng.lng);
      // this.$message.success(e.latlng.lat + ',' + e.latlng.lng);
    },
    onEachFeatureFunction() {
      try {
        var { task_nodes, done_nodes, task_type } = this.taskState;
        task_nodes = task_nodes.filter(item => item.includes(this.changeBlock));
        done_nodes = done_nodes.filter(item => item.includes(this.changeBlock));
        // console.log(this.changeBlock, task_nodes.length, done_nodes.length);

        // 缓存常用属性
        const styleFunction = this.styleFunction.bind(this);
        const highlightStyle = this.highlightStyle;
        const doneNodeStyle = this.doneNodeStyle;
        const taskNodeStyle = this.taskNodeStyle;

        return (feature, layer) => {
          // console.log(feature);
          if (!feature || !feature.properties) return

          const PVMID = feature.properties.PVMID;
          // console.log(task_type);
          // 提前进行任务类型判断
          if (task_type === 1 || task_type === 2) {
            if (task_nodes.includes(PVMID)) {
              if (done_nodes.includes(PVMID)) layer.setStyle(doneNodeStyle);
              else layer.setStyle(taskNodeStyle);
            }
          }
          layer.bindTooltip(`<div>${PVMID}</div>`, { permanent: false, sticky: true });

          layer.on({
            mouseover: () => layer.setStyle(highlightStyle),
            mouseout: () => layer.setStyle(styleFunction()),
            click: (e) => {
              e.target.bindPopup(` <div style="background-color: #36363688; display: flex;flex-wrap: wrap; justify-content: center; padding: 20px 0; color: #ececec;">
          <div><span style="font-weight: 700;">PVMID:</span> ${PVMID}</div>
          <button onmouseover="this.style.backgroundColor='#27aae633'" onmouseout="this.style.backgroundColor='#6f6e6e88'" style="background-color: #6f6e6e88;margin: 20px 5px 0 5px; padding: 10px 20px; border-radius: 5px; color: #ececec;border:0; cursor: pointer;" onclick="navGo('${PVMID}','_z')">Go East</button>
          <button onmouseover="this.style.backgroundColor='#27aae633'" onmouseout="this.style.backgroundColor='#6f6e6e88'" style="background-color: #6f6e6e88;margin: 20px 5px 0 5px; padding: 10px 20px; border-radius: 5px; color: #ececec;border:0; cursor: pointer;" onclick="navGo('${PVMID}','_f')">Go West</button>
        </div>`)
            }
          });
        };
      } catch (error) {
        console.error('taskState error');
      }
    },

    onEachFeatureFunction1() {
      try {
        return (feature, layer) => {
          if (!feature) return;
          const PVMID = feature.properties.PVMID;
          layer.bindTooltip(`<div>${PVMID}</div>`, { permanent: false, sticky: true });
          layer.on('dblclick', (event) => {
            this.changeBlockChange(PVMID);
            localStorage.setItem('changeBlock', PVMID);
            // console.log(PVMID);
            this.changeBlock = PVMID;
          });
        }
      } catch (error) {
        console.log('taskState');
      }
    },

    onEachFeatureFunction2() {
      try {
        return (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: feature.properties.radius*50, // Adjust the radius as needed
            color: 'red'
          });
        }
      } catch (error) {
        console.log('taskState');
      }
    },
    navGo(id, direction) {
      this.cancelNav()
      this.navName = id + (direction == '_z' ? ' 的正面' : ' 的反面')
      console.log(this.navName);
      this.$store.dispatch('socket/sendNav', (id + direction));
    },
    cancelNav() {
      this.$store.dispatch('socket/cancelNav')
    },

    // 切换地图
    async changeMap() {
      try {
        var res1 = await getSiteName({ uid: this.uid });
        const id = res1.data[0].id;
        localStorage.setItem('siteId', id);

        this.$loading.show();
        const res = await getSiteInfo({ id });
        const { sitename, center, zoom, map, tablename } = res.data;
        this.geojson = JSON.parse(map);
        this.zoom = zoom;
        this.center = center;

        this.$loading.hide();
        var tree1 = await getMapTree({ name: tablename, id });
        var tree = JSON.stringify(tree1.data)
        // console.log('tree',tree);

        db.maps.add({ sitename, center, zoom, map, tree });

        localStorage.setItem('site', sitename);
        localStorage.setItem('center', JSON.stringify(center));

      } catch (error) {
        console.log("error in chengeMap: ", error);
      }
    },

  },
};
</script>

<style lang="scss" scoped>
@import '~leaflet/dist/leaflet.css';
@import '~leaflet-draw/dist/leaflet.draw.css';
@import '../../styles/element.scss';


.custom-marker-icon {
  transition: transform 0.3s ease;
  /* 添加动画效果 */
}

/deep/.leaflet-popup-content-wrapper,
/deep/.leaflet-popup-tip {

  background: #373535;
  color: #ececec;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
}

/deep/.leaflet-container a.leaflet-popup-close-button {
  color: #ececec;

  &:hover {
    color: #ffffff;
  }
}

/deep/.leaflet-right {
  right: 20%;
}

/deep/.leaflet-top {
  top: 10%;
}


.stieName {
  position: absolute;
  top: -9px;
  left: 0;
  color: #dddddd !important;
  z-index: 2000;
  cursor: pointer;
}

.addbtn {
  position: absolute;
  top: -9px;
  right: 0;
  color: #dddddd;
  z-index: 2000;

  &:hover {
    color: #ffffff;
  }
}

// /deep/ .el-dialog {
//     position: relative;
//     margin: 0 auto 50px;
//     background: #000000;
//     border-radius: 2px;
//     color: #fff !important;
//     box-shadow: 0 1px 3px rgba(0,0,0,.3);
//     box-sizing: border-box;
//     width: 50%;
// }
.leaflet-container {
  width: 100% !important;
  height: 100vh !important;
  // background: #0000004b;
  background: #00000000;
  font-size: 20px;
  // 去掉canvas下的空格 兼容性
  display: -webkit-box;
  /* OLD - iOS 6-, Safari 3.1-6 */
  display: -moz-box;
  /* OLD - Firefox 19- (buggy but mostly works) */
  display: -ms-flexbox;
  /* TWEENER - IE 10 */
  display: -webkit-flex;
  /* NEW - Chrome */
  display: flex;

  /* NEW, Spec - Opera 12.1, Firefox 20+ */
  .leaflet-bottom {
    position: absolute;
    z-index: -1 !important;
    display: none;
  }
}

::v-deep input::-webkit-outer-spin-button,
::v-deep input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

::v-deep input[type='number'] {
  line-height: 1;
  // -moz-appearance: textfield !important;
}

.el-col-1 {
  text-align: center !important;
}

::v-deep .threeBtn .el-form-item__content {
  margin-left: 0 !important;
}

// ::v-deep .leaflet-draw {
//   margin-top: 320px;
// }

::v-deep .leaflet-top,
.leaflet-bottom {
  position: absolute;
  // z-index: -1 !important;
  // display: none;
}

// ::v-deep .leaflet-pane .leaflet-map-pane{
//   height: 750px !important;
// }
.elcard {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 30%);
}
</style>