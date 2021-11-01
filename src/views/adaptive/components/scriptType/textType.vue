<template>
  <div>
    <el-input
      class="typecont"
      type="textarea"
      @blur="inputComplete"
      :autosize="{ minRows: 4}"
      placeholder="输入……"
      v-model="formData.content[0]"
    ></el-input>
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
  name: "textType",
  data() {
    return {
      formData: {
        content: [],
        to: [{ "0": -1 }]
      },
      goto: -1
    };
  },
  props: {
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
      this.$set(this.formData.content, 0, this.editScriptData[0].content);
      this.$set(this.formData.to, 0, this.editScriptData[0].to);
      this.goto = this.editScriptData[0].goto;
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
      this.$emit("returnData", this.formData);
    },
    inputComplete() {
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