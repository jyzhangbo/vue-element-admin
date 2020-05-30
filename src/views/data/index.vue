<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <div>
        <el-form ref="listTime" :model="listTime" label-width="130px">
          <el-row :gutter="20">
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
              <el-form-item label="设备编号:">
                <task-device-select v-model="listTime.deviceNum" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="end">
            <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
            <el-button type="info" icon="el-icon-magic-stick" @click="resetQuery('listQuery')">重置</el-button>
            <el-button type="success" style="background-color: #42b983;" icon="el-icon-download">导出</el-button>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="panel-group" style="background-color:white">
      <el-row class="panel-group">
        <el-col :span="3" :offset="21">
          <el-button type="primary" icon="el-icon-picture" @click="changeShow()">
            切换视图
          </el-button>
        </el-col>
      </el-row>
      <div v-show="chartShow" id="chartDiv" class="chart-container">
        <div id="mnsjChart" style="width: 100%;height:400px;" />
      </div>
      <div v-show="!chartShow">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column v-for="(value, key) in tableHeader" :key="key" :label="value" width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.values[key] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { queryData, queryTableData } from '@/api/data/index'
import echarts from 'echarts'
import TaskDeviceSelect from '@/components/biz/TaskDeviceSelect'

export default {
  name: 'LineChart',
  components: {
    TaskDeviceSelect
  },
  data() {
    return {
      tableHeader: {},
      chartShow: false,
      listTime: {
        startTime: '',
        deviceNum: [],
        endTime: ''
      },
      chart: null,
      tableData: []
    }
  },
  mounted() {
    this.queryDataTable()
  },
  methods: {
    changeShow() {
      if (this.chartShow === true) {
        this.chartShow = false
        this.queryDataTable()
      } else {
        this.chartShow = true
        this.initChart()
      }
    },
    resetQuery(formName) {
      this.$refs[formName].resetFields()
    },
    initChart() {
      var contain = document.getElementById('mnsjChart')
      contain.style.width = window.innerWidth - 300 + 'px'
      contain.style.height = '300px'
      this.chart = echarts.init(contain)
      this.btnQuery()
    },
    queryDataTable() {
      queryTableData(this.listTime).then(resp => {
        this.tableData = resp.data.datas
        this.listTime.deviceNum = resp.data.deviceNum
        this.tableHeader = resp.data.tableHeader
      })
    },
    btnQuery() {
      if (this.chartShow === false) {
        this.queryDataTable()
      } else {
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

