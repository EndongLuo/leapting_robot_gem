<template>
  <div class="L_table">
    <!-- 表格内容 -->
    <el-table :data="tableData"
          :stripe="true"
          default-expand-all
      style="width: 100%">
      <div v-for="c in column" :key="c.id">
        <el-table-column :prop="c.prop" :label="c.label">
          <div v-if="c.prop == 'status'">
            <el-switch
              :prop="c.prop"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </div>
        </el-table-column>
      </div>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">
            分配角色
          </el-button> -->
          <el-button v-if="tableName=='behaviorInfo'" @click="handleSend(scope.row)" type="text" size="small">
            发送
          </el-button>
          <el-button v-else @click="handleClick(scope.row)" type="text" size="small">
            编辑
          </el-button>
          <el-button @click="handleDelete(scope.row,scope.$index,tableData)" type="text" size="small">
            <span style="color: #F56C6C;">删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-count="5"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
  
<script>
import { mapState } from 'vuex';
export default {
  props: ["tableData", "column", "tableName"],

  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      // status:false,
    };
  },
  computed: {
    total() {
      return this.tableData.length;
    },
    filterData(){
      let begin = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      if(this.tableData) return
      return this.tableData.slice( begin, end);
    },
    ...mapState('ros',['ros'])
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleSend(row) {
      // console.log({behavior_name:row.behavior_name});
      this.$emit('sendGoal',{behavior_name:row.behavior_name})
    },
    handleDelete(row,index,list) {
      this.$confirm(`此操作将永久删除该文件: ${row.behavior_name}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }).then(() => {
          var trig_pub = new ROSLIB.Topic({
            ros:this.ros,
            name:'/trig',
            messageType:'std_msgs/Header'
          })
          trig_pub.publish({frame_id:`flexbe_delete:${row.behavior_name}`});
          list.splice(index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 分页器
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage=val;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-pagination{
  margin-top: 20px;
  float: right;
}
</style>