<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" label-width="130px" style="padding-top:10px;">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称" prop="taskName">
              <el-input v-model="listQuery.taskName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="编号" prop="taskNum">
              <el-input v-model="listQuery.taskNum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
          <el-button type="info" icon="el-icon-magic-stick" @click="resetQuery('listQuery')">重置</el-button>
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-edit" @click="btnCreate()">新增</el-button>
        </el-row>
      </el-form>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="taskName" label="名称" width="180" />
      <el-table-column prop="taskNum" label="编号" width="180" />
      <el-table-column prop="state" label="状态" width="90" />
      <el-table-column prop="deviceNums" label="设备列表" width="180">
        <template slot-scope="scope">
          {{ scope.row.deviceNums|splitDevice }}
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="btnEdit(row)">
            修改
          </el-button>
          <el-button type="primary" size="mini" @click="btnDel(row)">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="btnDel(row)">
            开启
          </el-button>
          <el-button type="primary" size="mini" @click="btnDel(row)">
            结束
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:auto;   width:60%">
      <el-pagination layout="total, prev, pager, next, jumper" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; renderTable();}" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="taskName">
          <el-input v-model="temp.taskName" />
        </el-form-item>
        <el-form-item label="编号" prop="taskNum">
          <el-input v-model="temp.taskNum" />
        </el-form-item>
        <el-form-item label="设备列表" prop="devices">
          <el-checkbox-group v-model="temp.devices">
            <el-row>
              <el-col v-for="item in deviceList" :key="item" :span="12">
                <el-checkbox :label="item" />
              </el-col>
            </el-row>
          </el-checkbox-group>
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
import { getTaskList, getTaskDeviceList } from '@/api/task/index'
export default {
  filters: {
    splitDevice(val) {
      return val.join(';')
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: 'Edit',
        create: 'Create'
      },
      temp: {
        taskName: undefined,
        taskNum: undefined,
        deviceNums: []
      },
      listQuery: {
        taskName: undefined,
        taskNum: undefined
      },
      tablePage: { total: 0, pageSize: 10, pageNumber: 1 },
      tableData: [],
      deviceList: []
    }
  },
  created() {
    this.btnQuery()
    this.queryDeviceList()
  },
  methods: {
    queryDeviceList() {
      getTaskDeviceList().then(resp => {
        this.deviceList = resp.data
      })
    },
    resetQuery(formName) {
      this.$refs[formName].resetFields()
    },
    btnQuery() {
      getTaskList(this.listQuery, this.tablePage).then(resp => {
        this.tableData = resp.data.tasks
        for (var i = 0; i < this.tableData.devices.length(); i++) {
          this.tableData.deviceNums.push(this.tableData.devices[i])
        }
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
        taskName: undefined,
        taskNum: undefined,
        deviceNums: []
      }
    }
  }
}
</script>
