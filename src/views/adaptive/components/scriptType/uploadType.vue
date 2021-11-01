<template>
  <div>
    <upload
      class="typecont"
      :options="uploadOpts"
      @uploadSuccess="uploadSuccess"
      :existFile="editScriptData.length ? editScriptData[0]['attachments'] : []"
      :uploadType="type"
      @removeImg="handleRemove"
    ></upload>
    <span style="margin-right: 12px;">Go to</span>
    <el-select v-model="goto" size="small" @change="changeGoto" style="width:120px;">
      <el-option label="No.--" :value="-1"></el-option>
      <el-option
        v-for="(to,index) in ids"
        :key="`to${index}`"
        :label="`No.${to.seq}`"
        :value="to.id"
        v-if="editScriptData.length == 0 || to.id != editScriptData[0]['script_id']"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  name: "imageType",
  data() {
    return {
      formData: {
        to: [{ "0": -1 }],
        attachments: []
      },
      goto: -1,
      isDelete:false, // 默认没删除 处理编辑的数据
    };
  },
  props: {
    // 类型
    type: {
      type: Number | String,
      required: false
    },
    // 编辑传入
    editScriptData: {
      type: Array,
      required: false
    },
    // 所有script id
    ids: {
      type: Array,
      required: true
    },
    uploadOpts: {
      type: Object,
      required: false
    }
  },
  created() {
    if (this.editScriptData.length) {
      this.formData.attachments = this.editScriptData[0]["attachments"];
      this.$set(this.formData.to, 0, {"0":this.editScriptData[0]['goto']});
      this.goto = this.editScriptData[0]["goto"];
    }
  },
  methods: {
    changeGoto(val) {
      let arr = [];
      let obj = {
        "0": val
      };
      arr.push(obj);
      this.formData.to = arr;
      if(!this.isDelete && this.editScriptData.length){
         this.formData.attachments = [{name:this.editScriptData[0]["attachments"][0].name,uri:this.editScriptData[0]["attachments"][0]["url"]}]
      }
      this.$emit("returnData", this.formData);
    },
    uploadSuccess(data) {
      let arr = [];
      let obj = {
        name: data.source_name,
        uri: `${data.domain}/${data.full_url}`
      };
      arr.push(obj);
      this.formData.attachments = arr;
      this.$emit("returnData", this.formData);
    },
    /**
     * 删除
     */
    handleRemove() {
      this.isDelete = true;
      this.formData.attachments = [];
      this.$emit("returnData", this.formData);
    }
  }
};
</script>
<style lang="scss" scpoed>
.typecont {
  margin-bottom: 20px;
}
</style>