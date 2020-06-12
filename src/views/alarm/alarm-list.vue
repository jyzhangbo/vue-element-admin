<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" label-width="130px" style="padding-top:10px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="告警时间:" prop="alarmTime">
              <el-date-picker v-model="listQuery.alarmTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警对象:" prop="alarmObject">
              <el-select v-model="listQuery.alarmObject" placeholder="请选择">
                <el-option label="请选择" value="" />
                <el-option label="温度上限" value="温度上限" />
                <el-option label="温度下限" value="温度下限" />
              </el-select>
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
      <el-table-column prop="alarmRuleObject" label="告警对象" width="180" />
      <el-table-column prop="alarmRuleCondition" label="告警条件" width="180" />
      <el-table-column prop="createTime" label="告警时间" width="180" />
      <el-table-column prop="deviceNum" label="设备编号" width="180" />
      <el-table-column prop="collectionPoint" label="采集点" />
    </el-table>

    <div style="margin:auto;   width:60%">
      <el-pagination layout="total, prev, pager, next, jumper" :current-page="tablePage.pageNumber" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; btnQuery();}" />
    </div>

  </div>
</template>

<script>
import { getAlarmLogList } from '@/api/alarm/index'
export default {
  data() {
    return {
      listQuery: {
        alarmObject: undefined,
        alarmTime: ['', '']
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
      getAlarmLogList(this.listQuery, this.tablePage).then(resp => {
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    }
  }
}
</script>
