<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <div>
        <el-form ref="listTime" :model="listTime" :rules="rules" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="起点:" prop="startTime">
                <el-date-picker v-model="listTime.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="恒温点:" prop="stableTime">
                <el-date-picker v-model="listTime.stableTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="降温点:" prop="downTime">
                <el-date-picker v-model="listTime.downTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="终点:" prop="endTime">
                <el-date-picker v-model="listTime.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号:" prop="deviceNum">
                <el-cascader v-model="listTime.deviceNum" :options="options" style="width: 400px" placeholder="请选择" filterable clearable @change="deviceNumChange" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="间隔(分钟):" prop="timeSpace">
                <el-input v-model="listTime.timeSpace" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="随机分钟:" prop="randomTime">
                <el-input v-model="listTime.randomTime" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="simulationData()">数据编辑</el-button>
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="copyDataToDiglog()">复制数据</el-button>
              <el-upload
                class="upload-demo inline-block margin-right-10"
                action="https://localhost:8080/excel/upload"
                name="upfile"
                :data="uploadData"
                :multiple="false"
                :show-file-list="false"
                :on-success="handleSuccess"
              >
                <el-button style="background-color: #42b983;" type="success">点击上传</el-button>
              </el-upload>
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
        <div id="mnsjChart" style="width:100%;height:400px;" />
      </div>
      <div v-show="!chartShow">
        <el-table :data="tableData" border stripe style="width: 100%">
          <el-table-column type="index" label="序号" min-width="5%" />
          <el-table-column prop="time" label="时间" min-width="10%" />
          <el-table-column v-for="(value, key) in tableHeader" :key="key" :label="value" min-width="5%">
            <template slot-scope="scope">
              <el-input v-show="scope.row.show" v-model="scope.row.values[key]" placeholder="请输入内容" />
              <span v-show="!scope.row.show">{{ scope.row.values[key] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="20%">
            <template slot-scope="scope">
              <el-button @click="scope.row.show =true">编辑</el-button>
              <el-button @click="saveData(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:auto;   width:60%">
          <el-pagination layout="total, prev, pager, next, jumper" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; queryDataTable();}" />
        </div>
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
    <el-dialog title="数据复制" :visible.sync="dialogFormVisible">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card class="box-card" style="border-radius: 20px">
            <el-select v-model="copyDataInput.fromAttr" placeholder="请选择">
              <el-option v-for="(value, key) in tableHeader" :key="key" :label="key" :value="key">{{ value }}</el-option>
            </el-select>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" style="border-radius: 20px">
            <el-input v-model="copyDataInput.addData" placeholder="固定增加数" clearable />
            <el-input v-model="copyDataInput.randomData" placeholder="随机变动数" clearable />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card" style="border-radius: 20px">
            <el-checkbox-group v-model="copyDataInput.toAttr">
              <el-checkbox v-for="(value, key) in tableHeader" :key="key" :label="key">{{ value }}</el-checkbox>
            </el-checkbox-group>
          </el-card>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="copyData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryData, queryTableData, simulationData, changeData, copyData } from '@/api/data/index'
import echarts from 'echarts'
import { listTaskDevice } from '@/api/base/index'

export default {
  data() {
    return {
      rules: {
        startTime: [
          { required: true, message: '请输入起点时间', trigger: 'change' }
        ],
        stableTime: [
          { required: true, message: '请输入恒温点时间', trigger: 'change' }
        ],
        downTime: [
          { required: true, message: '请输入降温点时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请输入终点时间', trigger: 'change' }
        ],
        deviceNum: [
          { type: 'array', required: true, message: '请输入设备编号', trigger: 'change' }
        ],
        timeSpace: [
          { required: true, message: '请输入时间间隔', trigger: 'blur' }
        ],
        randomTime: [
          { required: true, message: '请输入随机分钟', trigger: 'blur' }
        ]
      },
      tableHeader: {},
      dialogFormVisible: false,
      chart: null,
      tableData: [],
      chartShow: false,
      listTime: {
        startTime: '',
        stableTime: '',
        downTime: '',
        endTime: '',
        deviceNum: [],
        timeSpace: '',
        randomTime: ''

      },
      listTemp: [],
      copyDataInput: {
        fromAttr: '',
        toAttr: [],
        addData: '',
        randomData: ''
      },
      options: [],
      tablePage: { total: 0, pageSize: 10, pageNumber: 1 },
      uploadData: {}
    }
  },
  mounted() {
    this.getDeviceNum()
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.btnQuery()
    },
    deviceNumChange() {
      this.uploadData = {
        taskNum: this.listTime.deviceNum[0],
        deviceNum: this.listTime.deviceNum[1]
      }
    },
    getDeviceNum() {
      listTaskDevice().then(resp => {
        this.options = resp.data
        this.listTime.deviceNum.push(resp.data[0].value)
        this.listTime.deviceNum.push(resp.data[0].children[0].value)
        this.uploadData = {
          taskNum: this.listTime.deviceNum[0],
          deviceNum: this.listTime.deviceNum[1]
        }
        this.queryDataTable()
      })
    },
    copyData() {
      copyData(this.copyDataInput, this.listTime).then(resp => {
        this.dialogFormVisible = false
        this.btnQuery()
        this.copyDataInput = {
          fromAttr: '',
          toAttr: [],
          addData: '',
          randomData: ''
        }
      })
    },
    copyDataToDiglog() {
      this.dialogFormVisible = true
    },
    saveData(row) {
      row.show = false
      changeData(row, this.listTime)
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
    btnQuery() {
      if (this.chartShow === false) {
        this.queryDataTable()
      } else {
        this.queryDataChart()
      }
    },
    queryDataTable() {
      queryTableData(this.listTime, this.tablePage).then(resp => {
        this.tableData = resp.data.datas
        this.tableHeader = resp.data.tableHeader
        this.listTemp = []
        for (var key in this.tableHeader) {
          var tempData = {
            name: this.tableHeader[key],
            code: key,
            startTemp: '',
            stableTemp: '',
            downTemp: '',
            endTemp: '',
            randomData: '',
            effective: true
          }
          this.listTemp.push(tempData)
        }
        this.tablePage.total = resp.data.total
      })
    },
    initChart() {
      var contain = document.getElementById('mnsjChart')
      contain.style.width = window.innerWidth - 300 + 'px'
      contain.style.height = '300px'
      this.chart = echarts.init(contain)
      this.queryDataChart()
    },
    queryDataChart() {
      queryData(this.listTime).then(resp => {
        this.tableHeader = resp.data.tableHeader
        this.listTemp = []
        for (var key in this.tableHeader) {
          var tempData = {
            name: this.tableHeader[key],
            code: key,
            startTemp: '',
            stableTemp: '',
            downTemp: '',
            endTemp: '',
            randomData: '',
            effective: true
          }
          this.listTemp.push(tempData)
        }
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
    },
    simulationData() {
      this.$refs.listTime.validate(valid => {
        if (valid) {
          var temps = []
          for (var i = 0; i < this.listTemp.length; i++) {
            if (this.listTemp[i]['effective'] === true) {
              temps.push(this.listTemp[i])
            }
          }
          simulationData(this.listTime, temps).then(resp => {
            this.btnQuery()
          })
        } else {
          console.log('error submit!!')
          return false
        }
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

.inline-block {
  display: inline-block;
}

</style>

