const { Task, TaskInfo, TimedTask, Robot, ResultInfo,Security } = require('../schema/index');
const { Op } = require("sequelize");
class TaskModel {
  // 创建任务
  static async createTask(data) {
    return await Task.create({
      task_name: data.task_name,
      nodes: data.nodes,
      founder: data.founder,
      recognition_type: data.recognition_type,
      isback: data.isback,
      task_type: data.task_type,
      robotId: data.robotId
    });
  }

  // 获取任务
  static async getTask() {
    return await Task.findAll({
      include: {
        model: Robot,
        attributes: ['robotname', 'ip']
      },
      order:[['id','DESC']],
      where:{ status:1 }
    });
  }

  // 删除任务
  static async deleteTask(id) {
    // return await Task.update({
    //   status:0
    // },{
    //   where:{ id }
    // });
    return await Task.destroy({
      where: { id }
  });
  }

  // 创建任务信息
  static async setTaskInfo(data) {
    return await TaskInfo.create({
      id: data.id,
      odom: data.task_odom,
      path: data.path,
      task_state: data.task_state,
      result: data.progress,
      start_time: data.start_time,
      end_time: data.end_time,
      taskId: data.taskId
    });
  }

  // 获取任务信息
  static async getTaskInfo() { 
    return await TaskInfo.findAll({
      include: [{
        model: Task,
        include: { model: Robot, attributes: ['robotname','ip'] }
      }],
      order:[['start_time','DESC']],
    });
  }  

  // 更新任务信息
  static async updateTaskInfo(data){
    return await TaskInfo.update({ 
      odom: data.task_odom,
      path: data.path,
      task_state: data.task_type, 
      result: data.progress,
      start_time: data.start_time,
      end_time: data.end_time,
    }, {
      where: { id:data.id}
    });
  }

  // 更新任务信息状态
  static async updateTaskInfoState(id){
    return await TaskInfo.update({ 
      task_state: 0, 
    }, {
      where: { id}
    });
  }

  // 删除任务信息
  static async deleteTaskInfo(id){
    return await TaskInfo.destroy({
      where: { id }
    });
  }

  // 获取结果信息
  static async getResultInfo(id) {
    if(id == 0)return await ResultInfo.findAll({
      attributes: ['recognition_result','result_detail'],
    });
    else if(id) return await ResultInfo.findAll({
      where:{
        task_id:id,
        recognition_result: 1
      },
      attributes: ['id','node_name','task_id','recognition_type','image_url','task_name','update_time','result_detail'],
      order:[['update_time','DESC']],
    });
    else return await ResultInfo.findAll({
      where:{
        recognition_result: 1,
        // update_time:{
        //   [Op.lt]: new Date(),
        //   [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
        // },
      },
      limit:10,
      attributes: ['id','node_name','task_id','recognition_type','image_url','result_detail','task_id','update_time','result_detail'],
      order:[['update_time','DESC']],
    });
  }

  // 获取安全检测结果 Security
  static async getSecurity(){
    return await Security.findAll({
      limit:10,
      order:[['recongition_time','DESC']],
    });
  }

  // 创建定时任务
  static async createTimedTask(data) {
    return await TimedTask.bulkCreate(data);
  }

  // 获取定时信息
  static async getTimedTask(task_state = [0,1,2,3]) { 
    return await TimedTask.findAll({
      include: [{
        model: Task,
        include: { model: Robot, attributes: ['robotname','ip'] }
      }],
      where:{ task_state: task_state },
      order:[['start_time','DESC']],
    });
  }

  // 修改定时任务状态
  static async updateTimedTaskState(id,task_state){
    return await TimedTask.update({ 
      task_state: task_state, 
    }, {
      where: { id }
    });
  }

  // 删除定时任务
  static async deleteTimedTask(id){
    return await TimedTask.destroy({
      where: { id }
    });
  }
}

module.exports = TaskModel;