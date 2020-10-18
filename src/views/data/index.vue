<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <div>
        <el-form ref="listTime" :model="listTime" :rules="rules" label-width="auto">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="设备编号:" prop="deviceNum">
                <el-cascader v-model="listTime.deviceNum" :options="options" style="width: 400px" placeholder="请选择" filterable clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
              <el-button type="success" style="background-color: #42b983;" icon="el-icon-download" @click="exportTableData">导出</el-button>
            </el-col>
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
        <div id="mnsjChart" style="width: 100%;height:500px;" />
      </div>
      <div v-show="!chartShow">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column type="index" label="序号" min-width="5%" />
          <el-table-column prop="time" label="时间" min-width="10%" />
          <el-table-column v-for="(value, key) in tableHeader" :key="key" :label="value" min-width="10%">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.values[key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:auto;   width:60%">
          <el-pagination layout="total, prev, pager, next, jumper" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; queryDataTable();}" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { queryData, queryTableData, exportExcel } from '@/api/data/index'
import echarts from 'echarts'
import { listTaskDevice } from '@/api/base/index'

export default {
  name: 'LineChart',
  data() {
    return {
      rules: {
        deviceNum: [
          { type: 'array', required: true, message: '请输入设备编号', trigger: 'change' }
        ]
      },
      tableHeader: {},
      chartShow: false,
      listTime: {
        deviceNum: []
      },
      options: [],
      chart: null,
      tableData: [],
      tablePage: { total: 0, pageSize: 10, pageNumber: 1 }
    }
  },
  mounted() {
    this.getDeviceNum()
  },
  methods: {
    exportTableData() {
      this.$refs.listTime.validate(valid => {
        if (valid) {
          this.$confirm('是否导出excel?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            exportExcel(this.listTime)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getDeviceNum() {
      listTaskDevice().then(resp => {
        this.options = resp.data
        this.listTime.deviceNum.push(resp.data[0].value)
        this.listTime.deviceNum.push(resp.data[0].children[0].value)
        this.queryDataTable()
      })
    },
    changeShow() {
      if (this.chartShow === true) {
        this.chartShow = false
        this.queryDataTable()
      } else {
        this.chartShow = true
        this.initChart()
      }
    },
    initChart() {
      var contain = document.getElementById('mnsjChart')
      contain.style.width = window.innerWidth - 300 + 'px'
      contain.style.height = '500px'
      this.chart = echarts.init(contain)
      this.btnQuery()
    },
    queryDataTable() {
      queryTableData(this.listTime, this.tablePage).then(resp => {
        this.tableData = resp.data.datas
        this.tableHeader = resp.data.tableHeader
        this.tablePage.total = resp.data.total
      })
    },
    btnQuery() {
      this.$refs.listTime.validate(valid => {
        if (valid) {
          if (this.chartShow === false) {
            this.queryDataTable()
          } else {
            queryData(this.listTime).then(resp => {
              var seriesData = []
              var legendData = []
              for (const item of resp.data.ydatas) {
                var data = {
                  name: item.name,
                  type: 'line',
                  data: item.values,
                  smooth: true
                }
                seriesData.push(data)
                legendData.push(item.name)
              }
              this.setOptionData(resp.data.xdatas, seriesData, legendData)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
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
        color: [
          '#c12e34',
          '#e6b600',
          '#0098d9',
          '#2b821d',
          '#005eaa',
          '#339ca8',
          '#cda819',
          '#32a487'
        ],
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

