<template>
  <div class="dataScreen" style="background-color: #000;">
    <!-- 中间 -->
    <!-- 顶部 -->
    <div class="top">
      <img src="/img/title.png" alt="">
      <div class="logo"><img src="/img/logo.png" alt=""></div>
      <div class="title" style=" font-weight: 700;">{{ $t('home.title') }}</div>
      <div class="t_btn">
        <div class="svgicon">
          <!-- {{ nowTime }} -->
          <div @click="handleFullScreen">
            <svg-icon class="icon" v-if="!fullscreen" icon="QP" :size="24" slot="prefix"></svg-icon>
            <svg-icon class="icon" v-else icon="escQP" :size="24" slot="prefix"></svg-icon>
          </div>
          <div @click="goback">
            <svg-icon class="icon" icon="back" :size="30" slot="prefix"></svg-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="main">
      <!-- {{ Robot['10.168.4.230'].robotPose }} -->
      <!-- 左边 -->
      <div class="left">
        <div class="task_title">{{ $t('setting.powerStation') }}</div>

        <div class="task_box">
          <el-input :placeholder="$t('setting.zkey')" v-model="filterText">
          </el-input>
          <!-- <el-tree :data="treeData" show-checkbox :default-expanded-keys="[0]" node-key="id" ref="tree" lazy :load="loadTree" -->
          <el-tree :data="treeData" show-checkbox :default-expanded-keys="[0]" node-key="id" ref="tree" 
            :filter-node-method="filterNode" :props="defaultProps">
          </el-tree>
        </div>
      </div>

      <div class="c_main">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- 下发任务 -->
          <el-tab-pane :label="$t('setting.tasksend')" name="1">
            <el-button @click="btnTask">{{ $t('setting.addTask') }}</el-button>
            <el-button @click="cancelTask" v-if="timer">取消定时任务</el-button>
            <!-- 表格 -->
            <div class='moduleTable' style="height: calc(100vh - 1.65rem);">
              <el-table class="table-color"
                :data="taskData.filter(data => !search || data.task_name.toLowerCase().includes(search.toLowerCase()))"
                style="margin:0 auto;
                --el-table-border-color: none;
                --el-table-bg-color: none;
                --el-table-tr-bg-color: none" :row-class-name='tableRowClassName'
                :cell-style="{ 'color': '#FFFFFF', 'text-align': 'center' }"
                :header-cell-style="{ 'background': '#375A88', 'color': 'rgba(2,217,253,0.8)', 'text-align': 'center' }">

                <div v-for="t in taskLabel" :key="t.id">
                  <el-table-column v-if="t.prop == 'id'" width="50px" :prop="t.prop" :label="t.label" />
                  <el-table-column v-else :prop="t.prop" :label="t.label" />
                  <!-- <el-table-column v-show="t.label !== '任务区域'" :prop="t.prop" :label="t.label" /> -->
                </div>
                <el-table-column align="right" width="230px">
                  <template slot="header" slot-scope="">
                    <el-input v-model="search" size="mini" :placeholder="$t('setting.zkey')" />
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleTiming(scope.row)">{{ $t('setting.send') }}</el-button>
                    <el-button size="mini" @click="handleEdit(scope.row)">{{ $t('setting.view') }}</el-button>
                    <el-button size="mini" style="border: 1px #F56C6C solid; " @click="handleDelete(scope.row.id)">{{
        $t('setting.delete') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <!-- 任务管理 -->
          <el-tab-pane :label="$t('setting.taskmanagement')" name="2">
            <div class='moduleTable'>
              <el-table class="table-color"
                :data="taskInfoData.filter(data => !search1 || data.task.task_name.toLowerCase().includes(search1.toLowerCase()))"
                style="margin:0 auto;
                --el-table-border-color: none;
                --el-table-bg-color: none;
                --el-table-tr-bg-color: none" :row-class-name='tableRowClassName'
                :cell-style="{ 'color': '#FFFFFF', 'text-align': 'center' }"
                :header-cell-style="{ 'background': '#375A88', 'color': 'rgba(2,217,253,0.8)', 'text-align': 'center' }">

                <div v-for="t in taskInfoLabel" :key="t.id">
                  <el-table-column :prop="t.prop" :label="t.label" />
                </div>
                <el-table-column align="right" width="300px">
                  <template slot="header" slot-scope="">
                    <el-input v-model="search1" size="mini" :placeholder="$t('setting.zkey')" />
                  </template>
                  <template slot-scope="scope">
                    <template v-if="['Stop', 'Completed'].includes(scope.row.task_state)">
                      <el-button size="mini" style="border: 1px #E6A23C solid; " @click="getResultInfo(scope.row.id)">{{
        $t('setting.report') }}</el-button>
                      <el-button size="mini" style="border: 1px #909399 solid;"
                        @click="downloadResultInfo(scope.row.id)">{{ $t('setting.download') }}</el-button>
                      <el-button size="mini" style="border: 1px #F56C6C solid; "
                        @click="deleteTaskInfo(scope.row.id)">{{
        $t('setting.delete') }}</el-button>
                    </template>
                    <template v-else>
                      <template v-if="scope.row.task_state == 'Executing'"><el-button size="mini"
                          @click="pauseTask(scope.row.task.robot.ip, 2)" style="border: 1px #F56C6C solid; ">{{
        $t('home.pause') }}</el-button>
                      </template>
                      <template v-if="scope.row.task_state == 'Pause'"><el-button size="mini"
                          @click="pauseTask(scope.row.task.robot.ip, 1)" style="border: 1px #67C23A solid; ">{{
        $t('home.continue') }}</el-button></template>
                      <el-button size="mini" style="border: 1px #F56C6C solid; "
                        @click="pauseTask(scope.row.task.robot.ip, 0, scope.row.id)">{{
        $t('home.stop') }}</el-button></template>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 定时任务 -->
          <el-tab-pane label="定时任务" name="8">
            <div class='moduleTable'>
              <el-table class="table-color"
                :data="timedTaskData.filter(data => !search1 || data.task.task_name.toLowerCase().includes(search1.toLowerCase()))"
                style="margin:0 auto;
                --el-table-border-color: none;
                --el-table-bg-color: none;
                --el-table-tr-bg-color: none" :row-class-name='tableRowClassName'
                :cell-style="{ 'color': '#FFFFFF', 'text-align': 'center' }"
                :header-cell-style="{ 'background': '#375A88', 'color': 'rgba(2,217,253,0.8)', 'text-align': 'center' }">

                <div v-for="t in timedTaskLabel" :key="t.id">
                  <el-table-column :prop="t.prop" :label="t.label" />
                </div>
                <el-table-column align="right" width="300px">
                  <template slot="header" slot-scope="">
                    <el-input v-model="search1" size="mini" :placeholder="$t('setting.zkey')" />
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" style="border: 1px #F56C6C solid; " @click="deleteTimedTask(scope.row.id)">{{
        $t('setting.delete') }}</el-button>
                    <!-- <template v-if="['Stop', 'Completed'].includes(scope.row.task_state)">
                    </template>
        <template v-else>
                      <template v-if="scope.row.task_state == 'Executing'"><el-button size="mini"
                          @click="pauseTask(scope.row.task.robot.ip, 2)" style="border: 1px #F56C6C solid; ">{{
        $t('home.pause') }}</el-button>
                      </template>
        <template v-if="scope.row.task_state == 'Pause'"><el-button size="mini"
                          @click="pauseTask(scope.row.task.robot.ip, 1)" style="border: 1px #67C23A solid; ">{{
        $t('home.continue') }}</el-button></template>
        <el-button size="mini" style="border: 1px #F56C6C solid; "
          @click="pauseTask(scope.row.task.robot.ip, 0, scope.row.id)">{{
          $t('home.stop') }}</el-button></template> -->
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 安全检测 -->
          <el-tab-pane :label="$t('setting.security')" name="3">
            <div class='moduleTable'>
              <el-table class="table-color" :data="securityInfo" style="margin:0 auto;
                --el-table-border-color: none;
                --el-table-bg-color: none;
                --el-table-tr-bg-color: none" :row-class-name='tableRowClassName'
                :cell-style="{ 'color': '#FFFFFF', 'text-align': 'center' }"
                :header-cell-style="{ 'background': '#375A88', 'color': 'rgba(2,217,253,0.8)', 'text-align': 'center' }">

                <div v-for="t in securityInfoLabel" :key="t.id">
                  <el-table-column v-if="t.prop !== 'image_url'" :prop="t.prop" :label="t.label" />
                  <el-table-column v-else :label="t.label">
                    <template slot-scope="scope">
                      <el-image style="width: 100px; height: 100px" :src="scope.row.image_url"
                        :preview-src-list="[scope.row.image_url]"></el-image>
                    </template>
                  </el-table-column>

                </div>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 任务报告 -->
          <el-tab-pane :label="$t('setting.taskreport')" name="4" v-if="resultInfoData.length">
            <div class='moduleTable'>
              <el-table class="table-color" :data="resultInfoData" style="margin:0 auto;
                --el-table-border-color: none;
                --el-table-bg-color: none;
                --el-table-tr-bg-color: none" :row-class-name='tableRowClassName'
                :cell-style="{ 'color': '#FFFFFF', 'text-align': 'center' }"
                :header-cell-style="{ 'background': '#375A88', 'color': 'rgba(2,217,253,0.8)', 'text-align': 'center' }">

                <div v-for="t in resultInfoLabel" :key="t.id">
                  <el-table-column v-if="t.prop !== 'image_url'" :prop="t.prop" :label="t.label" />
                  <el-table-column v-else :label="t.label">
                    <template slot-scope="scope">
                      <el-image style="width: 100px; height: 100px" :src="scope.row.image_url"
                        :preview-src-list="[scope.row.image_url]"></el-image>
                    </template>
                  </el-table-column>

                </div>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- Ros Param -->
          <el-tab-pane label="Robot Param" name="5">
            <div class='moduleTable'>
              <el-table class="table-color" :data="rosParamInfo" style="margin:0 auto;
                --el-table-border-color: none;
                --el-table-bg-color: none;
                --el-table-tr-bg-color: none" :row-class-name='tableRowClassName'
                :cell-style="{ 'color': '#FFFFFF', 'text-align': 'center' }"
                :header-cell-style="{ 'background': '#375A88', 'color': 'rgba(2,217,253,0.8)', 'text-align': 'center' }">

                <div v-for="t in rosParamLabel" :key="t.id">
                  <el-table-column v-if="t.prop == 'id'" width="50px" :prop="t.prop" :label="t.label" />
                  <el-table-column v-else :prop="t.prop" :label="t.label" />
                </div>

                <el-table-column v-if="roles !== 'custom'" align="right" width="200px">
                  <template slot="header" slot-scope="">
                    <el-input v-model="search1" size="mini" :placeholder="$t('setting.zkey')" />
                  </template>
                  <template slot-scope="scope">
                    <el-button size="mini" style="border: 1px #E6A23C solid; " @click="getResultInfo(scope.row.id)">{{
        $t('setting.edit') }}</el-button>
                    <el-button size="mini" style="border: 1px #F56C6C solid; " @click="deleteTaskInfo(scope.row.id)">{{
        $t('setting.delete') }}</el-button>
                  </template>

                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 场地 -->
          <el-tab-pane label="Site" name="6">
            <el-button @click="dialogSite = true">添加场地/地图</el-button>
            <el-row class="moduleTable">
              <el-col :span="8" v-for="o, index in sites" :key="index">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <img src="./img/wj.png" class="image">
                  <div style="padding: 14px;">
                    <div>名称：{{ o.sitename }}</div>
                    <div>地点：{{ o.address }}</div>
                    <div>坐标：{{ o.lat_lng.lng }},{{ o.lat_lng.lat }}</div>
                    <!-- <div>数据保存：{{ o.data_save }} 月</div> -->
                    <!-- <div>缩放比：{{ o.zoom }}</div> -->
                    <!-- <div>偏移量：X：{{ o.mapoffset.tx }} Y：{{ o.mapoffset.ty }} θ：{{ o.mapoffset.theta }}
                      O：{{ o.mapoffset.to }}
                    </div> -->
                    <div class="">
                      <!-- <time class="time">{{ currentDate }}</time> -->
                      <el-button @click="updateSite(o)" type="text" class="card_button">修改</el-button>
                      <div v-if="site == o.sitename"
                        style="color: #67C23A;float: right; font-weight: 700; font-size: 16px;">正在使用
                      </div>
                      <el-button v-else @click="setSiteName(o.id, o.sitename, o.tablename)" type="text"
                        class="card_button">使用</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

          </el-tab-pane>

          <!-- 机器人 -->
          <el-tab-pane label="Robot" name="7">
            <el-button @click="dialogRobot = true">添加机器人</el-button>
            <el-row>
              <el-col :span="6" v-for="o, index in robots" :key="index">
                <el-card :body-style="{ padding: '0px' }" shadow="hover">
                  <img src="./img/XJ.png" class="image">
                  <div style="padding: 14px;">
                    <div>名称：{{ o.robotname }}</div>
                    <div>IP：{{ o.ip }}</div>
                    <!-- <div>坐标：{{ o.lat_lng.lng }},{{ o.lat_lng.lat }}</div> -->
                    <!-- <div>数据保存：{{ o.data_save }} 月</div> -->
                    <!-- <div>缩放比：{{ o.zoom }}</div> -->
                    <!-- <div>偏移量：X：{{ o.mapoffset.tx }} Y：{{ o.mapoffset.ty }} θ：{{ o.mapoffset.theta }}
                      O：{{ o.mapoffset.to }}
                    </div> -->
                    <div class="">
                      <!-- <time class="time">{{ currentDate }}</time> -->
                      <el-button @click="updateRobot(o)" type="text" class="card_button">修 改</el-button>
                      <el-button @click="deleteRobot(o.id)" type="text" style="background-color: #F56C6C !important;"
                        class="card_button">删 除</el-button>
                      <!-- <div v-if="site == o.sitename" style="color: #67C23A;float: right; font-weight: 700; font-size: 20px;">正在使用</div>
                      <el-button v-else @click="setSiteName(o.id, o.sitename, o.tablename)" type="text"
                        class="card_button">使用</el-button> -->
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

          </el-tab-pane>

        </el-tabs>

        <!-- 添加任务弹出框框 -->
        <el-dialog :title="$t('setting.addTask')" :visible.sync="dialogFormVisible"
          style="margin-top: 10px !important;">
          <el-form :model="taskInfo" :rules="rules" ref="ruleForm">
            <!-- 标签选择 -->
            <el-form-item :label="$t('setting.textarea')" prop="nodes" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="taskInfo.nodes" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
            <!-- text  -->
            <el-form-item :label="$t('home.taskName')" prop="task_name" :label-width="formLabelWidth">
              <el-input v-model="taskInfo.task_name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 单选 -->
            <el-form-item :label="$t('setting.taskType')" prop="task_type" :label-width="formLabelWidth">
              <!-- <el-input v-model="taskInfo.task_type" autocomplete="off"></el-input> -->
              <el-radio-group v-model="taskInfo.task_type">
                <el-radio label="Inspection">{{ $t('setting.Inspection') }}</el-radio>
                <el-radio label="Clean">{{ $t('setting.Clean') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 识别类型 单选 -->
            <el-form-item v-if="taskInfo.task_type == 'Inspection'" prop="recognition_type"
              :label="$t('setting.recognitionType')" :label-width="formLabelWidth">
              <!-- <el-input v-model="taskInfo.identify_type" autocomplete="off"></el-input> -->
              <el-radio-group v-model="taskInfo.recognition_type" prop="recognition_type">
                <el-radio label="1">{{ $t('setting.Visiblelight') }}</el-radio>
                <el-radio label="2">{{ $t('setting.Infraredlight') }}</el-radio>
                <el-radio label="3">{{ $t('setting.Mix') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 下拉 -->
            <el-form-item :label="$t('home.deviceName')" prop="robotId" :label-width="formLabelWidth">
              <!-- <el-input v-model="taskInfo.robot_name" autocomplete="off"></el-input> -->
              <el-select v-model="taskInfo.robotId" :placeholder="$t('setting.choose')">
                <div v-for="r in robots" :key="r.id"><el-option :label="r.robotname" :value="r.id"></el-option></div>
              </el-select>
            </el-form-item>
            <!-- 是否回库 单选 -->
            <el-form-item :label="$t('setting.isback')" prop="isback" :label-width="formLabelWidth">
              <!-- <el-input v-model="taskInfo.identify_type" autocomplete="off"></el-input> -->
              <el-radio-group v-model="taskInfo.isback">
                <el-radio label="charge">{{ $t('setting.isbackyes') }}</el-radio>
                <el-radio label="">{{ $t('setting.isbackno') }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 创建人 -->
            <el-form-item :label="$t('setting.founder')" prop="founder" :label-width="formLabelWidth">
              <el-input v-model="taskInfo.founder" autocomplete="off"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="sendTask">下 发</el-button> -->
            <el-button @click="createTask('ruleForm')">{{ $t('setting.create') }}</el-button>
          </div>
        </el-dialog>

        <!-- 添加场地地图弹出框框 -->
        <el-dialog :title="$t('site.addsite')" :visible.sync="dialogSite">
          <el-form :model="siteInfo">
            <el-form-item :label="$t('site.sitename')" :label-width="formLabelWidth">
              <el-input v-model="siteInfo.sitename" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('site.address')" :label-width="formLabelWidth">
              <el-input v-model="siteInfo.address" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="图片" :label-width="formLabelWidth">
          <el-input v-model="siteInfo.site_img" autocomplete="off"></el-input>
        </el-form-item> -->
            <!-- <el-form-item :label="$t('site.lnglat')" :label-width="formLabelWidth">
              <el-input v-model="siteInfo.lat_lng" autocomplete="off"></el-input>
            </el-form-item> -->
            <!-- ------------------------------------------------ -->
            <el-form-item label="子阵" :label-width="formLabelWidth">
              <el-input v-model="siteInfo.block" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="组件朝向" :label-width="formLabelWidth">
              <!-- <el-input v-model="taskInfo.task_type" autocomplete="off"></el-input> -->
              <el-radio-group v-model="siteInfo.toward">
                <el-radio :label="1">横向</el-radio>
                <el-radio :label="0">纵向</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- ------------------------------------------ -->

            <el-form-item :label="$t('site.uploadmap')" :label-width="formLabelWidth">
              <el-upload class="upload-demo" drag :action="uploadUrl" :on-success="handlePreview" multiple name="file"
                accept=".dxf">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">{{ $t('site.uploadprompt') }}<em>{{ $t('site.click') }}</em></div>
                <div class="el-upload__tip" slot="tip">{{ $t('site.uploadprompt1') }}</div>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSite = false">{{ $t('mains.cancel') }}</el-button>
            <el-button type="primary" @click="addSite">{{ $t('mains.confirm') }}</el-button>
          </div>
        </el-dialog>

        <!-- 修改场地地图弹出框框 -->
        <el-dialog title="修改场地" :visible.sync="dialogUpdateSite">
          <el-form :model="siteUpdate">
            <el-form-item :label="$t('site.sitename')" :label-width="formLabelWidth">
              <div style="display: flex;">
                <el-input v-model="siteUpdate.sitename" autocomplete="off"></el-input>
              </div>
            </el-form-item>
            <el-form-item :label="$t('site.address')" :label-width="formLabelWidth">
              <div style="display: flex;">
                <el-input v-model="siteUpdate.address" autocomplete="off"></el-input>
              </div>
            </el-form-item>
            <!-- <el-form-item label="图片" :label-width="formLabelWidth">
              <el-input v-model="siteInfo.site_img" autocomplete="off"></el-input>
            </el-form-item> -->
            <el-form-item :label="$t('site.lnglat')" v-if="siteUpdate.lat_lng" :label-width="formLabelWidth">
              <div style="display: flex;">
                <span style="width: 65px;">Lng:</span><el-input v-model="siteUpdate.lat_lng.lng"
                  autocomplete="off"></el-input>
                <span style="width: 65px;">Lat:</span><el-input v-model="siteUpdate.lat_lng.lat"
                  autocomplete="off"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="视口" v-if="siteUpdate.center" :label-width="formLabelWidth">
              <div style="display: flex;">
                <el-input v-model="siteUpdate.center" autocomplete="off"></el-input>
                <!-- <span style="width: 65px;">Lng:</span><el-input v-model="siteUpdate.center.lng"
                  autocomplete="off"></el-input>
                <span style="width: 65px;">Lat:</span><el-input v-model="siteUpdate.center.lat"
                  autocomplete="off"></el-input> -->
              </div>
            </el-form-item>
            <!-- ------------------------------------------------ -->
            <el-form-item label="数据保存（月）" :label-width="formLabelWidth">
              <div style="display: flex;">
                <el-input v-model="siteUpdate.data_save" autocomplete="off"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="地图缩放比" :label-width="formLabelWidth">
              <div style="display: flex;">
                <el-input v-model="siteUpdate.zoom" autocomplete="off"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="地图偏移量" v-if="siteUpdate.mapoffset" :label-width="formLabelWidth">
              <div style="display: flex;">
                X:<el-input v-model="siteUpdate.mapoffset.tx" autocomplete="off"></el-input>
                Y:<el-input v-model="siteUpdate.mapoffset.ty" autocomplete="off"></el-input>
                θ:<el-input v-model="siteUpdate.mapoffset.theta" autocomplete="off"></el-input>
                O:<el-input v-model="siteUpdate.mapoffset.to" autocomplete="off"></el-input>
              </div>

            </el-form-item>

            <!-- ------------------------------------------ -->

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdateSite = false">{{ $t('mains.cancel') }}</el-button>
            <el-button type="primary" @click="updateSiteInfo">{{ $t('mains.confirm') }}</el-button>
          </div>
        </el-dialog>

        <!-- 添加机器人弹出框框 -->
        <el-dialog title="添加机器人" :visible.sync="dialogRobot">
          <el-form :model="robotInfo">
            <el-form-item label="设备名" :label-width="formLabelWidth">
              <el-input v-model="robotInfo.robotname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="ip" :label-width="formLabelWidth">
              <el-input v-model="robotInfo.ip" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="图片" :label-width="formLabelWidth">
          <el-input v-model="siteInfo.site_img" autocomplete="off"></el-input>
        </el-form-item> -->
            <el-form-item label="类型" :label-width="formLabelWidth">
              <el-radio-group v-model="robotInfo.robot_type">
                <el-radio label="MIR">巡检</el-radio>
                <el-radio label="MCR">清扫</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="场地" :label-width="formLabelWidth">
              <el-select v-model="robotInfo.siteId" placeholder="请选择场地">
                <div v-for="r in sites" :key="r.id"><el-option :label="r.sitename" :value="r.id"></el-option></div>
              </el-select>
            </el-form-item>

            <!-- <el-form-item :label="$t('site.uploadmap')" :label-width="formLabelWidth">
              <el-upload class="upload-demo" drag action="http://localhost:5000/upload" :on-success="handlePreview"
                multiple name="file" accept=".dxf">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">{{ $t('site.uploadprompt') }}<em>{{ $t('site.click') }}</em></div>
                <div class="el-upload__tip" slot="tip">{{ $t('site.uploadprompt1') }}</div>
              </el-upload>
            </el-form-item> -->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogRobot = false">{{ $t('mains.cancel') }}</el-button>
            <el-button type="primary" @click="addRobot">{{ $t('mains.confirm') }}</el-button>
          </div>
        </el-dialog>

        <!-- 修改机器人弹出框框 -->
        <el-dialog :title="$t('site.addsite')" :visible.sync="dialogUpdateRobot">
          <el-form :model="RobotUpdate">
            <el-form-item label="设备名称" :label-width="formLabelWidth">
              <el-input v-model="RobotUpdate.robotname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="IP" :label-width="formLabelWidth">
              <el-input v-model="RobotUpdate.ip" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="图片" :label-width="formLabelWidth">
          <el-input v-model="siteInfo.site_img" autocomplete="off"></el-input>
        </el-form-item> -->
            <!-- <el-form-item :label="$t('site.lnglat')" v-if="siteUpdate.lat_lng" :label-width="formLabelWidth">
              <div style="display: flex;">
                <span style="width: 65px;">Lng:</span><el-input v-model="siteUpdate.lat_lng.lng" autocomplete="off"></el-input>
                <span  style="width: 65px;">Lat:</span><el-input v-model="siteUpdate.lat_lng.lat" autocomplete="off"></el-input>
              </div>
            </el-form-item> -->
            <!-- ------------------------------------------------ -->
            <el-form-item label="PTZ设置" v-if="RobotUpdate.ptzurl" :label-width="formLabelWidth">
              <div style="display: flex; flex-wrap: wrap">
                红外光:<el-input v-model="RobotUpdate.ptzurl.h" autocomplete="off"></el-input>
                可见光:<el-input v-model="RobotUpdate.ptzurl.k" autocomplete="off"></el-input>
                前镜头:<el-input v-model="RobotUpdate.ptzurl.q" autocomplete="off"></el-input>
              </div>

            </el-form-item>

            <!-- ------------------------------------------ -->

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdateRobot = false">{{ $t('mains.cancel') }}</el-button>
            <el-button type="primary" @click="updateRobotInfo">{{ $t('mains.confirm') }}</el-button>
          </div>
        </el-dialog>

        <!-- 定时任务 -->
        <el-dialog title="定时任务" :visible.sync="dialogTiming" :close-on-click-modal="false" :show-close="false"
          :before-close="handleClose">
          <el-form :model="taskTimed" :rules="rules" ref="ruleForm">
            <el-form-item label="定时" prop="timings" :label-width="formLabelWidth">
              <el-select v-model="taskTimed.timings" placeholder="请选择时间">
                <el-option label="不定时" :value="0"></el-option>
                <el-option label="定时" :value="1"></el-option>
                <el-option label="周期" :value="2"></el-option>
              </el-select>
            </el-form-item>

            <!-- 定时选择 -->
            <el-form-item v-if="taskTimed.timings == 1" label="定时" prop="taskDate" :label-width="formLabelWidth">
              <el-date-picker v-model="taskTimed.timed" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>

            <!-- 周期选择 -->
            <el-form-item v-if="taskTimed.timings == 2" label="周期" prop="taskTime" :label-width="formLabelWidth">
              <el-select v-model="taskTimed.period" placeholder="请选择时间">
                <el-option label="分" value="m"></el-option>
                <el-option label="时" value="H"></el-option>
                <el-option label="天" value="D"></el-option>
                <el-option label="周" value="W"></el-option>
                <el-option label="月" value="M"></el-option>
                <el-option label="年" value="Y"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="taskTimed.timings == 2" label="时间" prop="taskDate" :label-width="formLabelWidth">
              <el-date-picker v-model="taskTimed.taskDate" type="datetimerange" :default-time="['08:00:00', '23:59:59']"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="taskTimed.timings == 2" label="步长" :label-width="formLabelWidth">
              <el-input v-model="taskTimed.step" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 是否回库 单选 -->
            <el-form-item :label="$t('setting.isback')" prop="isback" :label-width="formLabelWidth">
              <!-- <el-input v-model="taskInfo.identify_type" autocomplete="off"></el-input> -->
              <el-radio-group v-model="taskTimed.isback">
                <el-radio label="charge">{{ $t('setting.isbackyes') }}</el-radio>
                <el-radio label="">{{ $t('setting.isbackno') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTiming = false">取 消</el-button>
            <el-button type="primary" @click="handleTiming1">确 定</el-button>
          </div>
        </el-dialog>

      </div>
    </div>

  </div>
</template>

<script>
import { getRosParam } from '@/api/setting'
import { getReport, } from '@/api/report'
import { getRobot, updateRobot, addRobot, deleteRobot } from '@/api/robot'
import { getSiteName, setSiteMap, getSiteInfo, getMapTree, updateSite } from '@/api/siteMap'

import { createTask, getTask, getTaskInfo, getTimedTask, setTimedTask, deleteTimedTask, setTaskInfo, updateTaskInfo, getResultInfo, deleteTask, updateTaskInfoState, deleteTaskInfo, getSecurity } from '@/api/task'
import { mapGetters, mapState } from 'vuex';

import { formatDate, transTimestamp } from '@/utils/timeUTC'
import { db } from "@/utils/db";
import { processJSON } from "./test/dxf2geojson";
import aa from './test/grm_all.json';
export default {
  data() {
    return {
      uploadUrl: 'http://192.168.8.152:5000/upload',
      ipUrl: '10.168.4.100',
      activeName: '1',
      search: '',
      search1: '',
      fullscreen: false, // 是否全屏
      filterText: '',
      rules: {
        nodes: [
          { required: true, message: `${this.$t('tableRule.nodes')}`, trigger: 'blur' },
        ],
        task_name: [
          { required: true, message: `${this.$t('tableRule.taskName')}`, trigger: 'blur' }
        ],
        task_type: [
          { required: true, message: `${this.$t('tableRule.taskType')}`, trigger: 'change' }
        ],
        recognition_type: [
          { required: true, message: `${this.$t('tableRule.recognition')}`, trigger: 'change' }
        ],
        robotId: [
          { required: true, message: `${this.$t('tableRule.deviceName')}`, trigger: 'change' }
        ],
        // isback: [
        //   { required: true, message: '请选择是否回库', trigger: 'blur' }
        // ],
        founder: [
          { required: true, message: `${this.$t('tableRule.founder')}`, trigger: 'blur' }
        ]
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dotName: '',
      dialogFormVisible: false,
      dialogSite: false,
      dialogUpdateSite: false,
      dialogRobot: false,
      dialogUpdateRobot: false,
      formLabelWidth: '200',
      taskInfo: {
        nodes: '',
        task_name: '',
        task_type: '',
        recognition_type: '',
        robotId: '',
        isback: '',
        founder: '',
      },
      taskTimed: {
        timings: 0,
        isback: '',
        taskDate: [new Date(), ''],
        taskTime: '',
        step: '',
        period: '',
        timed: '',
      },
      timedTaskData: [],
      timedTaskLabel: [
        {
          prop: 'task_state',
          label: 'Task status'
        },
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'task.task_name',
          label: 'Task name'
        },
        {
          prop: 'task.recognition_type',
          label: 'Identifying type'
        },
        {
          prop: 'task.robot.robotname',
          label: 'Robot'
        },
        {
          prop: 'start_time',
          label: 'Start time'
        },
      ],
      taskData: [],
      taskInfoData: [],
      resultInfoData: [],
      taskInfoLabel: [
        {
          prop: 'task_state',
          label: 'Task status'
        },
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'task.task_name',
          label: 'Task name'
        },
        {
          prop: 'task.task_type',
          label: 'Task type'
        },
        {
          prop: 'task.recognition_type',
          label: 'Identifying type'
        },
        {
          prop: 'task.robot.robotname',
          label: 'Robot'
        },
        {
          prop: 'odom',
          label: 'Mileage'
        },
        {
          prop: 'start_time',
          label: 'Start time'
        }, {
          prop: 'end_time',
          label: 'End time'
        },
      ],
      taskLabel: [
        {
          prop: 'founder',
          label: 'Founder'
        },
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'task_name',
          label: 'Task name'
        },
        {
          prop: 'task_type',
          label: 'Task type'
        },
        {
          prop: 'recognition_type',
          label: 'Identifying type'
        },
        {
          prop: 'robot.robotname',
          label: 'Robot'
        },
        {
          prop: 'robot.ip',
          label: 'IP'
        },
        // {
        //   prop: 'isback',
        //   label: 'Back to garage'
        // },
      ],
      resultInfoLabel: [
        {
          prop: 'update_time',
          label: 'Updated time'
        },
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'node_name',
          label: 'PVM'
        },
        {
          prop: 'task_name',
          label: 'Task'
        },
        {
          prop: 'recognition_type',
          label: 'Type'
        },
        {
          prop: 'recognition_result',
          label: 'Result'
        },
        {
          prop: 'image_url',
          label: 'Image'
        },

      ],
      securityInfoLabel: [
        {
          prop: 'recongition_time',
          label: 'Recongition time'
        },
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'type',
          label: 'Type name'
        },
        {
          prop: 'image_url',
          label: 'Inspection picture'
        },

      ],
      rosParamLabel: [
        {
          prop: 'value',
          label: 'Value'
        },
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'param',
          label: 'Param'
        },
        {
          prop: 'type',
          label: 'Type'
        },
      ],
      rosParamInfo: [],
      securityInfo: [],
      // mapName: localStorage.getItem('site'),
      sites: null,
      siteInfo: {
        sitename: '',
        lat_lng: '',
        address: '',
        site_img: '',
        map: '',
        fileName: '',
        toward: '',
        block: ''
      },
      site: localStorage.getItem('site') || '',
      siteId: localStorage.getItem('siteId') || '',
      dialogTiming: false,
      timer: localStorage.getItem('timer'),
      rows: null,
      timings: '0',
      robots: [],
      siteUpdate: {},
      RobotUpdate: {},
      robotInfo: {},
      taskDate: '',
      pickerOptions: {
        start: new Date(),
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
        }
      },

    };
  },
  async created() {
    this.treeData= [{ label: this.site,children:[] }]
    var an = localStorage.getItem('activeName');
    if (an) this.activeName = an;
    else localStorage.setItem('activeName', this.activeName);

    this.getTree();
    this.getTask();
    this.getRobot();

    // 定时任务
    var num = Number(localStorage.getItem('timings'))
    if (num) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = '';
        this.rows = JSON.parse(localStorage.getItem('rowsTask'));
        this.timer = setInterval((() => {
          this.handleStart(this.rows);
        }), num * 1000 * 60)
        // }), 5000)
        localStorage.setItem('timer', this.timer);
      }
    }
  },

  computed: {
    ...mapState('socket', ["socket", 'ips', 'Robot', 'Robots', 'taskState', 'taskStatus', 'robotPose']),
    ...mapGetters(['roles', 'uid']),
    // treeData(){
    //   return [{ label: this.site,children:[] }];
    // } 
  },
  watch: {
    activeName(val) {
      switch (val) {
        case '1': this.getTask();
          break;
        case '2': this.getTaskInfo();
          break;
        case '3': this.getSecurity();
          break;
        case '5': this.getRosParamInfo();
          break;
        case '6': this.getSiteInfo();
          break;
        case '7': this.getRobot();
          break;
        case '8': this.getTimedTask();
          break;
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    Robot: {
      handler(val, oldVal) {
        // console.log('setting watch Robot');
        // console.log(this.Robots);
        // if(!oldVal) return
        // this.ips.forEach(ip => {
        //   // console.log('setting watch Robot');
        //   if(val[ip].taskState.id) console.log(ip,val[ip].taskState.task_type, oldVal[ip].taskState.task_type);
        //   if (val[ip].taskState.id && val[ip].taskState.task_type !== oldVal[ip].taskState.task_type) {
        //     console.log(ip);
        //     this.updateTaskInfo(val[ip].taskState);
        //   }
        // });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async deleteTimedTask(id) {
      var res = await deleteTimedTask(id)
      // console.log(res);
      if (res.code == 200) this.$message.success('Delete Success')
      this.getTimedTask();
    },
    handleClose() { },
    async getTimedTask() {
      var res = await getTimedTask()
      // console.log(res);
      res.data.forEach(item => {
        item.start_time = formatDate(item.start_time);
      });
      this.timedTaskData = res.data;
    },
    async deleteRobot(id) {
      var res = await deleteRobot(id);
      console.log(res);
      this.getRobot();
    },
    // 添加机器人
    async addRobot() {
      // console.log(this.robotInfo);
      var res = await addRobot(this.robotInfo);
      console.log(res);
      this.getRobot();
      this.dialogRobot = false;
    },
    // 获取机器人
    async getRobot() {
      var siteId = localStorage.getItem('siteId');
      var robot = await getRobot(siteId);
      this.robots = robot.data;
    },
    updateRobot(o) {
      console.log(o);
      this.RobotUpdate = o;
      this.dialogUpdateRobot = true;
    },
    async updateRobotInfo() {

      console.log(this.RobotUpdate);
      var robot = await updateRobot(this.RobotUpdate);
      console.log(robot);
      this.dialogUpdateRobot = false;
    },
    // 懒加载tree
    loadTree(node, resolve) {
      // loadNode(node, resolve) {
      // 假设你有一个获取节点子节点数据的API
      fetchNodeChildren(node.data.id).then(childrenData => {
        // 将子节点数据注入当前节点
        resolve(childrenData);
      });
    // },
      // console.log(node);
      // if (node.level === 0) { // 初始的级数（最顶层）
      //   return resolve([{ label: this.site }]); // 最顶层数据渲染为region
      // }
      // if (node.level >= 1){
      //   console.log(node.id,node.key);
      //   // const children = this.getChildrenByNodeId(node.id);
      //   return resolve([]);
      // } 
    },
    getChildrenByNodeId(id) {
      const node = this.findNodeById(this.treeData, id);
      return (node && node.children) ? node.children : [];
    },
    findNodeById(nodes, id) {
      for (let node of nodes) {
        if (node.id === id) {
          return node;
        } else if (node.children) {
          const found = this.findNodeById(node.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    async getload(node,resolve){
      console.log(node.key);
      var tree1 = await getMapTree({ name: 'map_grm_all', id: this.siteId });
      return resolve(tree1.data);
    },
    // 获取tree
    async getTree() {
      console.time('1')
      var list = await db.maps.where("sitename").equals(`${this.site}`).toArray();
      if (list.length) this.treeData = JSON.parse(list[0].tree);
      console.log(JSON.parse(list[0].tree));
      console.timeEnd('1')
    },
    async setSiteName(siteId, site, tablename) {
      try {
        this.$loading.show();
        // 缓存数据
        this.site = site;
        localStorage.setItem('site', site);
        localStorage.setItem('siteId', siteId);
        this.$store.dispatch('socket/getRobot', siteId);
        this.getTree();

        var list = await db.maps.where("sitename").equals(`${site}`).toArray();
        if (list.length) {
          this.$loading.hide();
          localStorage.setItem('center', JSON.stringify(list[0].center));
        }
        else {
          const res = await getSiteInfo({ id: siteId });
          console.log(res.data);
          const { center, zoom, map, blocks } = res.data;
          localStorage.setItem('center', JSON.stringify(center));

          console.log(map);

          this.$loading.hide();
          var tree1 = await getMapTree({ name: tablename, id: siteId });
          this.treeData = tree1.data;
          var tree = JSON.stringify(tree1.data);

          // var as = await db.maps.add({ siteId, sitename: site, center, zoom, map, tree });
          var as = await db.maps.add({ siteId, sitename: site, blocks, center, zoom, map });
          console.log(as);
        }
      } catch (error) {
        console.log("error in chengeMap: ", error);
      }
    },
    // 添加场地，建图
    async addSite() {
      // console.time('1')
      // var bb = processJSON(aa,1);
      // console.log(bb);
      // console.timeEnd('1')
      this.dialogSite = false;
      var res1 = await setSiteMap(this.siteInfo);
      console.log(res1);

      // 再次刷新场地
      var { data } = await getSiteName({ uid: this.uid });
      this.sites = data;
    },
    // 文件名 
    handlePreview(q, file) {
      this.siteInfo.fileName = file.name
    },
    // 获取场地信息
    async getSiteInfo() {
      var { data } = await getSiteName({ uid: this.uid });
      this.sites = data;
      // console.log(data);

      // 获取本地存储的场地名称
      var ls = localStorage.getItem('site');
      if (ls) this.site = ls;
      else {
        this.site = data[0].sitename;
        localStorage.setItem('site', data[0].sitename);
        localStorage.setItem('center', data[0].center);
        localStorage.setItem('zoom', data[0].zoom);

        this.setSiteName(data[0].id, this.site, data[0].tablename)
      }
    },
    // 更新场地信息
    updateSite(o) {
      console.log(o);
      o.center = o.center[0] + ',' + o.center[1];
      this.siteUpdate = o;
      this.dialogUpdateSite = true;
    },
    async updateSiteInfo() {
      this.siteUpdate.center = this.siteUpdate.center.split(',').map(parseFloat)
      console.log(this.siteUpdate);
      var res = await updateSite(this.siteUpdate);
      console.log(res);
      this.dialogUpdateSite = false;
    },
    async getRosParamInfo() {
      var res = await getRosParam();
      console.log(res);
      this.rosParamInfo = res.data;
    },
    async getSecurity() {
      var res = await getSecurity();
      this.securityInfo = res.data;
    },
    async getResultInfo(id) {
      console.log(id);
      var res = await getResultInfo({ id });
      if (!res.data.length) {
        this.$message(`${this.$t('setting.none2')}`);
      }
      else {
        res.data.forEach(item => {
          item.update_time = formatDate(item.update_time);
        });
        this.resultInfoData = res.data;
        this.activeName = '4';
      }
    },
    async downloadResultInfo(id) {
      var { data } = await getReport({ taskId: id })
      if (data) {
        var url = `http://${this.ipUrl}:8080/pdf/${data}`;
        window.open(url, '_blank');
      }
      else this.$message(`${this.$t('setting.none1')}`)

    },
    async updateTaskInfo(data) {
      // console.log(data);
      var res = await updateTaskInfo(data);
      if (res.code == 200) console.log('Update success');
      this.getTaskInfo();
    },
    handleClick(tab, event) {
      localStorage.setItem('activeName', this.activeName);
    },

    // 暂停，停止
    async pauseTask(ip, num, taskId) {
      this.$store.dispatch('socket/pauseTask', { ip, num, taskId });

      if (num == 0) {
        var res = await updateTaskInfoState({ id: taskId });

        if (res.code == 200) console.log('Update success');
        this.getTaskInfo();
        this.$store.dispatch('socket/cancelNav', { ip });
      }

    },
    // 取消定时任务
    async cancelTask() {
      clearInterval(this.timer);
      this.timer = '';
      this.$message.success('已取消定时任务')
      localStorage.setItem('timer', this.timer);
      localStorage.setItem('timings', 0);
    },
    // 打开弹框
    handleTiming(row) {
      if (this.timer) {
        this.$message.error('已有定时任务，请先取消上一个定时任务');
        this.dialogTiming = false;
        return
      }
      this.dialogTiming = true;
      this.rows = row;
    },
    // 定时任务
    async handleTiming1() {
      var num = this.taskTimed.timings;

      if (!num) {
        // console.log(num);
        this.handleStart(this.rows);
      }
      else {
        const data = { ...this.taskTimed, taskId: this.rows.id }
        console.log(data);
        var res = await setTimedTask(data)
        console.log(res);
      }
      this.dialogTiming = false;
    },
    // async handleTiming1() {
    //   var num = Number(this.timings)
    //   if (!num) this.handleStart(this.rows);
    //   else {
    //     this.$message.success('开始定时任务');
    //     this.handleStart(this.rows);
    //     this.timer = setInterval(() => {
    //       this.handleStart(this.rows);
    //     }, num * 1000 * 60)
    //     // }, 5000)
    //     localStorage.setItem('timer', this.timer);
    //     localStorage.setItem('rowsTask', JSON.stringify(this.rows));
    //   }
    //   localStorage.setItem('timings', this.timings);

    //   this.dialogTiming = false;
    // },
    // 任务下发
    async handleStart(row) {
      console.log('任务下发');
      const { recognition_type, task_name, isback, nodes, robot } = row;
      const recognitionTypes = { 'Visible light': 1, 'Infrared light': 2, 'Mix': 3, };
      // console.log(nodes);
      var task_nodes = nodes.split(',')
      var id = Math.round(Math.random() * 900000000 + 100000000)
      var taskmsg = {
        id, task_type: 1,//#类型： 1：运行 0:停止 2:暂停
        recognition_type: recognitionTypes[recognition_type],//#识别类型： 1：可见光 2：红外 3：混合
        task_name, task_nodes,
        back_node: isback == 'Yes' ? 'charge' : '',
      };

      this.$store.dispatch('socket/sendTask', { ip: robot.ip, taskmsg });

      // console.log('任务下发',this.Robot);
      var taskData = { id, task_odom: 0, task_state: 1, taskId: row.id, start_time: this.Robot[robot.ip].taskState.start_time }
      var res = await setTaskInfo(taskData);
      console.log(res);

      this.goback()
      // 获取任务信息
      this.getTaskInfo();
      this.activeName = '2';
    },
    // 任务编辑
    handleEdit({ nodes }) {
      this.$refs.tree.setCheckedKeys(nodes.split(','))
    },
    // 任务删除
    async handleDelete(id) {
      var res = await deleteTask(id)
      console.log(res);
      this.$message.success('success')
      this.getTask();
    },

    // 删除任务信息
    async deleteTaskInfo(id) {
      var res = await deleteTaskInfo(id)
      console.log(res);
      this.$message.success('success')
      this.getTaskInfo();
    },

    // 获取任务
    async getTask() {
      var task = await getTask();
      this.taskData = task.data;
    },
    // 获取任务信息
    async getTaskInfo() {
      var taskinfo = await getTaskInfo();
      // console.log(taskinfo.data);
      this.taskInfoData = taskinfo.data;
    },

    // 添加任务的按钮
    btnTask() {
      var dotName = this.$refs.tree.getCheckedKeys().filter(i => isNaN(i))
      if (!dotName.length) {
        this.$message.error(`${this.$t('setting.choosearea')}`);
        return;
      }
      // console.log(dotName.join(','));

      const seen = new Set();
      const result = dotName.reduce((acc, node) => {
        const trimmed = node.slice(0, -2);
        if (!seen.has(trimmed)) {
          seen.add(trimmed);
          acc.push(trimmed);
        }
        return acc;
      }, []);
      console.log(result);
      var nodes = result.join(',');
      this.taskInfo.nodes = nodes;
      this.dialogFormVisible = true;
    },

    // 创建任务
    async createTask(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // alert('submit!');
          // console.log(this.taskInfo);
          var res = await createTask(this.taskInfo)

          console.log(res);
          if (res.code == 200) {
            this.$message.success('Task creation Success')
          } else {
            this.$message.error('Task creation failed, the task name already exists');
            return;
          }
          this.taskInfo.recognition_type = '';
          this.taskInfo = {};
          this.getTask();
          this.dialogFormVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 返回首页
    goback() {
      this.$router.push('/')
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getCheckedKeys() {
      this.dotName = this.$refs.tree.getCheckedKeys().filter(i => isNaN(i))
      console.log(this.dotName);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys(['HZ_BL1_R1_S2_1', 'HZ_BL1_R1_S2_2', 'HZ_BL1_R1_S2_3', 'HZ_BL1_R1_S2_4', 'HZ_BL1_R1_S2_5', 'HZ_BL1_R1_S2_10', 'HZ_BL1_R1_S2_11', 'HZ_BL1_R1_S2_7', 'HZ_BL1_R1_S2_12', 'HZ_BL1_R1_S2_9', 'HZ_BL1_R1_S2_13', 'HZ_BL1_R1_S2_8', 'HZ_BL1_R1_S2_6']);
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    // table 奇偶
    tableRowClassName(rowIndex) {
      if (rowIndex.rowIndex % 2 != 0) return 'evenRow';
      return 'oddRow';
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      // 判断是否已经是全屏
      // 如果是全屏，退出
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        console.log('已还原！');
      } else {    // 否则，进入全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
        console.log('已全屏！');
      }
      // 改变当前全屏状态
      this.fullscreen = !this.fullscreen;
    },

  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/element.scss';

/deep/ .el-card {
  position: unset;
  margin: 10px;
  // background-color: #fff;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

// -------------

.moduleTable {
  // overflow: scroll;233
  height: calc(100vh - 1.45rem);

  overflow-y: scroll;

  &::-webkit-scrollbar {
    // 滚动条样式
    width: 3px;
    height: 3px;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #25283b;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: #373b57;
  }
}


.dataScreen {
  background-color: #0f0f0f;
  background-image: url(./img/bg.png);
  color: #eeeeee;
  font-size: .1rem;
}

.main-container {
  background-color: #0f0f0f;
  background-image: url(./img/bg.png);
  color: #eeeeee;
  font-size: .1rem;
}

.context_ring {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.ring_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: .05rem;
}


.top {
  position: relative;
  overflow: hidden;
  background: #24242438;
  height: 10vh;
  backdrop-filter: blur(10px);

  img {
    margin-top: 10px;
    width: 100%;
  }

  .logo {
    position: absolute;
    top: 30%;
    left: 12%;
    transform: translate(-50%, -50%);
    width: 1rem;

    img {
      width: 100%;
      animation: zxc 8s infinite linear;
    }

    @keyframes zxc {
      from {
        transform: rotateY(-360deg);
      }

      to {
        transform: rotateY(0deg);
      }
    }
  }

  .title {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: .2rem;
    transform: translate(-50%, -50%);
    // display: flex;
    // justify-content: center;
  }

  .svgicon {
    display: flex;
    align-items: center;

    .icon {
      margin-left: 10px;
    }
  }

  .t_btn,
  .t_r {
    position: absolute;
    top: 35%;
    right: 0%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .t_r {
    // right: 10%;
    margin-right: .3rem;
    font-size: .1rem;
  }
}

.main {
  display: flex;
  justify-content: space-between;
}

.left,
.right {
  width: 29%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: .1rem;

  .task_title {
    width: 100%;
    height: .2rem;
    color: #f0f0f0;
    line-height: .2rem;
    padding-left: .25rem;
    font-weight: 700;

    background-image: url('./img/title.png');
    background-size: 100% 100%;
  }
}

.fonts {
  color: #eeeeee;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.left {
  // left: 0;
  z-index: 100;
  font-size: .1rem;

  .task_box {
    background-color: #1eaefc23;
    border: .1rem solid transparent;

    color: #9cdcfe;
    border-image: url('./img/box02.png') 33 stretch;
    // margin-bottom: 5px;
    font-size: .1rem;
    height: 90vh;
    // overflow: hidden;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      // 滚动条样式
      width: 3px;
      height: 3px;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: #25283b;
    }

    &::-webkit-scrollbar-track {
      border-radius: 0;
      background: #373b57;
    }
  }

  .l-top {
    // margin: 20px;
    border: .1rem solid transparent;
    border-image: url('./img/border.png') 33 stretch;
    // background: #242424cb;
    background: #24242438;

    height: 47%;
    overflow: hidden;
  }

  .l_bottom {
    // background: #242424cb;
    background: #24242438;
    border: .1rem solid transparent;
    // border-image: url('./img/border.png') 33 stretch;
    border-image: url('./img/box02.png') 33 stretch;
    height: 53%;
    margin-top: .1rem;
    overflow: hidden;
  }


}

.zdy {
  background-color: #27aae633;
  border-color: #40a5f4;
  color: #eeeeee;
}

.zdy:hover {
  background-color: #27aae65e;
  border-color: #40a6f4ce;
}

.c_main {

  // background-color: #1eaefc23 !important;
  // background-color: #000000 !important;
  position: absolute;
  margin-left: .1rem;
  margin-bottom: .1rem;
  width: 70%;
  height: 86vh;
  // background: #242424cb;
  background: #24242438;
  // background: #797979cb;
  // bottom: 310px;
  bottom: 0;
  right: .1rem;
  overflow: hidden;
  // font-size: .2rem;

  border: .1rem solid transparent;
  border-image: url('./img/box02.png') 33 stretch;
}


/deep/ #he-plugin-standard {
  height: 300px !important;
  width: 100% !important;
}
</style>
./test/dxf2geojson