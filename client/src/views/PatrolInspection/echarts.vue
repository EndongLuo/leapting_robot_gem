<template>
  <div>
    <!-- <div id="charts" style="height: 1.8rem;width: 1.8rem;"></div> -->
    <div id="main" style="height: 1.8rem;width: 1.6rem; margin-top: -20px; "></div>
    <div id="charts" style="height: 1.3rem;width: 1.6rem; margin-top: -10px;"></div>
    <!-- <div id="charts3" style="height: 1.6rem;width: 1.6rem; margin-top: -50px;"></div> -->
  </div>
</template>

<script>
import { getResultInfo, getTaskInfo } from '@/api/task'
import * as echarts from 'echarts';
export default {
  name: 'LeaptingRobotEcharts',

  data() {
    return {
    };
  },

  async mounted() {
    this.chart1();
    this.chart2();
    // this.chart3();
  },

  methods: {
    async chart3() {
      var chartDom = document.getElementById('charts3');
      var myChart = echarts.init(chartDom, 'dark');
      var option;

      option = {
        backgroundColor: "#100C2A02",
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        // legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 2, 301, 334, 390, 330, 320]
          },
          {
            name: 'Mail Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: 'Affiliate Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
        ]
      };

      option && myChart.setOption(option);

    },
    async chart2() {
      var { data } = await getTaskInfo(0);
      // console.log(data);

      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom, 'dark');
      var option;

      option = {
        color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
        backgroundColor: "#100C2A02",
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // type: 'cross',
            label: {
              backgroundColor: '#100C2A02',
              color: '#fff'
            }
          }
        },
        title: {
          text: 'Inspection Area',
          left: 'center',
          top: '15%'
        },
        grid: {
          left: '3%',
          right: '7%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: data.x
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Inspection Area(㎡)',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(128, 255, 165)'
                },
                {
                  offset: 1,
                  color: 'rgb(1, 191, 236)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: data.y
          },

        ]
      };

      option && myChart.setOption(option);

    },
    async chart1() {
      var id = 0;
      var res = await getResultInfo({ id });
      var { Normal, clean, infrared, connector } = res.data;

      var chartDom = document.getElementById('charts');
      var myChart = echarts.init(chartDom, 'dark');

      var option = {
        color: ['#409EFF'],
        backgroundColor: "#100C2A02",
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   // bottom: '-20%',
        //   // left: 'center'
        //   orient: 'vertical',
        //   left: 'right'
        // },
        title: {
          text: 'Inspection Result',
          left: 'center',
          top: '-5%'
        },
        series: [
          {
            name: 'Inspection Result(N)',
            type: 'pie',
            // radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              // label: {
              //   show: true,
              //   fontSize: 30,
              //   fontWeight: 'bold'
              // }
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: true
            },
            data: []
          }
        ]
      };

      option.series[0].data = [
        // { value: `${Normal}`, name: 'Normal' },
        { value: `${clean}`, name: 'Clean' },
        { value: `${infrared}`, name: 'Infrared' },
        { value: `${connector}`, name: 'Connector' },
      ]
      // console.log(option.series[0].data);
      // myChart.on('click', function (param) {
      //   console.log(param); //X轴的值
      // });

      if (option && typeof option === 'object') myChart.setOption(option);
      window.addEventListener('resize', myChart.resize);
    }
  },
};
</script>

<style lang="sass" scoped>

</style>