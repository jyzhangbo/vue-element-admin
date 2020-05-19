<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" label-width="130px" style="padding-top:10px;">
        <el-row>
          <el-col :span="8">
            <el-form-item label="告警对象" prop="alarmObject">
              <el-input v-model="listQuery.alarmObject" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="告警时间" prop="alarmTime">
              <el-input v-model="listQuery.alarmTime" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
          <el-button type="info" icon="el-icon-magic-stick" @click="resetQuery('listQuery')">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="alarmObject" label="告警对象" width="180" />
      <el-table-column prop="alarmRule" label="告警条件" width="180" />
      <el-table-column prop="alarmTime" label="告警时间" width="180" />
      <el-table-column prop="deviceNum" label="设备编号" width="180" />
      <el-table-column prop="collectId" label="采集点" width="180" />
    </el-table>

    <div style="margin:auto;   width:60%">
      <el-pagination layout="total, prev, pager, next, jumper" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; renderTable();}" />
    </div>

  </div>
</template>

<script>
import { getAlarmList } from '@/api/alarm/index'
export default {
  data() {
    return {
      listQuery: {
        alarmObject: undefined,
        alarmTime: undefined
      },
      tablePage: { total: 0, pageSize: 10, pageNumber: 1 },
      tableData: []
    }
  },
  created() {
    this.btnQuery()
  },
  methods: {
    resetQuery(formName) {
      this.$refs[formName].resetFields()
    },
    btnQuery() {
      getAlarmList(this.listQuery).then(resp => {
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    }
  }
}
</script>
