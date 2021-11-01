<template>
  <div class="questiontype">
    <div class="questiontype-bar">
      <span>QuestionID：</span>
      <el-input
        type="text"
        style="width:160px;"
        @change="searchQuestion"
        v-model.trim="questionid"
        placeholder="search"
        size="small"
      ></el-input>
    </div>
    <div class="questiontype-cont" v-loading="loading">
      <p class="nocont" v-if="tipsText != ''">{{ tipsText }}</p>
      <div v-if="tipsText == ''" class="cont">
        <div class="single-question" id="scrollView" v-if="singleQuestion.id && saveSuccess">
          <div class="g-clearfix">
            <div class="info">
              <span class="fl tit">Type：</span>
              <el-select
                v-model="add_topic_type"
                size="small"
                :disabled="!canEditNewQuestionType"
                @change="handleAddSetType('questionType','new')"
              >
                <el-option
                  v-for="(item,key) in addSelectQTypes"
                  :key="'add' + key"
                  :label="item"
                  :value="key"
                ></el-option>
              </el-select>
              <el-button
                style="margin-left:12px;"
                size="mini"
                type="primary"
                v-if="canEditNewQuestionType"
                :disabled="noSupport || add_topic_type == ''"
                @click="saveQuestion('new')"
              >Save</el-button>
              <p
                v-if="canEditNewQuestionType"
                style="padding-left:120px;color:#f00;font-size:12px;margin-top:4px;"
              >Once set, it cannot be changed anymore</p>
              <p
                style="padding-left:120px;color:#f00;font-size:12px;margin-top:4px;"
                v-if="noSupport"
              >
                Type not supported in Jason yet
                <el-popover
                  placement="right"
                  title="Supported Question Type in Jason:"
                  width="300"
                  trigger="hover"
                >
                  <ul>
                    <li v-for="(item,key) in qtypes" :key="`qt${key}`" style="margin-bottom:8px;">
                      <span :class="jasonType.indexOf(key) > -1 ? 'support':'no-support'" v-if="item != 'Audio'">
                        <em class="el-icon-check"></em>
                        {{ item }}
                      </span>
                    </li>
                  </ul>
                  <i class="el-icon-warning" slot="reference"></i>
                </el-popover>
              </p>
            </div>
            <div class="info">
              <span class="fl tit">Practice As：</span>
              <el-select
                v-model="add_practice_type"
                size="small"
                :disabled="canEditNewQuestionType"
                :placeholder="canEditNewQuestionType ? 'save type first' : 'choose'"
                @change="handleAddSetType('practiceType','new')"
              >
                <el-option
                  v-for="(item,key) in addSelectPTypes"
                  :key="'add' + key"
                  :label="item"
                  :value="key"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- error tip -->
          <div v-if="errorEdit.errorMsg.error_feedback">
            <div class="info error-wrap g-clearfix" v-if="errorEdit.errorMsg.error_feedback.id">
              <span class="fl" style="width: 120px;margin-bottom:12px;margin-top:12px;">Hint:</span>
              <div class="location error fl">
                <div class="text-area-wrap" >
                  <el-input
                    class="error-text-area"
                    :disabled="!errorEdit.errorMsgBool"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    v-model="errorEdit.errorMsg.error_feedback.hint">
                  </el-input>
                  <div>
                    <el-button
                    type="primary"
                    v-if="errorEdit.errorMsgBool"
                    size="small"
                    @click="saveErrFb"
                  >Save</el-button>
                  <el-button
                    size="small"
                    v-if="errorEdit.errorMsgBool"
                    @click="cancelEdit"
                  >Cancel</el-button>
                  </div>
                </div>
                <el-button
                  v-if="!errorEdit.errorMsgBool"
                  type="primary"
                  plain
                  size="small"
                  icon="el-icon-edit"
                  @click="errorEdit.errorMsgBool = !errorEdit.errorMsgBool"
                >Edit</el-button>
              </div>
            </div>
          </div>
          <div class="g-clearfix">
            <span style="display:block;margin-bottom:20px;">
              Preview
              <el-button
                class="fr"
                type="primary"
                plain
                size="small"
                icon="el-icon-edit"
                @click="goLibs"
              >Edit</el-button>
            </span>
            <component :is="addComponent" :type="add_topic_type" :previewData="addPreviewQuestion" :childList="quesitionChildList"></component>
             <!-- error 解析 -->
            <div class="explain-error-wrap" v-if="errorEdit.errorMsg.error_feedback">
              <div class="explain-error-con" v-if="errorEdit.errorMsg.error_feedback.has_error_general == 1 || errorEdit.errorMsg.error_feedback.has_error_option == 1">
                <div v-if="errorEdit.errorMsg.officialExplain.html_explain">
                  <h3>Error Feedback</h3>
                  <p v-if="errorEdit.errorMsg.error_feedback.has_error_general == 1" class="explain-error-topic" v-html="errorEdit.errorMsg.officialExplain.html_explain.question"></p>
                  <div v-if="errorEdit.errorMsg.error_feedback.has_error_option == 1" class="explain-option" v-for="(val,key,index) in errorEdit.errorMsg.officialExplain.html_explain.option">
                    <span>{{key}} : </span>
                    <p class="explain-option-con" v-html="val"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="goto" v-if="tipsText == ''">
      <el-select
        size="small"
        v-model="formData.to[0]['0']"
        style="width:120px"
        @change="changeGoto"
      >
        <el-option label="No.--" :value="-1"></el-option>
        <el-option
          v-for="(to,index) in ids"
          :key="`to${index}`"
          :label="`No.${to.seq}`"
          :value="to.id"
          v-if="editScriptData.length == 0 || editScriptData.length != 0 && to.id != editScriptData[0]['script_id']"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import api from "@/api";
