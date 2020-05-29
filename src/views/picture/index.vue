<template>
  <div class="dashboard-editor-container">
    <div class="panel-group" style="background-color:white">
      <el-upload
        action="http://localhost:8080/file/upload"
        name="upfile"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :file-list="fileList"
        list-type="picture-card"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listImg, removeImg } from '@/api/picture/index'
export default {
  data() {
    return {
      fileList: [
      ],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  created() {
    this.queryImgs()
  },
  methods: {
    queryImgs() {
      listImg().then(resp => {
        this.fileList = resp.data
      })
    },
    handleSuccess(response, file, fileList) {
      this.queryImgs()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      removeImg(file.url).then(resp => {
      })
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.dashboard-editor-container {
  padding: 2px;
  background-color: rgb(240, 242, 245);
  position: relative;
}

.panel-group {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
  padding-bottom: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
}

</style>

