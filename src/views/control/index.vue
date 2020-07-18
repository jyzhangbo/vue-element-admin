<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <el-row :gutter="20">
        <el-col :span="12">
          设备编号：
          <el-cascader v-model="deviceNum" :options="options" style="width: 300px" placeholder="请选择" filterable clearable @change="handleChange" />
        </el-col>
        <el-col :span="12">
          <el-button style="background-color: #42b983;" type="success" @click="btnControl()">控制下发</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="panel-group" style="background-color:white">
      <el-form ref="listTime" :model="listTime" label-width="auto">
        <el-tabs v-model="active" @tab-click="handleClick">
          <el-tab-pane label="温度模式选择" name="0">
            <div style="text-align:center">
              <el-form-item>
                <el-radio-group v-model="listTime.modelType">
                  <el-radio label="00">采集器模式</el-radio>
                  <el-radio label="01">阀门控制器模式</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="阀门控制" name="1">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="阀门1:">
                  <el-radio-group v-model="listTime.tapControl1">
                    <el-radio label="00">关闭</el-radio>
                    <el-radio label="01">启动（或重新启动），等待温度到达</el-radio>
                    <el-radio label="02">等恒温状态时间到达</el-radio>
                    <el-radio label="03">升温过程，等待升温时间到</el-radio>
                    <el-radio label="04">高温恒定状态，等待恒温时间到</el-radio>
                    <el-radio label="05">降温过程，等待降温时间到</el-radio>
                    <el-radio label="06">等待降温温度到</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="阀门2:">
                  <el-radio-group v-model="listTime.tapControl2">
                    <el-radio label="00">关闭</el-radio>
                    <el-radio label="01">启动（或重新启动），等待温度到达</el-radio>
                    <el-radio label="02">等恒温状态时间到达</el-radio>
                    <el-radio label="03">升温过程，等待升温时间到</el-radio>
                    <el-radio label="04">高温恒定状态，等待恒温时间到</el-radio>
                    <el-radio label="05">降温过程，等待降温时间到</el-radio>
                    <el-radio label="06">等待降温温度到</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="选择探头" name="2">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="阀门1:">
                  <el-checkbox-group v-model="listTime.probeType1">
                    <el-checkbox label="1">T0</el-checkbox>
                    <el-checkbox label="2">T1</el-checkbox>
                    <el-checkbox label="4">T2</el-checkbox>
                    <el-checkbox label="8">T3</el-checkbox>
                    <el-checkbox label="16">T4</el-checkbox>
                    <el-checkbox label="32">T5</el-checkbox>
                    <el-checkbox label="64">T6</el-checkbox>
                    <el-checkbox label="128">T7</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="阀门2:">
                  <el-checkbox-group v-model="listTime.probeType2">
                    <el-checkbox label="1">T0</el-checkbox>
                    <el-checkbox label="2">T1</el-checkbox>
                    <el-checkbox label="4">T2</el-checkbox>
                    <el-checkbox label="8">T3</el-checkbox>
                    <el-checkbox label="16">T4</el-checkbox>
                    <el-checkbox label="32">T5</el-checkbox>
                    <el-checkbox label="64">T6</el-checkbox>
                    <el-checkbox label="128">T7</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="设置温度" name="3">
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
              <el-col :span="12">
                <el-button style="background-color: #42b983;" type="success" @click="btnQuery()">查看数据图像</el-button>
              </el-col>
            </el-row>
            <div class="panel-group" style="background-color:white">
              <div id="chartDiv" class="chart-container">
                <div id="mnsjChart" style="width:100%;height:200px;" />
              </div>
            </div>
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
    btnControl() {
      controlDevice(this.listTime, this.deviceNum[1]).then(resp => {
        alert('控制成功')
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

</style>

