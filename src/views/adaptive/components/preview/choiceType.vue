<template>
  <div class="previewtype">
    <p v-if="previewData['question']" v-html="previewData['question'].ets_html_content" style="color:#666"></p>
    {{previewData.questionListArr}}
    <div class="child-con" v-if="type == 17">
      <h3 class="child-title">Children：</h3>
      <div class="child-question-wrap" v-if="childList.length > 0" v-for="(item,index) in childList">
        <p>{{item.question.id}}</p>
        <p class="child-question" v-html="item.question.html_content"></p>
        <p class="child-question-zh" v-html="item.question.content_zh"></p>
        <el-radio-group v-model="radioChecked" >
          <el-radio
            v-for="(item,index) in item.answer"
            :key="`ans${index}`"
            :label="item.selected"
            disabled
            style="display:block;margin-top:12px;"
          >
            <i v-html="item.html_content"></i>
          </el-radio> 
        </el-radio-group>
      </div>
    </div>
    <div class="answer" v-if="type == 3 || type == 13 || type == 18 || type == 19 || type == 20 || type == 21 ">
      <el-radio-group v-model="radioChecked" v-if="type == 3 || type == 13">
        <el-radio
          v-for="(item,index) in previewData['answer']"
          :key="`ans${index}`"
          :label="item.selected"
          disabled
          style="display:flex;align-items:center;margin-top:12px;"
        >
          <i v-if="type == 3" v-html="item.ets_html_content"></i>
          <div style="display:inline-block;width: 380px" v-if="type == 13" v-html="item.ets_html_content"></div>
        </el-radio>
      </el-radio-group>
    </div>
    <div class="answer" v-if="type == 1 || type == 2 || type == 4 || type == 5 || type == 12 || type == 18 || type == 19 || type == 20 || type == 21 ">
      <el-checkbox-group v-model="checkChecked">
        <el-checkbox
          v-for="(item,index) in previewData['answer']"
          :key="`ans${index}`"
          :label="item.selected"
          disabled
          style="display:block;margin-top:12px;"
        ><i v-html="item.html_content"></i></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>
<script>
  import api from '@/api'
export default {
  name: "choiceType",
  data() {
    return {
      radioChecked: "1",
      checkChecked:["1"],
    };
  },
  props: {
    previewData: {
      type: Object,
      required: true
    },
    childList: {
      type: Array,
      required: true
    },
    type: {
      type: Number | String,
      required: false
    },
    qmLink: {
      type: String,
      required: true
    }
  },
};
</script>
<style lang="scss" scpoed>
.el-radio,.el-checkbox{
    white-space: pre-line;
}
.child-question-wrap {
  margin-top: 20px;
}
.child-question,.child-question-zh {
  margin-top: 10px;
}
.child-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
}
</style>