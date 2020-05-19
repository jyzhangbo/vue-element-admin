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
            <el-form-item label="告警状态" prop="state">
              <el-input v-model="listQuery.state" />
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
      <el-table-column prop="alarmRule" label="告警规则" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="state" label="状态" width="180" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="btnEdit(row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:auto;   width:60%">
      <el-pagination layout="total, prev, pager, next, jumper" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; renderTable();}" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="告警对象" prop="alarmObject">
          <el-input v-model="temp.alarmObject" />
        </el-form-item>
        <el-form-item label="告警规则" prop="alarmRule">
          <el-input v-model="temp.alarmRule" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model="temp.state" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAlarmRuleList } from '@/api/alarm/index'
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: 'Edit',
        create: 'Create'
      },
      temp: {
        alarmObject: undefined,
        alarmRule: undefined,
        state: undefined
      },
      listQuery: {
        alarmObject: undefined,
        state: undefined
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
      getAlarmRuleList(this.listQuery).then(resp => {
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    },
    btnEdit(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.dialogStatus = 'edit'
    },
    btnCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    resetTemp() {
      this.temp = {
        alarmObject: undefined,
        alarmRule: undefined,
        state: undefined
      }
    }
  }
}
</script>