const choiceType = () =>
  import("@/views/adaptive/components/preview/choiceType");
const audioType = () => import("@/views/adaptive/components/preview/audioType");
const readingType = () =>
  import("@/views/adaptive/components/preview/readingType");
const allType = () =>
  import("@/views/adaptive/components/preview/allType");
export default {
  name: "questionType",
  data() {
    return {
      formData: {
        to: [{ "0": -1 }],
        question_practices: []
      },
      questionid: "",
      tipsText: "Search QuestionID or Create New Question",
      curQuestion: {},
      pracitice_types: [],
      loading: false,
      addPreviewQuestion: {}, // question preview 数据
      add_topic_type: "",
      add_practice_type: "",
      addSelectQTypes: {},
      addSelectPTypes: {},
      qtypes: {},
      canEditNewQuestionType: true,
      loading: false,
      noSupport: false,
      jasonType: ["3", "1", "2", "9", "7", "10"], //jason支持的题型 Choice, MultiChoice, Fill in Blank, Inline MultiChoice, Repeat, Read
      errorEdit:{
        errorMsgBool: false, 
        errorMsg:{},
        oldErrorMsg:''
      }, //错误编辑
      qListStr:'',//多个题目ID
      quesitionChildList:[],//多个子题目
    };
  },
  watch: {
    questionid(val) {
      this.tipsText = "Search QuestionID or Create New Question";
    }
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
  computed: {
    addComponent() {
      let map = {
        1: choiceType,
        2: choiceType,
        3: choiceType,
        4: choiceType,
        5: choiceType,
        6: audioType,
        7: audioType,
        8: readingType,
        9: audioType,
        10: audioType,
        11: audioType,
        12: choiceType,
        13: choiceType,
        17: choiceType,
        18: choiceType,
        19: choiceType,
        20: choiceType,
        21: choiceType,
        22: allType,
        23: allType
      };
      return map[this.add_topic_type];
    }
  },
  created() {
    if (this.editScriptData.length) {
      this.questionid = this.editScriptData[0]["question_practices"][
        "question_id"
      ];
      this.formData.to = [{ "0": this.editScriptData[0]["goto"] }];
      this.add_practice_type = this.editScriptData[0]["question_practices"]['practice_type'].toString()
      this.searchQuestion();
    }
  },
  methods: {
    /**
     * 搜索question id
     */
    async searchQuestion() {
      this.loading = true;
      this.canEditNewQuestionType = true;
      if (this.questionid != "") {
        await this.getSingleQuestion(this.questionid);
      }
      if (this.singleQuestion.id && this.tipsText == "") {
        
        await this.getPracticeWay(
          {
            question_id: this.questionid,
            target_type: 2 // 1 activity 2 script
          },
          this.singleQuestion.type
        );
      } else {
        this.noQuestionid = "no data";
      }
      this.loading = false;
    },
    changeGoto(val) {
      this.$emit("returnData", this.formData);
    },
    /**
     * 获取单题题目详情
     */
    async getSingleQuestion(qid, way) {
      let { result, status, message } = await this.$http._get(
        api.getSingleQues(qid)
      );
      if (status == 200) {
        if(result.question.question.project == 7){
          this.saveSuccess = true;
          this.errorEdit = {
              errorMsgBool: false, //错误编辑
              errorMsg:{},
              oldErrorMsg:''
            }
          this.errorEdit.errorMsg = Object.assign({},this.errorEdit.errorMsg,result.question);
          this.errorEdit.oldErrorMsg = JSON.stringify(result.question)
          this.addPreviewQuestion = result.question;
          if(result.question.child.length > 0){
            this.getChildList(this.addPreviewQuestion)
          }
          this.singleQuestion = result.question["question"];
          if (result.question["question"].id) {
            this.tipsText = "";
          } else {
            this.tipsText =
              "Oops, Nothing. Something wrong with the ID, please check again.";
          }
        } else {
          this.$message({
            duration:1000,
            type: "error",
            message: "题目未找到"
          });
        }
      } else {
        this.$message({
          duration:1000,
          type: "error",
          message: message
        });
      }
    },
    /**
     * 获取题目的练习方式
     * @param {Object} param 请求的参数
     * @param {Number|String} type 当前题目的类型（从题库返回）
     */
    async getPracticeWay(param, type) {
      let { result } = await this.$http._get(api.getPracticeWay, param);
      // 当前题目的题目类型（question_type）
      if (result.topic_types[type]) {
        // 如果当前返回type为ets题目类型
        this.pracitice_types = result.pracitice_types;
        let curQuestionType = result.topic_types[type];
        
        this.qtypes = result.types;
        let showQuestionType = {};
        for (let t in result.types) {
          if (curQuestionType.includes(Number(t))) {
            showQuestionType[t] = result.types[t];
          }
        }
        
        this.addSelectQTypes = showQuestionType;

        if (result.question["question_topic"]["topic_type"]) {
          this.canEditNewQuestionType = false;
          this.add_topic_type = result.question["question_topic"][
            "topic_type"
          ].toString();
          // 根据当前题目类型去查找对应练习方式可选择的范围
          let pTypeArea = result.pracitice_types[this.add_topic_type];
          // 根据可选择的范围去筛选要展示的数据
          let showPracticeType = {};
          pTypeArea.forEach(el => {
            showPracticeType[el] = result.types[el];
          });
          this.addSelectPTypes = showPracticeType;
          if (Object.keys(this.addSelectPTypes).length == 1) {
            this.add_practice_type = Object.keys(
              this.addSelectPTypes
            )[0].toString();
            this.setTypes({
              question: this.questionid,
              topic_type: this.add_topic_type,
              practice_type: this.add_practice_type
            });
          }
        } else {
          this.add_topic_type = "";
          this.canEditNewQuestionType = true;
        }
        if (result.question["question_practice"]["practice_type"]) {
          this.add_practice_type = result.question["question_practice"][
            "practice_type"
          ].toString();
        }
        if (this.add_topic_type != "") {
          if (this.jasonType.indexOf(this.add_topic_type) > -1) {
            // 支持返回
            this.noSupport = false;
          } else {
            // 不支持返回
            this.noSupport = true;
          }
          this.$emit("isSupport", this.noSupport);
        }
      } else {
        this.tipsText = "ETS题库中无当前类型题目";
      }
    },
    /**
     * 保存错误修改信息
     */
     saveErrFb(){
        this.$http._post(api.errorFbSave,{
            topic_id:this.errorEdit.errorMsg.error_feedback.id,
            hint: this.errorEdit.errorMsg.error_feedback.hint
          }).then((res)=>{
            if(res.status == 200){
              this.errorEdit.errorMsgBool =! this.errorEdit.errorMsgBool;
              this.errorEdit.oldErrorMsg = JSON.stringify(this.errorEdit.errorMsg)
            }
          }).catch((err)=>{console.log(err)})
      
    },
    /**
     * 批量获取题目
    */
    getChildList(item){
      // console.log(item)
      if(item.child.length > 0){
        item.child.forEach(val => {
          this.qListStr += val.id + ","
        });
        this.$http._get(api.getChildList,{
          ids:this.qListStr
        }).then((res)=>{
          if(res.status == 200){
            item.child = res.result.questions;
            this.quesitionChildList = res.result.questions;
            item.child.forEach(val=>{
              if(val.child && val.child.length){
                this.getChildList(val)
              }
            })
          }
        }).catch((err)=>{console.log(err)})
      }
    },
    /**
     * 取消错误修改信息
     */
    cancelEdit(){
      this.errorEdit.errorMsg = JSON.parse(this.errorEdit.oldErrorMsg);this.errorEdit.errorMsgBool = !this.errorEdit.errorMsgBool;
    },
    handleAddSetType(type, op) {
      if (
        this.jasonType.indexOf(this.add_topic_type) > -1 &&
        (this.jasonType.indexOf(this.add_practice_type) > -1 || this.add_practice_type == '')
      ) {
        this.noSupport = false;
        if (type == "questionType") {
          // jason支持的题型
          // 筛选quesiton_type后需要去查找对应的可选择的练习方式范围
          let canSelectType = this.pracitice_types[this.add_topic_type];
          let showPracticeType = {};
          canSelectType.forEach(el => {
            showPracticeType[el] = this.qtypes[el];
          });
          if (canSelectType.indexOf(Number(this.add_practice_type)) > -1) {
            // 如果当前范围包含当前练习方式
            // this.show_practice_type =
          } else {
            this.add_practice_type = ""; // 不包含为 choose type
          }
          this.addSelectPTypes = showPracticeType;
          if (Object.keys(this.addSelectPTypes).length == 1) {
            this.add_practice_type = Object.keys(
              this.addSelectPTypes
            )[0].toString();
            this.setTypes({
              question: this.questionid,
              topic_type: this.add_topic_type,
              practice_type: this.add_practice_type
            });
          }
        } else {
           this.setTypes({
              question: this.questionid,
              topic_type: this.add_topic_type,
              practice_type: this.add_practice_type
            });
          // let arr = [];
          // arr.push(this.add_practice_type);
          // this.formData.question_practices = arr;
          // this.$emit("returnData", this.formData);
        }
      } else {
        this.noSupport = true;
      }
      this.$emit("isSupport", this.noSupport);
    },
    /**
     * 设置题目类型
     */
    saveQuestion() {
      this.setTypes(
        {
          question: this.questionid,
          topic_type: this.add_topic_type
        },
        "questionType"
      );
    },
    /**
     * 设置类型
     */
    async setTypes(param, op) {
      let { result, status, message } = await this.$http._post(
        api.setTypes,
        param
      );
      if (status == 200) {
        if(result.question_topic) {
          if(result.question_topic.hint === null){
            this.errorEdit = {
              errorMsgBool: false, //错误编辑
              errorMsg:{
                error_feedback:{}
              },
              oldErrorMsg:''
            }
            this.errorEdit.errorMsg.error_feedback = Object.assign({},this.errorEdit.errorMsg,result.question_topic);
            this.errorEdit.errorMsg.error_feedback.id = result.question_topic.id;
            this.errorEdit.oldErrorMsg = JSON.stringify(this.errorEdit.errorMsg)
          }
        }
        if (op == "questionType") {
          this.canEditNewQuestionType = false;
        }
        if (param.practice_type) {
          let arr = [];
          arr.push(result.success);
          this.formData.question_practices = arr;
          await this.$emit("returnData", this.formData);
        }
      }
    },
    /**
     * 跳转到activity config
     */
    goActivityConfig(id) {
      this.$router.push({
        name: "activityConfig",
        query: {
          activity_id: id
        }
      });
    },
    /**
     * 跳转题库编辑
     */
    goLibs() {
      let open = window.open();
      open.location = `${process.env.VUE_APP_PRFIEX}qm.kmf.com/manage/question-op?question_id=${this.questionid}`;
    }
  }
};
</script>
<style lang="css">
.support {
  color: #67c23a;
}
.no-support {
  color: #909399;
}
</style>
<style lang="scss" scpoed>
.questiontype {
  &-bar {
    padding: 12px;
    border-bottom: 1px solid #ededed;
    background: #fafafa;
  }
  .nocont {
    text-align: center;
    height: 100px;
    line-height: 100px;
    color: #666;
    background: #fafafa;
  }
  .cont {
    padding: 20px;
    background: #fafafa;
    p {
      margin-bottom: 12px;
      .tit {
        display: inline-block;
        font-weight: bold;
        width: 100px;
      }
    }
  }
  .goto {
    margin-top: 24px;
    em {
      font-weight: bold;
    }
  }
  .info {
    margin-bottom: 12px;
    .tit {
      width: 120px;
    }
  }
}

.error-content {
  word-break: break-all;
  width: 350px;
  margin-top: 6px;
  margin-bottom: 12px;
}

.error-wrap {
  /* display: flex; */
  /* justify-self: start; */
  span {
    display: inline-block;
  }
}

.text-area-wrap{
  margin-bottom: 12px;
}

.error-text-area {
  margin-bottom: 12px;
  width: 350px;
}

.explain-error-wrap{
  margin-top: 15px;
  .explain-error-wrap-h3 {
    margin-bottom: 8px;
  }
  .explain-option {
    margin-top: 10px;
  }
  .explain-option-con {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>