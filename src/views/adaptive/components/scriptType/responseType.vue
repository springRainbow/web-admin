<template>
  <div>
    <p v-for="(item,resindex) in responseArray" style="margin-bottom:12px;">
      <el-input
        style="width:55%;margin-right:20px;"
        type="text"
        v-model="item.content"
        size="small"
        placeholder="Response"
        @change="inputComplete"
      ></el-input>
      <span style="margin:0 12px;">Go to</span>
      <el-select v-model="item.to" size="small" @change="changeGoto" style="width:120px;">
        <el-option label="No.--" :value="-1"></el-option>
        <el-option
          v-for="(to,index) in ids"
          :key="`to${index}`"
          :label="`No.${to.seq}`"
          :value="to.id"
          v-if="editScriptData.length == 0 || (editScriptData[resindex] && to.id != editScriptData[resindex]['script_id'])"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left:12px;"
        icon="el-icon-minus"
        circle
        size="mini"
        :disabled="responseArray.length == 1"
        @click="delResponse(resindex)"
      ></el-button>
    </p>
    <el-button icon="el-icon-plus" style="padding:6px;" @click="addResponse"></el-button>
  </div>
</template>
<script>
export default {
  name: "responseType",
  data() {
    return {
      formData: {
        content: [],
        to: []
      },
      responseArray: [
        {
          content: "",
          to: -1
        }
      ]
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
    }
  },
  created() {
    if (this.editScriptData.length) {
      this.responseArray = [];
      this.editScriptData.forEach((el, index) => {
        this.responseArray.push({
          content: el.content,
          to: el.goto
        });
      });
    }
  },
  methods: {
    changeGoto(val) {
      this.formData.to = [];
      this.responseArray.forEach((el, index) => {
        this.formData.to.push({
          "0": el.to
        });
      });
      this.$emit("returnData", this.formData);
    },
    inputComplete() {
      this.formData.content = [];
      this.formData.to = [];
      this.responseArray.forEach((el, index) => {
        this.formData.content.push(el.content);
        this.formData.to.push({
          "0": el.to
        });
      });
      this.$emit("returnData", this.formData);
    },
    /**
     * 添加一条
     */
    addResponse() {
      this.responseArray.push({ content: "", to: -1 });
    },
    delResponse(index) {
      this.$delete(this.responseArray, index);
      this.inputComplete()
    }
  }
};
</script>
<style lang="scss" scpoed>
.typecont {
  margin-bottom: 20px;
}
</style>