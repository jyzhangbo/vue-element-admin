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
              <el-select v-model="listQuery.state" placeholder="请选择">
                <el-option label="请选择" value="" />
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
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
      <el-table-column prop="alarmRule" label="告警规则" width="180">
        <template slot-scope="scope">
          {{ scope.row.alarmRuleName }}{{ scope.row.judgeType }}{{ scope.row.judgeValue }}{{ scope.row.judgeUnit }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          {{ scope.row.isEnable === 1? "启用":"禁用" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button :disabled="row.isEnable === 1" type="primary" size="mini" @click="btnEnable(row)">
            启用
          </el-button>
          <el-button :disabled="row.isEnable === 0" type="primary" size="mini" @click="btnEnable(row)">
            禁用
          </el-button>
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
        <el-form-item label="告警对象:" prop="alarmRuleObject">
          <el-input v-model="temp.alarmRuleObject" :disabled="true" />
        </el-form-item>
        <el-form-item label="告警规则:" prop="alarmRuleName">
          {{ temp.alarmRuleName }}{{ temp.judgeType }}<el-input-number v-model="temp.judgeValue" />{{ temp.judgeUnit }}
        </el-form-item>
        <el-form-item label="状态:" prop="state">
          <el-input :value="temp.isEnable === 1? '启用':'禁用'" :disabled="true" />
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
import { getAlarmRuleList, enableAlarmRule, updateAlarmRule } from '@/api/alarm/index'
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
        id: undefined,
        alarmRuleObject: undefined,
        alarmRuleName: undefined,
        judgeType: undefined,
        judgeValue: undefined,
        judgeUnit: undefined,
        isEnable: undefined
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
        console.log(resp)
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    },
    btnEdit(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.dialogStatus = 'edit'
    },
    btnEnable(row) {
      const tempRow = Object.assign({}, row)
      const enableStr = tempRow.isEnable === 1 ? '禁用' : '启用'
      this.$confirm('此操作将' + enableStr + '该告警规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        enableAlarmRule(tempRow).then(resp => {
          if (resp.code === 200) {
            this.btnQuery()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    btnCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
    },
    updateData() {
      updateAlarmRule(this.temp).then(resp => {
        this.btnQuery()
        this.dialogFormVisible = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        alarmRuleObject: undefined,
        alarmRuleName: undefined,
        judgeType: undefined,
        judgeValue: undefined,
        judgeUnit: undefined,
        isEnable: undefined
      }
    }
  }
}
</script>
