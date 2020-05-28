<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="listQuery" :model="listQuery" label-width="130px" style="padding-top:10px;">
        <el-row>
          <el-col :span="8">
            <el-form-item label="设备编号" prop="deviceNum">
              <el-input v-model="listQuery.deviceNum" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="listQuery.deviceName" />
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
      <el-table-column prop="deviceName" label="设备名称" width="180" />
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
        <el-form-item label="设备名称">
          <el-input v-model="temp.deviceName" />
        </el-form-item>
        <el-form-item label="采集频率">
          <el-input v-model="temp.collectSpace" />
        </el-form-item>
        <el-form-item v-for="item in temp.attributeInfo" :key="item.code" :label="item.code">
          <el-input v-model="item.name" />
        </el-form-item>
        <el-form-item label="设备图片">
          <el-image
            style="width: 100px; height: 100px"
            :src="temp.img"
            :preview-src-list="srcList"
          />
          <el-button style="background-color: #42b983;" type="success" icon="el-icon-search" @click="showPictures()">修改</el-button>
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

    <el-dialog title="选择图片" :visible.sync="dialogPictureVisible">
      <div class="demo-image__lazy">
        <el-image v-for="url in urls" :key="url" :src="url" lazy @click="confirmPicture(url)" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDeviceUser, editDeviceUser } from '@/api/device/index'
export default {
  data() {
    return {
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ],
      srcList: [],
      dialogFormVisible: false,
      dialogPictureVisible: false,
      temp: {
        deviceNum: undefined,
        deviceName: undefined,
        attributeInfo: undefined,
        img: undefined,
        collectSpace: undefined

      },
      listQuery: {
        deviceNum: undefined,
        deviceName: undefined
      },
      tablePage: { total: 0, pageSize: 10, pageNumber: 1 },
      tableData: []
    }
  },
  created() {
    this.btnQuery()
  },
  methods: {
    updateData() {
      editDeviceUser(this.temp).then(resp => {
        this.btnQuery()
        this.dialogFormVisible = false
      })
    },
    confirmPicture(url) {
      this.temp.img = url
      this.srcList = [this.temp.img]
      this.dialogPictureVisible = false
    },
    showPictures() {
      this.dialogPictureVisible = true
    },
    resetQuery(formName) {
      this.$refs[formName].resetFields()
    },
    btnQuery() {
      listDeviceUser(this.listQuery, this.tablePage).then(resp => {
        this.tableData = resp.data.infos
        this.tablePage.total = resp.data.total
      })
    },
    btnEdit(row) {
      this.temp = Object.assign({}, row)
      this.srcList = [this.temp.img]
      this.dialogFormVisible = true
    }
  }
}
</script>
