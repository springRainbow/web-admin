<template>
  <div>
    <el-upload
      ref="myUpload"
      :action="uploadUrl"
      :data="aliOptions"
      :headers="headers"
      :list-type="(uploadType == '3' || uploadType == '4') ? 'text':'picture-card'"
      :file-list="existFile"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :on-exceed="exceed"
    >
      <i class="el-icon-plus" v-if="!uploadType || uploadType == '2'"></i>
      <el-button
        v-if="(uploadType == '3' || uploadType == '4') && mediaUrl == ''"
        icon="el-icon-upload"
        type="primary"
        plain
      >点击上传</el-button>
    </el-upload>
    <div v-if="mediaUrl != ''" class="g-clearfix mediaBox" style="margin:16px 0;">
      <audio class="fl" :src="mediaUrl" controls v-if="uploadType == '3'"></audio>
      <video
        class="fl"
        :src="mediaUrl"
        v-if="uploadType == '4'"
        style="height:65px;"
        @click="dialogVisible = true"
      ></video>
      <el-button
        icon="el-icon-delete"
        circle
        type="danger"
        class="del-btn"
        size="mini"
        @click="handleRemove"
      ></el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img
        v-if="(!uploadType || uploadType == '2') && fileList.length"
        width="100%"
        :src="fileList[0].url"
        alt="fileList[0].name"
      />
      <video v-if="mediaUrl != ''" :src="mediaUrl" controls style="width:100%"></video>
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api";
import md5 from "crypto-js/md5";
export default {
  name: "upload",
  props: {
    options: {
      type: Object,
      required: true
    },
    existFile: {
      type: Array,
      required: false
    },
    limit: {
      type: Number,
      required: false,
      default: 1
    },
    // 上传的类型
    uploadType: {
      type: Number | String,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      // 阿里云上传需要的参数
      aliOptions: {
        policy: "",
        OSSAccessKeyId: "",
        success_action_status: 200,
        callback: "",
        signature: "",
        "x-oss-security-token": ""
      },
      dialogVisible: false,
      uploadUrl: "", // 上传的地址
      mediaUrl: "",
      headers: { Authorization: "Bearer " + this.$cookie.get("authkey") },
      opts: {
        action: "post",
        authkey: this.$cookie.get("authkey")
      },
      fileList: [] // 已经存在的图片
    };
  },
  watch: {
    existFile(val) {
      if (val) {
        this.fileList = val;
      }
    }
  },
  created() {
    if(this.existFile.length && (this.uploadType == '4' || this.uploadType == '3')){
        this.mediaUrl = this.existFile[0]['url'] || ''
    }
  },
  methods: {
    /**
     *  获取上传信息和权限
     */
    async kdfsStsUrl() {
      let res = await this.$http._get(
        api.kdfsStsUrl,
        Object.assign(this.opts, this.options),
        {
          headers: {
            "k-product-line":
              process.env.NODE_ENV == "development" ? "test" : "ets"
          }
        }
      );
      this.uploadUrl = res.host;
      this.aliOptions.policy = res.policy;
      this.aliOptions.OSSAccessKeyId = res.accessid;
      this.aliOptions.callback = res.callback;
      this.aliOptions.signature = res.signature;
      this.aliOptions["x-oss-security-token"] = res.security_token;
    },
    /**
     * 上传之前，处理参数
     */
    async beforeUpload(file) {
      await this.kdfsStsUrl();
      let obj = Object.assign(this.opts, this.options);
      let fileTail = file.name.split(".")[1]; // 文件扩展
      let fileMd5 = md5(file.name + file.size).toString(); // 文件名MD5
      let key = `${obj.subject}/${fileMd5.substr(0, 2)}/${fileMd5.substr(
        2,
        2
      )}/${fileMd5 + "." + fileTail}`;
      this.aliOptions["key"] = key;
      this.aliOptions["x:source_name"] = file.name;
      this.aliOptions["x:product_line"] = obj.product_line;
      this.aliOptions["x:dir_id"] = 0;
      this.aliOptions["x:auth"] = obj.authkey;
    },
    handleRemove(file, fileList) {
      this.$refs["myUpload"].clearFiles();
      this.$emit("removeImg", true);
      this.mediaUrl = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSuccess(response, file, fileList) {
    //   this.$set(this.fileList, 0, {
    //     name: response.result.source_name,
    //     url: `${response.result.domain}/${response.result.full_url}`
    //   });
      this.$emit("uploadSuccess", response.result);
    },
    /**
     * 文件超出限制钩子
     */
    exceed(files, fileList) {
      this.$message({
        duration:1000,
        type: "warning",
        message: "文件超出限制，请先删除已存在图片"
      });
    }
  }
};
</script>
<style lang="scss" scpoed>
.mediaBox {
  margin: 16px 0;
  position: relative;
  .del-btn {
    position: absolute;
    margin-left: 32px;
    top: 50%;
    transform: translate(0, -50%);
  }
}
</style>