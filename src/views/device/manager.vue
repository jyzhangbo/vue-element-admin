<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" label-width="130px" style="padding-top:10px;">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="devicNum">
              <el-input v-model="listQuery.devicNum" />
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
      <el-table-column prop="deviceNum" label="设备编号" width="180" />
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

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="设备编号">
          <el-input v-model="temp.deviceNum" disabled="" />
        </el-form-item>
        <el-form-item v-for="item in temp.devicePin" :key="item.name" label="引脚名">
          <el-input v-model="item.name" placeholder="引脚名称" clearable />
          <el-checkbox v-model="item.used">是否使用</el-checkbox>
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
import { getDeviceList } from '@/api/device/index'
export default {
  data() {
    return {
      dialogFormVisible: false,
      temp: {
        deviceNum: undefined,
        devicePin: [
          {
            name: 'aaa'
          },
          {
            name: 'bbb'
          }
        ]

      },
      listQuery: {
        deviceNum: undefined
      },
      tablePage: { total: 0, pageSize: 10, pageNumber: 1 },
      tableData: [],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }]
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
      getDeviceList(this.listQuery).then(resp => {
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    },
    btnEdit(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.temp = {
        deviceNum: undefined,
        devicePin: []
      }
    }
  }
}
</script>
