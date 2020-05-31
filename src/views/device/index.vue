<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" label-width="130px" style="padding-top:10px;">
        <el-row>
          <el-col :span="8">
            <el-form-item label="厂家名称" prop="companyName">
              <company-name-select v-model="listQuery.companyName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="devicNum">
              <el-input v-model="listQuery.devicNum" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end">
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="btnQuery()">查询</el-button>
          <el-button type="info" icon="el-icon-magic-stick" @click="resetQuery('listQuery')">重置</el-button>
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-edit" @click="btnCreate()">新增</el-button>
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-edit" @click="btnCreate()">导入</el-button>
        </el-row>
      </el-form>
    </div>

    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="deviceNum" label="设备编号" width="180" />
      <el-table-column prop="companyName" label="厂家名称" width="180" />
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="btnEdit(row)">
            修改
          </el-button>
          <el-button type="primary" size="mini" @click="btnDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:auto;   width:60%">
      <el-pagination layout="total, prev, pager, next, jumper" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; renderTable();}" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备编号" prop="deviceNum">
          <el-input v-model="temp.deviceNum" :disabled="dialogStatus==='create'?false:true" />
        </el-form-item>
        <el-form-item label="厂家名称" prop="companyName">
          <company-name-select v-model="temp.companyName" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDeviceAdmin, addDevice, deleteDevice, editDeviceAdmin } from '@/api/device/index'
import CompanyNameSelect from '@/components/biz/CompanyNameSelect'

export default {
  components: { CompanyNameSelect },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '修改',
        create: '新增'
      },
      temp: {
        companyName: undefined,
        deviceNum: undefined
      },
      listQuery: {
        companyName: undefined,
        deviceNum: undefined
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
      listDeviceAdmin(this.listQuery, this.tablePage).then(resp => {
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    },
    btnDel(row) {
      deleteDevice(row.deviceNum).then(resp => {
        this.btnQuery()
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
        companyName: undefined,
        deviceNum: undefined
      }
    },
    createData() {
      addDevice(this.temp).then(resp => {
        this.btnQuery()
        this.dialogFormVisible = false
      })
    },
    updateData() {
      editDeviceAdmin(this.temp).then(resp => {
        this.btnQuery()
        this.dialogFormVisible = false
      })
    }
  }
}
</script>
