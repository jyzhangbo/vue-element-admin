<template>
  <div class="app-container">
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

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
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
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          确认
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
      temp: {
        id: undefined,
        alarmRuleObject: undefined,
        alarmRuleName: undefined,
        judgeType: undefined,
        judgeValue: undefined,
        judgeUnit: undefined,
        isEnable: undefined
      },
      tableData: []
    }
  },
  created() {
    this.btnQuery()
  },
  methods: {
    btnQuery() {
      getAlarmRuleList().then(resp => {
        this.tableData = resp.data.infos
      })
    },
    btnEdit(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    btnEnable(row) {
      const enableStr = row.isEnable === 1 ? '禁用' : '启用'
      this.$confirm('此操作将' + enableStr + '该告警规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        enableAlarmRule(row).then(resp => {
          this.btnQuery()
        })
      })
    },
    updateData() {
      updateAlarmRule(this.temp).then(resp => {
        this.btnQuery()
        this.dialogFormVisible = false
      })
    }
  }
}
</script>
