<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <div>
        <el-form label-width="130px" style="padding-top:10px;">
          <el-row>
            <el-col :span="6">
              <el-form-item label="起点:" prop="alarmObject">
                <el-date-picker v-model="startTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="恒温点:" prop="alarmTime">
                <el-date-picker v-model="stableTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="降温点:" prop="alarmTime">
                <el-date-picker v-model="downTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终点:" prop="alarmTime">
                <el-date-picker v-model="endTime" type="datetime" placeholder="选择日期时间" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="panel-group" style="background-color:white">
      <div class="chart-container">
        <value-chart :chart-data="chartDatas" />
      </div>
      <div>
        <el-form label-width="60px" style="padding-top:10px;">
          <el-row :gutter="5">
            <el-col v-for="n in 8" :key="n" :span="3">
              <el-card class="box-card" style="border-radius: 20px">
                <p>{{ n }}</p>
                <el-form-item label="起点" prop="startTemp">
                  <el-input v-model="startTemp" />
                </el-form-item>
                <el-form-item label="恒温点" prop="stableTemp">
                  <el-input v-model="stableTemp" />
                </el-form-item>
                <el-form-item label="降温点" prop="downTemp">
                  <el-input v-model="downTemp" />
                </el-form-item>
                <el-form-item label="终点" prop="endTemp">
                  <el-input v-model="endTemp" />
                </el-form-item>
              </el-card>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import ValueChart from './components/ValueChart'

export default {
  name: 'LineChart',
  components: { ValueChart },
  data() {
    return {
      startTime: '',
      stableTime: '',
      downTime: '',
      endTime: '',
      chartDatas: {},
      startTemp: ''
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
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  padding-bottom: 30px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
}

</style>

