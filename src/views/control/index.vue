<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <el-form ref="listTime" :model="listTime" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="起点时间:" prop="startTime">
              <el-date-picker v-model="listTime.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="恒温点时间:" prop="stableTime">
              <el-date-picker v-model="listTime.stableTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="降温点时间:" prop="downTime">
              <el-date-picker v-model="listTime.downTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终点时间:" prop="endTime">
              <el-date-picker v-model="listTime.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="起点温度:" prop="startTemp">
              <el-input v-model="listTime.startTemp" placeholder="起点温度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="恒温点温度:" prop="stableTemp">
              <el-input v-model="listTime.stableTemp" placeholder="恒温点温度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="降温点温度:" prop="downTemp">
              <el-input v-model="listTime.downTemp" placeholder="降温点温度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终点温度:" prop="endTemp">
              <el-input v-model="listTime.endTemp" placeholder="终点温度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号:" prop="deviceNum">
              <el-cascader v-model="listTime.deviceNum" :options="options" style="width: 300px" placeholder="请选择" filterable clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button style="background-color: #42b983;" type="success" @click="btnQuery()">查看数据图像</el-button>
            <el-button style="background-color: #42b983;" type="success" @click="btnControl()">下发控制命令</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="panel-group" style="background-color:white">
      <div id="chartDiv" class="chart-container">
        <div id="mnsjChart" style="width:100%;height:400px;" />
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { listTaskDevice } from '@/api/base/index'
import { controlDevice } from '@/api/control/index'

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
        startTemp: [
          { required: true, message: '请输入起点温度', trigger: 'blur' }
        ],
        stableTemp: [
          { required: true, message: '请输入恒温点温度', trigger: 'blur' }
        ],
        downTemp: [
          { required: true, message: '请输入降温点温度', trigger: 'blur' }
        ],
        endTemp: [
          { required: true, message: '请输入终点温度', trigger: 'blur' }
        ]
      },
      chart: null,
      listTime: {
        startTime: '',
        stableTime: '',
        downTime: '',
        endTime: '',
        startTemp: '',
        stableTemp: '',
        downTemp: '',
        endTemp: '',
        deviceNum: []

      },
      options: []
    }
  },
  mounted() {
    this.getDeviceNum()
  },
  methods: {
    getDeviceNum() {
      listTaskDevice().then(resp => {
        this.options = resp.data
        this.listTime.deviceNum.push(resp.data[0].value)
        this.listTime.deviceNum.push(resp.data[0].children[0].value)
        this.initChart()
      })
    },
    initChart() {
      var contain = document.getElementById('mnsjChart')
      this.chart = echarts.init(contain)
    },
    btnControl() {
      this.$refs.listTime.validate(valid => {
        if (valid) {
          controlDevice(this.listTime).then(resp => {
            alert('下发成功')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    btnQuery() {
      this.$refs.listTime.validate(valid => {
        if (valid) {
          this.setOptionData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setOptionData() {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
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
          data: [this.listTime.startTime, this.listTime.stableTime, this.listTime.downTime, this.listTime.endTime]
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
        series: [{
          data: [this.listTime.startTemp, this.listTime.stableTemp, this.listTime.downTemp, this.listTime.endTemp],
          type: 'line'
        }]
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

