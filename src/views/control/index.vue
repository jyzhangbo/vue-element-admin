<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <el-row :gutter="20">
        <el-col :span="12">
          设备编号：
          <el-cascader v-model="deviceNum" :options="options" style="width: 300px" placeholder="请选择" filterable clearable @change="handleChange" />
        </el-col>
      </el-row>
    </div>
    <div class="panel-group" style="background-color:white">
      <el-form ref="listTime" :model="listTime" label-width="130px">
        <el-tabs v-model="active" @tab-click="handleClick">
          <el-tab-pane label="温度模式选择" name="0">
            <el-card>
              <div style="text-align:center">
                <el-button style="background-color: #42b983;" type="success" @click="btnControl(1)">控制下发</el-button>
              </div>
            </el-card>
            <el-card class="box-card">
              <div style="text-align:center">
                <el-form-item>
                  <el-radio-group v-model="listTime.modelType">
                    <el-radio label="00">采集器模式</el-radio>
                    <el-radio label="01">阀门控制器模式</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="阀门控制" name="1">
            <el-card>
              <div style="text-align:center">
                <el-button style="background-color: #42b983;" type="success" @click="btnControl(2)">控制下发</el-button>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>阀门1</span>
              </div>
              <div>
                <el-radio-group v-model="listTime.tapControl1">
                  <div class="box-card">
                    <el-tag>手动模式</el-tag>
                    <el-radio label="00">开启</el-radio>
                  </div>
                  <div class="box-card">
                    <el-tag>自动模式</el-tag>
                    <el-radio label="01">启动（或重新启动），等待温度到达</el-radio>
                    <el-radio label="02">等恒温状态时间到达</el-radio>
                    <el-radio label="03">升温过程，等待升温时间到</el-radio>
                    <el-radio label="04">高温恒定状态，等待恒温时间到</el-radio>
                    <el-radio label="05">降温过程，等待降温时间到</el-radio>
                    <el-radio label="06">等待降温温度到</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>阀门2</span>
              </div>
              <div>
                <el-radio-group v-model="listTime.tapControl2">
                  <div class="box-card">
                    <el-tag>手动模式</el-tag>
                    <el-radio label="00">开启</el-radio>
                  </div>
                  <div class="box-card">
                    <el-tag>自动模式</el-tag>
                    <el-radio label="01">启动（或重新启动），等待温度到达</el-radio>
                    <el-radio label="02">等恒温状态时间到达</el-radio>
                    <el-radio label="03">升温过程，等待升温时间到</el-radio>
                    <el-radio label="04">高温恒定状态，等待恒温时间到</el-radio>
                    <el-radio label="05">降温过程，等待降温时间到</el-radio>
                    <el-radio label="06">等待降温温度到</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="自动控制参数设置" name="2">
            <el-card>
              <div style="text-align:center">
                <el-button style="background-color: #42b983;" type="success" @click="btnControl(3)">控制下发</el-button>
              </div>
            </el-card>
            <el-card class="box-card">
              <el-form-item label="阀门1:">
                <el-checkbox-group v-model="listTime.probeType1">
                  <el-checkbox label="1">T1</el-checkbox>
                  <el-checkbox label="2">T2</el-checkbox>
                  <el-checkbox label="4">T3</el-checkbox>
                  <el-checkbox label="8">T4</el-checkbox>
                  <el-checkbox label="16">T5</el-checkbox>
                  <el-checkbox label="32">T6</el-checkbox>
                  <el-checkbox label="64">T7</el-checkbox>
                  <el-checkbox label="128">T8</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="阀门2:">
                <el-checkbox-group v-model="listTime.probeType2">
                  <el-checkbox label="1">T1</el-checkbox>
                  <el-checkbox label="2">T2</el-checkbox>
                  <el-checkbox label="4">T3</el-checkbox>
                  <el-checkbox label="8">T4</el-checkbox>
                  <el-checkbox label="16">T5</el-checkbox>
                  <el-checkbox label="32">T6</el-checkbox>
                  <el-checkbox label="64">T7</el-checkbox>
                  <el-checkbox label="128">T8</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-card>
            <el-card class="box-card">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="静停温度(℃):" prop="startTemp">
                    <el-input v-model="listTime.tempControl.startTemp" placeholder="静停温度" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="静停时长(h):" prop="startTime">
                    <el-input v-model="listTime.tempControl.startTime" placeholder="静停时长" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="升温速度(℃/h):" prop="upSpeed">
                    <el-input v-model="listTime.tempControl.upSpeed" placeholder="升温速度" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="恒温温度(℃):" prop="constantTemp">
                    <el-input v-model="listTime.tempControl.constantTemp" placeholder="恒温温度" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="恒温时长(h):" prop="constantTime">
                    <el-input v-model="listTime.tempControl.constantTime" placeholder="恒温时长" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="降温速度(℃/h):" prop="downSpeed">
                    <el-input v-model="listTime.tempControl.downSpeed" placeholder="降温速度" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="结束温度(℃):" prop="endTemp">
                    <el-input v-model="listTime.tempControl.endTemp" placeholder="结束温度" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-button style="background-color: #42b983;" type="success" @click="btnQuery()">查看数据图像</el-button>
                </el-col>
              </el-row>
              <div class="panel-group" style="background-color:white">
                <div id="chartDiv" class="chart-container">
                  <div id="mnsjChart" style="width:100%;height:200px;" />
                </div>
              </div>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="手动控制" name="3">
            <el-card>
              <div style="text-align:center">
                <el-button style="background-color: #42b983;" type="success" @click="btnControl(4)">控制下发</el-button>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>阀门1</span>
              </div>
              <div>
                <el-radio-group v-model="listTime.manualControl1">
                  <div class="box-card">
                    <el-radio label="00">停止</el-radio>
                    <el-radio label="01">开阀门</el-radio>
                    <el-radio label="02">关阀门</el-radio>
                    <el-radio label="03">状态不变</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>阀门2</span>
              </div>
              <div>
                <el-radio-group v-model="listTime.manualControl2">
                  <div class="box-card">
                    <el-radio label="00">停止</el-radio>
                    <el-radio label="01">开阀门</el-radio>
                    <el-radio label="02">关阀门</el-radio>
                    <el-radio label="03">状态不变</el-radio>
                  </div>
                </el-radio-group>
              </div>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { listTaskDevice } from '@/api/base/index'
