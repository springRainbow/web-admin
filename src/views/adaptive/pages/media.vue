<template>
  <div class="media">
    <view-header title="Media Management"></view-header>
    <div class="main">
      <div class="g-clearfix" style="margin-bottom:16px;">
        <el-button type="primary" size="small" class="fl" @click="triggerFileInput">
          <i class="el-icon-upload" style="font-size:14px;"></i> Upload new media
        </el-button>
        <input
          type="file"
          name="file"
          style="display: none;"
          multiple
          ref="file"
          :disabled="fileList.length == fileOptions.maxLength"
          @change="handleFileChange"
        />

        <el-input
          v-model="searchName"
          placeholder="searchName"
          size="small"
          class="fr"
          style="width:160px;"
          @change="handleSearch"
        >
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
      </div>
      <el-table :data="mediaList" :header-cell-style="rowClass" v-loading="loading">
        <el-table-column label="Name" width="140">
          <template slot-scope="scope">
            <div>{{ scope.row.attachments.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Preview" width="340">
          <template slot-scope="scope">
            <audio controls v-if="scope.row.attachments.file_type == 'mp3' || scope.row.attachments.file_type == 'wav' || scope.row.attachments.file_type == 'wma'" :src="scope.row.attachments.url"></audio>
            <img style="width: 250px; height:250px;" v-if="scope.row.attachments.file_type == 'jpg' || scope.row.attachments.file_type == 'jpeg' || scope.row.attachments.file_type == 'png' || scope.row.attachments.file_type == 'gif'" :src="scope.row.attachments.url" alt="">
            <video style="width: 250px;" controls v-if="scope.row.attachments.file_type == 'flv' || scope.row.attachments.file_type == 'mp4' || scope.row.attachments.file_type == 'avi'" :src="scope.row.attachments.url"></video>
          </template>
        </el-table-column>
        <el-table-column label="URL">
          <template slot-scope="scope">
            <div @click="doCopy(scope)" @mouseleave="leave(scope)" class="copyurl">
              <span>{{ scope.row.attachments.url }}</span>
              <i
                class="copytip copytext"
                v-if="copyStatus == 2"
              >Copy URL</i>
              <i
                class="el-icon-check copytip success"
                v-if="copyStatus == 1 && copyIndex == scope.$index"
              >Copied</i>
              <i
                class="el-icon-close copytip failed"
                v-if="copyStatus == 0 && copyIndex == scope.$index"
              >Failed</i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Upload time" prop="update_time" width="200"></el-table-column>
        <el-table-column label="Operator" prop="handler_name" width="100"></el-table-column>
        <el-table-column label="Action" width="80" align="center">
          <template slot-scope="scope">
            <i class="el-icon-delete del-file" @click="delListFile(scope)"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin:20px 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curPage"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="limit"
        layout="prev, pager, next,sizes,total"
        :total="total"
      ></el-pagination>
      <el-dialog
        :title="`Upload new media （${fileList.length}/10）`"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <oss-upload
          :options="fileOptions"
          @uploadSuccess="uploadSuccess"
          @uploadFailed="uploadFailed"
          @uploadError="uploadError"
          ref="filesEle"
        >
          <template slot-scope="props">
            <div class="fl"></div>
            <div v-for="(file, key) in props.files" :key="key" class="file-info">
              <p class="file-name">
                {{ file.name }}
                <i
                  class="el-icon-delete fr icon-delete"
                  @click="deleteUpload(key,file.file_key || file.returnData.file)"
                ></i>
              </p>
              <el-progress :percentage="file.uploadPercent" status="success"></el-progress>
            </div>
          </template>
        </oss-upload>
        <span slot="footer" class="dialog-footer g-clearfix">
          <el-button class="fl" @click="triggerFileInput" size="mini" :disabled="fileList.length == fileOptions.maxLength">Choose File</el-button>
          <el-button type="primary" @click="submitUpload" :disabled="fileList.length == 0" size="small">Submit</el-button>
          <el-button @click="dialogVisible = false" size="small">Cancel</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import api from "@/api";
import md5 from "crypto-js/md5";
export default {
  name: "mediaUpload",
  data() {
    return {
      mediaList: [],
      searchName: "",
      curPage: 1,
      limit: 10,
      total: 0,
      loading: true,
      dialogVisible: false,
      fileList: [],
      fileOptions: {
        parameters: {
          authkey: this.$cookie.get("authkey"),
          space: "kmf-doc", // 空间
          subject: process.env.NODE_ENV == "development" ? "test" : "ets", // 项目
          product_line: process.env.NODE_ENV == "development" ? "test" : "ets" // 项目
        },
        fileList: [],
        multiple: true,
        maxLength: 10,
        showProgress: true
      },
      copyStatus: 2, // 1 copy success 0 copy failed 2 no copy
      copyIndex: -1 //当前复制的index
    };
  },
  watch:{
    'dialogVisible'(val){
      if(!val){
        this.cancelUpload();
      }
    }
  },
  created() {
    this.getList();
    // this.kdfsStsUrl();
  },
  methods: {
    /**
     * 获取资料列表
     */
    async getList() {
      let { result, message, status } = await this.$http._get(api.mediasUrl, {
        attachment_name: this.searchName,
        page: this.curPage,
        limit: this.limit
      });
      if (status == 200) {
        this.mediaList = result.medias;
        this.total = result.total;
        this.curPage = Number(result.page);
        this.loading = false;
      }
    },
    /**
     * 上传成功回调
     */
    uploadSuccess(res) {
      if (res.status == 200) {
        this.fileList.push({
          uri: `${res.result.domain}/${res.result.full_url}`,
          name: res.result.source_name
        });
      }
    },
    /**
     * 上传失败回调
     */
    uploadFailed(err) {
      // 上传失败后的回调
      console.log("uploadFailed", err);
    },
    /**
     * 上传出错回调
     */
    uploadError(err) {
      this.$message({
        duration:1000,
        type: "warning",
        message: err.msg
      });
    },
    /**
     * file input change事件
     */
    handleFileChange(e) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.filesEle.handleFileChange(e);
      });
    },
    /**
     * 触发选择文件操作
     */
    triggerFileInput() {
      this.$refs.file.click();
    },
    /**
     * 删除文件
     * @param {Nubmer} key 索引
     */
    deleteUpload(key, name) {
      this.$refs.filesEle.removeFile(key);
      this.$delete(this.fileList, key);
    },
    /**
     * 取消上传
     */
    cancelUpload() {
      this.dialogVisible = false;
      this.$refs.filesEle.files = [];
      this.fileList = [];
    },
    /**
     * 提交数据
     */
    async submitUpload() {
      let { result, status, message } = await this.$http._post(api.mediasUrl, {
        attachments: this.fileList
      });
      if (status == 200) {
        this.loading = true;
        this.dialogVisible = false;
        this.curPage = 1
        this.getList();
      }
    },
    /**
     * 执行复制操作
     */
    doCopy(scope) {
      this.copyIndex = scope.$index;
      this.$copyText(scope.row.attachments.url).then(
        e => {
          this.copyStatus = 1;
        },
        e => {
          this.copyStatus = 0;
        }
      );
    },
    /**
     * 鼠标移出事件
     */
    leave(scope) {
      this.copyStatus = 2;
      this.copyIndex = -1;
    },
    /**
     * 删除列表文件
     */
    async delListFile(scope) {
      this.$confirm(
        "Do you mean to delete this record? This change cannot be recovered.",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "error"
        }
      )
        .then(async () => {
          let { result, status, message } = await this.$http._delete(
            `${api.mediasUrl}/${scope.row.id}`
          );
          if (status == 200) {
            this.loading = true;
            this.getList();
            this.$message({
              duration:1000,
              type: "success",
              message: "delete success"
            });
          } else {
            this.$message({
              duration:1000,
              type: "error",
              message: message
            });
          }
        })
        .catch(() => {});
    },
    handleSearch(val) {
      this.searchName = val;
      this.curPage = 1
      this.getList();
    },
    /**
     * 修改每页展示条数
     */
    handleSizeChange(val) {
      this.limit = val;
      this.getList();
    },
    /**
     * 选择页数
     */
    handleCurrentChange(val) {
      this.curPage = val;
      this.getList();
    },
    /**
     * 表格表头样式
     */
    rowClass({ row, rowIndex }) {
      return "background:#fafafa";
    }
  }
};
</script>
<style lang="scss" scpoed>
.file-info {
  margin-bottom: 12px;
}
.icon-delete {
  margin-right: 50px;
  margin-top: 6px;
  cursor: pointer;
  &:hover {
    color: #e6a23c;
  }
}
.del-file {
  cursor: pointer;
  &:hover {
    color: #e6a23c;
  }
}

.copyurl {
  cursor: pointer;
  .copytip {
    font-size: 12px;
    padding: 0 6px;
    border-radius: 10px;
    background: rgb(121, 187, 255);
    color: #fff;
    margin-left: 12px;
  }
  .copytext {
    display: none;
  }
  .success {
    background: #67c23a;
    display: inline-block;
    padding: 4px 6px;
  }
  .failed {
    padding: 4px 6px;
    display: inline-block;
    background: #f56c6c;
  }
  &:hover {
      span{
          text-decoration: underline;
      }
    .copytext {
      display: inline-block;
    }
  }
}
</style>