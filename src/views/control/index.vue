<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <el-form ref="listTime" :model="listTime" :rules="rules" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="静停温度(℃):" prop="startTemp">
              <el-input v-model="listTime.startTemp" placeholder="静停温度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="静停时长(h):" prop="startTime">
              <el-input v-model="listTime.startTime" placeholder="静停时长" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="升温速度(℃/h):" prop="upSpeed">
              <el-input v-model="listTime.upSpeed" placeholder="升温速度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="恒温温度(℃):" prop="constantTemp">
              <el-input v-model="listTime.constantTemp" placeholder="恒温温度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="恒温时长(h):" prop="constantTime">
              <el-input v-model="listTime.constantTime" placeholder="恒温时长" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="降温速度(℃/h):" prop="downSpeed">
              <el-input v-model="listTime.downSpeed" placeholder="降温速度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束温度(℃):" prop="endTemp">
              <el-input v-model="listTime.endTemp" placeholder="结束温度" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备编号:" prop="deviceNum">
              <el-cascader v-model="listTime.deviceNum" :options="options" style="width: 300px" placeholder="请选择" filterable clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button style="background-color: #42b983;" type="success" @click="btnQuery()">查看数据图像</el-button>
            <el-button style="background-color: #42b983;" type="success" @click="btnControl()">设置温度控制阀门参数</el-button>
            <el-button style="background-color: #42b983;" type="success" @click="btnControl()">温度模式选择</el-button>
            <el-button style="background-color: #42b983;" type="success" @click="btnControl()">开启或关闭阀门控制</el-button>
            <el-button style="background-color: #42b983;" type="success" @click="btnControl()">阀门控制选择探头</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="panel-group" style="background-color:white">
      <div id="chartDiv" class="chart-container">
        <div id="mnsjChart" style="width:100%;height:400px;" />
      </div>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备编号" prop="deviceNum">
          <el-input v-model="temp.deviceNum" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="厂家名称" prop="companyName">
          <company-name-select v-model="temp.companyName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import { listTaskDevice } from '@/api/base/index'
import { controlDevice } from '@/api/control/index'

export default {
  data() {
    var validateDouble = (rule, value, callback) => {
      var pattern = /^\d+\.?\d{0,1}$/
      if (value === '') {
        return callback(new Error('请输入参数'))
      } else if (!pattern.test(value)) {
        return callback(new Error('小数点后最多只能输入一位'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        startTemp: [
          { required: true, trigger: 'blur', validator: validateDouble }
        ],
        startTime: [
          { required: true, trigger: 'blur', validator: validateDouble }
        ],
        upSpeed: [
          { required: true, trigger: 'blur', validator: validateDouble }
        ],
        constantTemp: [
          { required: true, validator: validateDouble, trigger: 'blur' }
        ],
        constantTime: [
          { required: true, validator: validateDouble, trigger: 'blur' }
        ],
        downSpeed: [
          { required: true, validator: validateDouble, trigger: 'blur' }
        ],
        endTemp: [
          { required: true, validator: validateDouble, trigger: 'blur' }
        ],
        deviceNum: [
          { type: 'array', required: true, message: '请输入设备编号', trigger: 'change' }
        ]
      },
      chart: null,
      listTime: {
        startTemp: '',
        startTime: '',
        upSpeed: '',
        constantTemp: '',
        constantTime: '',
        downSpeed: '',
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
          var xData = [0, this.listTime.startTime]
          var upTime = Number((this.listTime.constantTemp - this.listTime.startTemp) / this.listTime.upSpeed) + Number(this.listTime.startTime)
          xData.push(upTime)
          var constant = upTime + Number(this.listTime.constantTime)
          xData.push(constant)
          var down = Number((this.listTime.constantTemp - this.listTime.endTemp) / this.listTime.downSpeed) + Number(constant)
          xData.push(down)

          var yData = [this.listTime.startTemp, this.listTime.startTemp, this.listTime.constantTemp, this.listTime.constantTemp, this.listTime.endTemp]

          this.setOptionData(xData, yData)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setOptionData(xData, yData) {
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
          data: xData
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
          data: yData,
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

