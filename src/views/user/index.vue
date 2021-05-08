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
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="listQuery.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录名" prop="loginName">
              <el-input v-model="listQuery.loginName" />
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
      <el-table-column prop="companyName" label="厂家名称" width="180" />
      <el-table-column prop="phone" label="联系电话" width="180" />
      <el-table-column prop="loginName" label="登录名" width="180" />
      <el-table-column prop="password" label="密码" width="180" />
      <el-table-column prop="userRole" label="角色" width="180">
        <template slot-scope="scope">
          {{ scope.row.userRole|userRoleFunc }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="btnEdit(row)">
            修改
          </el-button>
          <el-button type="primary" size="mini" :disabled="row.loginName === 'admin'?true:false" @click="btnDel(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:auto;   width:60%">
      <el-pagination layout="total, prev, pager, next, jumper" :page-size="tablePage.pageSize" :total="tablePage.total" @current-change="function(val){tablePage.pageNumber = val; btnQuery();}" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" :rules="rules" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="temp.loginName" :disabled="adminCheckBox" />
        </el-form-item>
        <el-form-item label="厂家名称" prop="companyName">
          <el-input v-model="temp.companyName" :disabled="adminCheckBox" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="temp.admin" :disabled="adminCheckBox">是否管理员</el-checkbox>
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
import { listUser, deleteUser, addUser, editUser } from '@/api/user/index'
import CompanyNameSelect from '@/components/biz/CompanyNameSelect'

export default {
  components: { CompanyNameSelect },
  filters: {
    userRoleFunc(val) {
      if (val === 'admin') {
        return '超级管理员'
      } else if (val === 'userAdmin') {
        return '普通管理员'
      } else {
        return '用户'
      }
    }
  },
  data() {
    return {
      rules: {
        loginName: [
          { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入厂家名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      adminCheckBox: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        edit: '修改',
        create: '创建'
      },
      temp: {
        companyName: undefined,
        phone: undefined,
        loginName: undefined,
        password: undefined,
        admin: false
      },
      listQuery: {
        companyName: undefined,
        phone: undefined,
        loginName: undefined
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
      listUser(this.listQuery, this.tablePage).then(resp => {
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    },
    btnDel(row) {
      deleteUser(row.loginName, row.companyName).then(resp => {
        this.btnQuery()
      })
    },
    createData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          addUser(this.temp).then(resp => {
            this.btnQuery()
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updateData() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          editUser(this.temp).then(resp => {
            this.btnQuery()
            this.dialogFormVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    btnEdit(row) {
      this.temp = Object.assign({}, row)
      if (row.userRole === 'user') {
        this.temp.admin = false
      } else {
        this.temp.admin = true
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'edit'
      this.adminCheckBox = true
    },
    btnCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.adminCheckBox = false
    },
    resetTemp() {
      this.temp = {
        companyName: undefined,
        phone: undefined,
        loginName: undefined,
        password: undefined,
        admin: false
      }
    }
  }
}
</script>
