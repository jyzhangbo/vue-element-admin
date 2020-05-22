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
          </el-row>
          <el-row type="flex" justify="end">
            <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
            <el-button type="info" icon="el-icon-magic-stick" @click="resetQuery('listQuery')">重置</el-button>
            <el-button type="success" style="background-color: #42b983;" icon="el-icon-download" @click="exportTableData">导出</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="panel-group" style="background-color:white">
      <div class="chart-container">
        <div id="mnsjChart" style="width: 100%;height:400px;" />
      </div>
    </div>
  </div>
</template>

<script>
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
    resetQuery(formName) {
      this.$refs[formName].resetFields()
    },
    initChart() {
      this.chart = echarts.init(document.getElementById('mnsjChart'))
      this.btnQuery()
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
    btnQuery() {
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