import { controlDevice, getDeviceControlInfo } from '@/api/control/index'

export default {
  data() {
    return {
      active: '0',
      chart: null,
      deviceNum: [],
      listTime: {
        modelType: '',
        tapControl1: '',
        tapControl2: '',
        manualControl1: '',
        manualControl2: '',
        probeType1: [],
        probeType2: [],
        tempControl: {
          startTemp: '',
          startTime: '',
          upSpeed: '',
          constantTemp: '',
          constantTime: '',
          downSpeed: '',
          endTemp: ''
        }

      },
      options: [],
      taskState: 1
    }
  },
  mounted() {
    this.getDeviceNum()
  },
  methods: {
    getDeviceNum() {
      listTaskDevice(this.taskState).then(resp => {
        this.options = resp.data
        this.deviceNum.push(resp.data[0].value)
        this.deviceNum.push(resp.data[0].children[0].value)
        this.controlInfo(resp.data[0].children[0].value)
      })
    },
    handleChange(value) {
      this.controlInfo(this.deviceNum[1])
    },
    controlInfo(deviceNum) {
      getDeviceControlInfo(deviceNum).then(resp => {
        this.listTime = resp.data
        this.btnQuery()
      })
    },
    btnControl(type) {
      controlDevice(this.listTime, this.deviceNum[1], type).then(resp => {
        this.$message({
          message: '控制成功',
          type: 'success',
          showClose: true
        })
      })
    },
    handleClick(tab, event) {
    },
    btnQuery() {
      var temp = this.listTime.tempControl
      var xData = [0, temp.startTime]
      var upTime = Number((temp.constantTemp - temp.startTemp) / temp.upSpeed) + Number(temp.startTime)
      xData.push(upTime)
      var constant = upTime + Number(temp.constantTime)
      xData.push(constant)
      var down = Number((temp.constantTemp - temp.endTemp) / temp.downSpeed) + Number(constant)
      xData.push(down)

      var yData = [temp.startTemp, temp.startTemp, temp.constantTemp, temp.constantTemp, temp.endTemp]
      this.initChart(xData, yData)
    },
    initChart(xData, yData) {
      var contain = document.getElementById('mnsjChart')
      contain.style.width = window.innerWidth - 300 + 'px'
      contain.style.height = '200px'
      this.chart = echarts.init(contain)
      this.setOptionData(xData, yData)
    },
    setOptionData(xData, yData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
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
        grid: {
          top: 10,
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

.box-card {
    margin-top: 5px;
  }

</style>

