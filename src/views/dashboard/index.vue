<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <div>
        <el-form ref="listTime" :model="listTime" label-width="130px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="起点:" prop="alarmObject">
                <el-date-picker v-model="listTime.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备编号:">
                <task-device-select v-model="listTime.deviceNum" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="panel-group" style="background-color:white">
      <el-image style="width: 200px; height: 200px" :src="deviceImg" />
    </div>
    <div class="panel-group" style="background-color:white">
      <div id="chartDiv" class="chart-container">
        <div id="mnsjChart" style="width: 100%;height:400px;" />
      </div>
    </div>
    <div class="panel-group" style="background-color:white">
      <span style="font-size:30px;">{{ time }}</span>
      <el-row :gutter="30">
        <el-col v-for="item in cardData" :key="item.name" :span="6">
          <el-card class="box-card" style="border-radius: 20px;margin-top:10px;">
            <div>
              <span style="font-size:30px;">{{ item.name }}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style="font-size:30px;">{{ item.realtimevalue }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { queryData } from '@/api/data/index'
import echarts from 'echarts'
import TaskDeviceSelect from '@/components/biz/TaskDeviceSelect'
import moment from 'moment'

export default {
  name: 'LineChart',
  components: {
    TaskDeviceSelect
  },
  data() {
    return {
      cardData: [],
      time: '',
      listTime: {
        startTime: moment().format('yyyy-MM-DD 00:00:00'),
        deviceNum: [],
        endTime: ''
      },
      chart: null,
      deviceImg: ''
    }
  },
  mounted() {
    this.initChart()
    if (this.timer) {
      clearInterval(this.timer)
    } else {
      this.timer = setInterval(() => {
        this.btnQuery()
      }, 300000)
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    initChart() {
      var contain = document.getElementById('mnsjChart')
      contain.style.height = '300px'
      this.chart = echarts.init(contain)
      this.btnQuery()
    },
    btnQuery() {
      queryData(this.listTime).then(resp => {
        var seriesData = []
        var legendData = []
        this.cardData = []
        for (const item of resp.data.yDatas) {
          var data = {
            name: item.name,
            type: 'line',
            data: item.values
          }
          seriesData.push(data)
          legendData.push(item.name)
          var data1 = {
            name: item.name,
            realtimevalue: item.values[item.values.length - 1]
          }
          this.cardData.push(data1)
        }
        this.setOptionData(resp.data.xDatas, seriesData, legendData)
        this.deviceImg = resp.data.deviceImg
        this.listTime.deviceNum = resp.data.deviceNum
        this.time = resp.data.xDatas[resp.data.xDatas.length - 1]
      })
    },
    setOptionData(xDatas, seriesData, legendData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        toolbox: {
          itemSize: 30,
          feature: {
            saveAsImage: {
              show: true
            }
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: xDatas
        }],
        yAxis: [{
          type: 'value',
          name: '(℃)',
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          }
        }],
        series: seriesData
      })
    }
  }
}
</script>

<style scoped>
.chart-container{
  position: relative;
  width: 100%;
  height: 100%;
}
.dashboard-editor-container {
  padding: 2px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

.panel-group {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
}

</style>

