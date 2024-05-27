<template>
  <div id="app">
    <!-- <div class="backround"> -->
    <div class="toptitle">
      <div class="item">ID</div>
      <div class="item">PVMID</div>
      <div class="item">Type</div>
    </div>
    <vue-seamless-scroll :data="listData" :class-option="optionHover" class="seamless-warp">
      <el-table :data="listData" :show-header="status" @row-click="handleRowClick">
        <el-table-column prop="id" label="ID" width="60px" style="color: #000;"></el-table-column>
        <el-table-column prop="node_name" label="PVMID"></el-table-column>
        <el-table-column prop="recognition_type" label="Type"></el-table-column>
      </el-table>
    </vue-seamless-scroll>
    <el-dialog :visible.sync="dialogVisible" :title="selectedRow.node_name + '：' + selectedRow.recognition_type + ''"
      width="60%">
      <img :src="selectedRow.image_url" alt="Image" style="width: 100%; ">
    </el-dialog>
    <!-- </div> -->
  </div>
</template>

<script>
import { getResultInfo } from '@/api/task'
import { formatDate, transTimestamp } from '@/utils/timeUTC'
export default {
  data() {
    return {
      status: false,
      listData: [
        {
          'id': 1,
          'node_name': 'HZ_BL1_R4_S1_3',
          'recognition_type': 'connector',
        },
        {
          'id': 2,
          'node_name': 'HZ_BL1_R4_S1_5',
          'recognition_type': 'connector',
        },
        {
          'id': 3,
          'node_name': 'HZ_BL1_R4_S1_7',
          'recognition_type': 'connector',
        },
        {
          'id': 4,
          'node_name': 'HZ_BL1_R4_S1_8',
          'recognition_type': 'connector',
        },
        {
          'id': 5,
          'node_name': 'HZ_BL1_R4_S1_11',
          'recognition_type': 'connector',
        },
        {
          'id': 6,
          'node_name': 'HZ_BL1_R4_S2_2',
          'recognition_type': 'connector',
        }, {
          'id': 7,
          'node_name': 'HZ_BL1_R4_S2_3',
          'recognition_type': 'connector',
        },
        {
          'id': 8,
          'node_name': 'HZ_BL1_R4_S2_6',
          'recognition_type': 'connector',
        },
        {
          'id': 9,
          'node_name': 'HZ_BL1_R4_S1_7',
          'recognition_type': 'connector',
        },
        {
          'id': 10,
          'node_name': 'HZ_BL1_R4_S1_7',
          'recognition_type': 'connector',
        },
      ],
      dialogVisible: false,
      selectedRow: {},
    }
  },
  computed: {
    optionHover() {
      return {
        // autoPlay: false,
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 50, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
        currentRow: null
      };
    },
  },
  async created() {
    var res = await getResultInfo();
    // this.$message('无异常结果');
    // res.data.forEach(item => {
    //   console.log(item.update_time);
    //   item.update_time = formatDate(item.update_time);
    //   console.log(item.update_time);
    // });
    this.listData = res.data;
  },
  methods: {
    handleRowClick(row) {
      // Handle row click event
      // this.selectedRow = row;
      // console.log(row);
      // this.dialogVisible = true;
      this.$emit('Abnomrl', row)
    },
  },

}
</script>
<style lang="scss" scoped>
@import '../../styles/element.scss';
// /deep/ .el-dialog {
//     z-index: 3007 !important;
// }

/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
  background-color: #4a7e7ece;
  background: linear-gradient(180deg,
      rgba(85, 201, 255, 0.5),
      rgba(45, 109, 139, 0.5),
      rgba(85, 201, 255, 0.5));
}

.backround {
  // margin-top: 10px;
  width: 100%;
  // height: 365px;
  height: 100%;
  // background-image: url("../assets/pageBg.png");
}

/deep/ .el-table,
/deep/ .el-table__expanded-cell {
  background-color: transparent;
  font-size: .1rem;
}

/deep/ .el-table--border::after,
.el-table--group::after,
.el-table::before {
  // background-color:#ffffff00;
  background-color: #09182c;

}


/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
  background-color: transparent;
  color: #e0e0e0;
}

/deep/ .el-table tr {
  border: 1px solid transparent;
}

/* 奇数行样式 */
/deep/ .el-table tr:nth-child(odd) {
  // background-color: #09182ca1;
  // background: linear-gradient(
  //         180deg,
  //         rgba(85, 201, 255, 0.5),
  //         rgba(45, 109, 139, 0.5),
  //         rgba(85, 201, 255, 0.5)
  //       );
  color: white;
}

// /*  偶数行样式 */
// table tr:nth-child(even) {
//     background-color: red;
//     color: yellow;
// }

.seamless-warp {
  // margin-top: -10px;
  // height: 4rem;
  height: 100%;
  overflow: hidden;

}

/deep/.el-table .cell {
  text-align: center;
}

/deep/ .el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf {
  border: 1px solid transparent;
  // border: 0;
}

/deep/.toptitle {
  width: 100%;
  display: flex;
  background-color: #296f8dd8;
  // margin-bottom: 10px;
  color: #e9e9e9;
  font-size: .1rem;
}

.item {
  width: 50%;
  // border-right: 2px solid gainsboro;
  text-align: center;
  font-size: .1rem;
}
</style>
