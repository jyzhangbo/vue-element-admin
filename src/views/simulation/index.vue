<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <div>
        <el-form ref="listTime" :model="listTime" label-width="130px">
          <el-row :gutter="5">
            <el-col :span="6">
              <el-form-item label="起点:" prop="alarmObject">
                <el-date-picker v-model="listTime.startTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="恒温点:" prop="alarmTime">
                <el-date-picker v-model="listTime.stableTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="降温点:" prop="alarmTime">
                <el-date-picker v-model="listTime.downTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终点:" prop="alarmTime">
                <el-date-picker v-model="listTime.endTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备编号:" prop="deviceNum">
                <el-select v-model="listTime.deviceNum" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="间隔:" prop="dataSpace">
                <el-input v-model="listTemp.dataSpace" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="随机分钟:" prop="randomTime">
                <el-input v-model="listTemp.randomTime" />
              </el-form-item>
            </el-col>
            <el-col :span="3" :offset="3">
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="simulationData()">模拟数据</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="panel-group" style="background-color:white">
      <div class="chart-container">
        <div id="mnsjChart" style="width: 100%;height:400px;" />
      </div>
      <div>
        <el-row :gutter="5">
          <el-col v-for="item in listTemp" :key="item.name" :span="3">
            <el-card class="box-card" style="border-radius: 20px">
              <div style="font-size:13px; padding-top:10px">
                {{ item.name }}
              </div>
              <div style="font-size:13px; padding-top:10px">
                <el-checkbox v-model="item.effective">
                  有效性
                </el-checkbox>
              </div>
              <div style="font-size:13px; padding-top:10px">
                <el-input v-model="item.randomData" placeholder="浮动值" clearable />
              </div>
              <div style="font-size:13px; padding-top:10px">
                <el-input v-model="item.startTemp" placeholder="起点" clearable />
              </div>
              <div style="font-size:13px; padding-top:10px">
                <el-input v-model="item.stableTemp" placeholder="恒温点" clearable />
              </div>
              <div style="font-size:13px; padding-top:10px">
                <el-input v-model="item.downTemp" placeholder="降温点" clearable />
              </div>
              <div class="card-panel-description" style="font-size:13px; padding-top:10px">
                <el-input v-model="item.endTemp" placeholder="终点" clearable />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { simulationData } from '@/api/simulation/index'
import { queryData } from '@/api/data/index'
import echarts from 'echarts'

export default {
  name: 'LineChart',
  data() {
    return {
      listTime: {
        startTime: '',
        stableTime: '',
        downTime: '',
        endTime: ''
      },
      listTemp: [{
        startTemp: '',
        stableTemp: '',
        downTemp: '',
        endTemp: '',
        randomData: '',
        deviceNum: '',
        effective: true,
        name: 'T1'
      },
      {
        startTemp: '',
        stableTemp: '',
        downTemp: '',
        endTemp: '',
        randomData: '',
        deviceNum: '',
        effective: true,
        name: 'T2'
      }],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById('mnsjChart'))
      queryData(this.listTime).then(resp => {
        var seriesData = []
        var legendData = []
        for (const item of resp.data.yDatas) {
          var data = {
            name: item.name,
            type: 'line',
            data: item.values
          }
          seriesData.push(data)
          legendData.push(item.name)
        }
        this.setOptionData(resp.data.xDatas, seriesData, legendData)
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
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
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
    },
    simulationData() {
      simulationData(this.listTime, this.listTemp).then(resp => {
        var seriesData = []
        var legendData = []
        for (const item of resp.data.yDatas) {
          var data = {
            name: item.name,
            type: 'line',
            data: item.values
          }
          seriesData.push(data)
          legendData.push(item.name)
        }
        this.setOptionData(resp.data.xDatas, seriesData, legendData)
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

