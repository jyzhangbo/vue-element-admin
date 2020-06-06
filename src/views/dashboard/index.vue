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
                <el-cascader v-model="listTime.deviceNum" :options="options" placeholder="请选择" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
              <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnModify()">修改设备信息</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="panel-group" style="background-color:white;">
      <el-image style="width: 200px; height: 200px" :src="temp.img" />
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

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备编号">
          <el-input v-model="temp.deviceNum" disabled="" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="temp.deviceName" />
        </el-form-item>
        <el-form-item label="采集频率">
          <el-input v-model="temp.collectSpace" />
        </el-form-item>
        <el-form-item v-for="item in temp.attributeInfo" :key="item.code" :label="item.code">
          <el-input v-model="item.name" />
        </el-form-item>
        <el-form-item label="设备图片">
          <el-image
            style="width: 100px; height: 100px"
            :src="temp.img"
            :preview-src-list="srcList"
          />
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="showPictures()">修改</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择图片" :visible.sync="dialogPictureVisible">
      <div class="demo-image__lazy">
        <el-image v-for="url in urls" :key="url" :src="url" lazy @click="confirmPicture(url)" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryData } from '@/api/data/index'
import echarts from 'echarts'
import moment from 'moment'
import { listImg } from '@/api/picture/index'
import { editDeviceUser } from '@/api/device/index'
import { listTaskDevice } from '@/api/base/index'

export default {
  name: 'LineChart',
  data() {
    return {
      options: [],
      cardData: [],
      time: '',
      listTime: {
        startTime: moment().format('yyyy-MM-DD 00:00:00'),
        deviceNum: [],
        endTime: ''
      },
      chart: null,
      srcList: [],
      dialogFormVisible: false,
      dialogPictureVisible: false,
      urls: [],
      temp: {
        deviceNum: undefined,
        deviceName: undefined,
        attributeInfo: undefined,
        img: undefined,
        collectSpace: undefined,
        taskNum: undefined

      },
      taskState: 1
    }
  },
  mounted() {
    this.getDeviceNum()
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
    getDeviceNum() {
      listTaskDevice(this.taskState).then(resp => {
        this.options = resp.data
        this.listTime.deviceNum.push(resp.data[0].value)
        this.listTime.deviceNum.push(resp.data[0].children[0].value)
        this.initChart()
      })
    },
    updateData() {
      editDeviceUser(this.temp).then(resp => {
        this.btnQuery()
        this.dialogFormVisible = false
      })
    },
    showPictures() {
      this.dialogPictureVisible = true
      this.urls = []
      listImg().then(resp => {
        for (var i = 0; i < resp.data.length; i++) {
          this.urls.push(resp.data[i].url)
        }
      })
    },
    confirmPicture(url) {
      this.temp.img = url
      this.srcList = [this.temp.img]
      this.dialogPictureVisible = false
    },
    btnModify() {
      this.dialogFormVisible = true
    },
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
        this.temp.deviceNum = this.listTime.deviceNum[1]
        this.temp.taskNum = this.listTime.deviceNum[0]
        this.temp.deviceName = resp.data.deviceName
        this.temp.attributeInfo = resp.data.attributeInfo
        this.temp.collectSpace = resp.data.collectSpace
        this.temp.img = resp.data.deviceImg
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

