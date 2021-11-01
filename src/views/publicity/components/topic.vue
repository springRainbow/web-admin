<template>
  <!-- 右边 -->
  <div class="topic-wrap-con" v-if="loadingBool">
    <!-- <div class="topic-wrap-con"> -->
    <div class="topic-right" :class="{active:tabIndex == 1}" v-show="tabIndex == index" v-for="(item,index) in 5"
      :key="index">
      <div class="progress" :style="{width: (index+1)/5*500 + 'px'}"></div>
      <!-- 右下角icon -->
      <div class="right-bottom"></div>
      <p v-if="submitData.toefl_is_examed == 1" class="last-btn flex-wrap" v-show="tabIndex > 0 && tabIndex < 4"
        @click="tabChange('last',index,'jion')">
        <span class="last-icon"></span> 上一题
      </p>
      <p v-else class="last-btn flex-wrap" v-show="tabIndex > 0 && tabIndex < 4"
        @click="tabChange('last',index ,'noJion')">
        <span class="last-icon"></span> 上一题
      </p>
      <div class="topic-con" v-show="index == 0">
        <p class="topic-text">
          你是否曾参加过TOEFL iBT 考试？
        </p>
        <div class="part-in">
          <el-radio-group @change="changeBtn" v-model="submitData.toefl_is_examed">
            <el-radio-button class="radio-con" v-for="(item,key,index) in collectData.toefl_is_examed" :label="key"
              :value="item" :key="key">{{item}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="topic-con con-height" v-show="index == 1">
        <p class="topic-text">
          上一次考试时间
        </p>
        <div class="part-in">
          <el-date-picker format="yyyy / MM / dd " value-format="yyyy-MM-dd" @change="changeBtn(item,'exam')"
            v-model="submitData.toefl_last_date" type="date" placeholder="选择日期">
          </el-date-picker>
        </div>
        <p class="topic-text text-top">
          考试成绩
        </p>
        <div class="part-in flex-wrap">
          <div class="option" v-for="(item,key,index) in collectData.toefl_last_scores">
            <p class="subject">{{item}}</p>
            <el-select
            filterable
            @change="changeBtn(item,'exam')"
            class="select-con" 
            v-if="index == 0" 
            v-model="submitData.toefl_last_scores[0]"
            placeholder=" " >
              <el-option v-for="item in 120" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-select @change="changeBtn(item,'exam')" filterable class="select-con" v-if="index == 1" v-model="submitData.toefl_last_scores[5]" placeholder=" ">
              <el-option v-for="item in 30" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-select @change="changeBtn(item,'exam')" filterable class="select-con" v-if="index == 2" v-model="submitData.toefl_last_scores[6]"placeholder=" " >
              <el-option v-for="item in 30" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-select @change="changeBtn(item,'exam')" filterable class="select-con" v-if="index == 3" v-model="submitData.toefl_last_scores[7]" placeholder=" ">
              <el-option v-for="item in 30" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
            <el-select @change="changeBtn(item,'exam')" filterable class="select-con" v-if="index == 4" v-model="submitData.toefl_last_scores[8]" placeholder=" ">
              <el-option v-for="item in 30" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="topic-con con-height" v-show="index == 2">
        <p class="topic-text">
          距离下次考试还有
        </p>
        <div class="part-in">
          <el-radio-group @change="changeBtn" v-model="submitData.toefl_next_diff">
            <el-radio-button class="radio-con" v-for="(item,key,index) in collectData.toefl_next_diff" :label="key"
              :value="item" :key="key">{{item}}</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="topic-con con-height" v-show="index == 3">
        <p class="topic-text">
          你的当前的职业是
        </p>
        <div class="part-in">
          <el-radio-group @change="changeBtn" v-model="submitData.identity">
            <el-radio-button class="radio-con" v-for="(item,key,index) in collectData.identity" :label="key"
              :value="item" :key="key">{{item}}</el-radio-button>
          </el-radio-group>
          <el-select class="select-margin" v-show="classBool" @change="selectFun" v-model="submitData.student_grade"
            placeholder="请选择你的年级">
            <el-option v-for="(item,key,index) in collectData.student_grade" :key="item" :label="item" :value="key">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="topic-con" v-show="index == 4">
        <section class="success" v-if="is_beta == 1">
          <p class="success-title">
            <span class="success-title-con">报名成功！</span><br />
            <span class="success-text">请扫码添加工作人员，等待 App下载通知</span>
          </p>
          <div class="success-content flex-wrap">
            <img src="@/assets/publicity-web/ets-code.png" alt="">
            <p class="content">
              <span class="success-content-con">TOEFL GoSpeak! 小助手</span><br />
              <span class="success-content-text">工作人员会通知内测开始时间，<br />并发送 App 的下载链接</span>
            </p>
          </div>
          <p class="success-bottom">
            <span class="bottom-title">未添加工作人员将无法参与 App 体验</span><br />
            <!-- <span class="bottom-text">若无法顺利加群，请添加微信好友 YM_work，请工作人员拉你入群。</span> -->
          </p>
        </section>
        <section class="fail" v-else>
          <p class="fail-content">
            感谢支持！
          </p>
          <p class="fail-title">非常遗憾，您本次未被选中内测。</p>
          <p class="fail-down">
            <span class="fail-down-text">可能的原因包含：</span><br />
            <span class="fail-down-text-con">1. 您所在的目标群体名额已满</span><br />
            <span class="fail-down-text-con">2. 您并非本次内测目标群体</span>
          </p>
          <p class="end-text">*敬请期待正式版上线。再次感谢您的支持！</p>
        </section>
      </div>
      <div class="next-btn jion" v-if="submitData.toefl_is_examed == 1" :class="{active:nextBool,high:tabIndex == 1}"
        v-show="tabIndex >= 0 && tabIndex < 3" @click="tabChange('next',index,'jion')">Next</div>
      <div class="next-btn nojion" v-else :class="{active:nextBool,high:tabIndex == 1}"
        v-show="tabIndex >= 0 && tabIndex < 3" @click="tabChange('next',index,'noJion')">Next</div>
      <div class="next-btn" :class="{active:nextBool}" v-if="submitData.toefl_is_examed == 1" v-show="tabIndex == 3"
        @click="tabChange('next',index,'jion','submit')">Next</div>
      <div class="next-btn" :class="{active:nextBool}" v-else v-show="tabIndex == 3"
        @click="tabChange('next',index,'noJion','submit')">Next</div>
    </div>
  </div>
</template>

<script>
  import api from "@/api"
  export default {
    name: 'topic',
    data() {
      return {
        tabIndex: 0, //切换的index
        collectData: {}, //信息收集数据
        nextBool: false,
        classBool: false,
        loadingBool: false, //加载中
        submitData: {
          toefl_is_examed: '',
          toefl_last_date: '',
          toefl_next_diff: '',
          identity: '', //身份选项
          student_grade: '',
          toefl_last_scores: {
            0: "",
            5: "",
            6: "",
            7: "",
            8: ""
          },
        },
        is_beta: '', //是否是内测用户
      }
    },
    created() {
      this.collectMsg();// 获取信息收集选项
      this.getAlreadyTest(); // 获取是否已经内测
    },
    methods: {
      /**
       * 选择框事件
      */
      selectFun(item) {


      },
      /**
       * 获取是否已经内测
      */
      getAlreadyTest() {
        this.$http._get(api.getCollectIS).then((res) => {
          if (res.status == 200) {
            this.loadingBool = true;
            if (res.result.beta_status == 1 || res.result.beta_status == 0) {
              this.tabIndex = 4;
              this.is_beta = res.result.beta_status;
            }
          }
        }).catch((err) => { console.log(err) })
      },
      /**
       * 单选框事件
      */
      changeBtn(item,type) {
        if (this.submitData.identity == 1) {
          this.classBool = true;
        } else {
          this.classBool = false;
          this.submitData.student_grade = ''
        }
        if(type == 'exam'){
          if(this.submitData.toefl_last_scores[0] == "" || this.submitData.toefl_last_scores[5] == "" || this.submitData.toefl_last_scores[6] == "" || this.submitData.toefl_last_scores[7] == "" || this.submitData.toefl_last_scores[8] == "" ){
              } else {
                this.nextBool = true;
              }
        } else {
          this.nextBool = true;
        }
        
      },
      /**
       * 下一题上一题切换
      */
      tabChange(type, index, jion, submit) {
        if (jion == "noJion") {
          // this.submitData.toefl_last_scores = '';
          // this.submitData.toefl_last_date = ''
          if (type == "last") {
            if (this.tabIndex > 2) {
              this.tabIndex = index - 1;
            } else {
              this.tabIndex = index - 2;
            }
          } else if (type == "next") {
            if (this.nextBool == false) return;
            this.nextBool = false;
            if (
              window.kmfSensors &&
              Object.prototype.toString.call(window.kmfSensors) ===
              "[object Object]"
            ) {
              window.kmfSensors.track("App元素点击", {
                project: "ets",
                platform: "web",
                product_line: "ets-web",
              });
            }
            if (this.tabIndex >= 2) {
              this.tabIndex = index + 1;
            } else {
              this.tabIndex = index + 2;
            }
            this.tabIndex > 5 ? this.tabIndex = 5 : '';
          }
          this.$emit('tabChange', this.tabIndex)
        } else if (jion == "jion") {
          // this.submitData.toefl_last_scores = {
          //   0: 60,
          //   5: 15,
          //   6: 15,
          //   7: 15,
          //   8: 15
          // }
          if (type == "last") {
            this.tabIndex = index - 1;
            if (this.nextBool == false) return;
            this.nextBool = false;
          } else if (type == "next") {
            if (this.nextBool == false) return;
            this.nextBool = false;
            if (
              window.kmfSensors &&
              Object.prototype.toString.call(window.kmfSensors) ===
              "[object Object]"
            ) {
              window.kmfSensors.track("App元素点击", {
                project: "ets",
                platform: "web",
                product_line: "ets-web",
              });
            }
            this.tabIndex = index + 1;
            this.tabIndex > 5 ? this.tabIndex = 5 : '';
          }
          this.$emit('tabChange', this.tabIndex)
        }
        if (submit == 'submit') {
          if(jion == "noJion"){
            this.submitData.toefl_last_scores = '';
            this.submitData.toefl_last_date = ''
          }
          if (this.submitData.toefl_last_scores) {
            this.submitData.toefl_last_scores = JSON.stringify(this.submitData.toefl_last_scores)
          }
          this.submitData.toefl_is_examed = Number(this.submitData.toefl_is_examed);
          this.submitData.toefl_next_diff = Number(this.submitData.toefl_next_diff);
          this.submitData.student_grade = Number(this.submitData.student_grade);
          this.submitData.identity = Number(this.submitData.identity);
          this.$http._post(api.submitCollectMessage, this.submitData).then((res) => {
            if (res.status == 200) {
              this.is_beta = res.result.is_beta;
              this.tabIndex = index + 1;
              this.tabIndex > 5 ? this.tabIndex = 5 : '';
              this.$emit('tabChange', this.tabIndex)
            }
          }).catch((err) => { console.log(err) });
        }
      },
      /**
       * 收集信息
      */
      collectMsg() {
        this.$http._get(api.getCollectMessage).then((res) => {
          if (res.status == 200) {
            this.collectData = Object.assign({}, this.collectData, res.result.collect_options);
          }
        }).catch((err) => { console.log(err) })
      }
    },
    components: {

    }
  }
</script>

<style scoped lang="scss">
  .flex-wrap {
    display: flex;
    align-items: center;
  }

  .last-icon {
    width: 12px;
    height: 15px;
    background: url("~@/assets/publicity-web/right.png") no-repeat center center;
    background-size: 100% 100%;
    margin-right: 6px;
  }

  .topic-right {
    width: 500px;
    height: 458px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
    margin-left: 195px;
    box-sizing: border-box;
    /* padding: 0px 0 0 30px; */
    z-index: 1;
    position: relative;

    &.active {
      height: 556px;
    }

    .progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 4px;
      background: rgba(81, 83, 229, 1);
      width: 112px;
    }

    .last-btn {
      padding-top: 24px;
      margin-left: 16px;
      cursor: pointer;
    }

    .right-bottom {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 120px;
      height: 140px;
      background: url("~@/assets/publicity-web/icon-right.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .topic-con {
      width: 100%;
      height: 347px;
      padding: 50px 0 0 30px;
      box-sizing: border-box;

      &.con-height {
        padding-top: 40px;
        height: 320px;
      }

      .success {
        padding: 15px 0 0 12px;
      }

      .topic-text {
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
        line-height: 30px;
      }
    }
  }

  .next-btn {
    width: 160px;
    height: 48px;
    background: #ccc;
    border-radius: 4px;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-family: FrutigerCE-Bold, FrutigerCE;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    margin-left: 30px;
    cursor: not-allowed;

    &.active {
      cursor: pointer;
      background: rgba(81, 83, 229, 1);

      &:hover {
        background: #4B4DE1;
      }
    }

    &.high {
      margin-top: 86px;
    }
  }

  .part-in {
    margin-top: 29px;
  }

  /deep/ .el-radio-button__inner {
    border-radius: 5px !important;
    border: 1px solid hsl(222, 17%, 88%) !important;
  }

  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    border: none !important;
  }

  .select-margin {
    margin-top: 20px;
  }

  .radio-con {
    border-radius: 5px !important;
    margin-right: 12px;
    margin-top: 10px;
  }

  .select-con {
    width: 80px;
    margin-right: 12px;
    /* &:last-child {
      margin-right: 0;
    } */
  }

  .text-top {
    margin-top: 42px;
  }

  .success {

    .success-bottom {
      margin-top: 28px;

      .bottom-title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(208, 2, 27, 1);
        line-height: 24px;
      }

      .bottom-text {
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.6);
        line-height: 24px;
      }
    }

    .success-title-con {
      font-size: 28px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      line-height: 40px;
    }

    .success-text {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.6);
      line-height: 30px;
    }

    .success-content {
      margin-top: 24px;
      align-items: center;

      img {
        width: 104px;
        height: 104px;
      }

      .content {
        margin-left: 18px;

        .success-content-con {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.8);
          line-height: 24px;
        }

        .success-content-text {
          font-size: 14px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(0, 0, 0, 0.6);
          line-height: 21px;
        }
      }
    }
  }

  .fail {
    .fail-content {
      font-size: 28px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      line-height: 40px;
    }

    .fail-title {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
      line-height: 27px;
    }

    .fail-down {
      margin-top: 41px;

      .fail-down-text {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 24px;
      }

      .fail-down-text-con {
        margin-top: 10px;
        font-size: 16px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.5);
        line-height: 35px;
      }
    }

    .end-text {
      margin-top: 19px;
      font-size: 14px;
      font-family: PingFangSC-Light, PingFang SC;
      font-weight: 300;
      color: rgba(0, 0, 0, 0.79);
      line-height: 21px;
    }
  }

    .choose-score {
      color: red;
    }
</style>