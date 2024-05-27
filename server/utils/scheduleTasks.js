const schedule = require('node-schedule');
const { getTimedTask, updateTimedTaskState, setTaskInfo } = require('../models/task');

const { robotArr } = require('../socket/robotSocket');

let taskState = 0;
const TimedTaskFn = async () => {
  try {
    const now = new Date();
    const tasks = await getTimedTask(0);

    const pastTasks = tasks
      .filter(task => new Date(task.start_time) <= now)
      .sort((a, b) => new Date(b.start_time) - new Date(a.start_time)); // 假设最新的任务在最前面

    // 找到最接近当前时间的任务
    const nearestTask = pastTasks[0];

    if (pastTasks.length > 1) {
      const pastTaskIds = pastTasks.slice(1).map(task => task.id);
      await updateTimedTaskState(pastTaskIds, 3);
    }

    if (nearestTask) {
      var ip = nearestTask.task.robot.ip;
      var id = nearestTask.id
      console.log("最接近的任务ID:", nearestTask.taskId, ip);

      
      const { nodes, task_name, recognition_type, isback } = nearestTask.task;

      const taskDetail = {
        id, task_type: 1,
        recognition_type: Number(recognition_type),
        task_name,
        task_nodes: nodes.split(','),
        back_node: isback,
      }
      try {
        robotArr[ip].taskState(msg=>{
          console.log(msg.task_state);
          if (msg.task_state == 1) {
            console.log("任务执行中");
            taskState = 1;
          }
        })
        
        // if(taskState == 1) return;
        robotArr[ip].sendTask(taskDetail);

        var taskData = { id, task_odom: 0, task_state: 1, taskId: nearestTask.taskId };
        var res = await setTaskInfo(taskData);
        // console.log(res);

        await updateTimedTaskState(id, 2); // 更新最近任务的状态
      } catch (error) {
        console.log('发送任务失败:', error);
        await updateTimedTaskState(id, 3); // 更新最近任务的状态
      }

    }

  } catch (error) {
    console.error('定时任务执行失败:', error);
  }
}

const scheduleDataUpdate = () => {
  schedule.scheduleJob('*/1 * * * *', TimedTaskFn);
}

module.exports = scheduleDataUpdate;
