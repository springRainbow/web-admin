<template>
  <!-- <div class="collect-wrap"> -->
    <div class="collect-wrap" v-if="loadingBool">
    <div class="top-bg"></div>
    <div class="top-bg2" v-if="$route.query.index == 1 || $route.query.index == 6"></div>
    <div class="collect-first" v-show="$route.query.index == 1">
      <div class="collect-wrap-con">
        <p class="collect-title-icon"></p>
        <p class="collect-title">
          <span class="collect-title-con">Welcome，</span><br />
          <span class="collect-title-text">欢迎参与TOEFL GoSpeak 1.0 版本测试</span><br />
        </p>
        <p class="collect-text">为了筛选本次体验资格<br /> 请如实回答以下问题</p>
        <p class="collect-text-con">*填写信息将仅用于本次报名</p>
      </div>
      <div class="start-btn" @click="startAnswer">开始答题</div>
    </div>
    <div class="collect-step" v-show="$route.query.index > 1">
      <div class="collect-top flex-wrap">
        <div class="top-progress"></div>
      </div>
      <!-- 题目 -->
      <div class="question-content-wrap">
        <div class="question-con" v-show="$route.query.index == 2">
          <h3 class="question-text">你是否曾参加过TOEFL iBT 考试？</h3>
          <div class="part-in">
            <el-radio-group @change="changeBtn" v-model="submitData.toefl_is_examed">
              <el-radio-button class="radio-con" v-for="(item,key,index) in collectData.toefl_is_examed" :label="key"
                :value="item" :key="key">{{item}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="question-con" v-show="$route.query.index == 3">
          <h3 class="question-text">上一次考试的时间</h3>
          <div class="part-in">
            <el-date-picker format="yyyy / MM / dd " value-format="yyyy-MM-dd" @change="changeBtn(item,'exam')"
              v-model="submitData.toefl_last_date" type="date" placeholder="选择日期">
            </el-date-picker>
          </div>
          <h3 class="question-text text-top">考试成绩</h3>
          <div class="part-in radio-wrap flex-wrap">
            <div class="option" v-for="(item,key,index) in collectData.toefl_last_scores">
              <p class="subject">{{item}}</p>
              <el-select filterable @change="changeBtn(item,'exam')" class="select-con" v-if="index == 0" v-model="submitData.toefl_last_scores[0]"
                placeholder=" ">
                <el-option v-for="item in 120" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-select filterable @change="changeBtn(item,'exam')" class="select-con" v-if="index == 1" v-model="submitData.toefl_last_scores[5]"
                placeholder=" ">
                <el-option v-for="item in 30" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-select filterable @change="changeBtn(item,'exam')" class="select-con" v-if="index == 2" v-model="submitData.toefl_last_scores[6]"
                placeholder=" ">
                <el-option v-for="item in 30" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-select filterable @change="changeBtn(item,'exam')" class="select-con" v-if="index == 3" v-model="submitData.toefl_last_scores[7]"
                placeholder=" ">
                <el-option v-for="item in 30" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-select filterable @change="changeBtn(item,'exam')" class="select-con" v-if="index == 4" v-model="submitData.toefl_last_scores[8]"
                placeholder=" ">
                <el-option v-for="item in 30" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="question-con con-height" v-show="$route.query.index == 4">
          <p class="question-text">
            距离下次考试还有
          </p>
          <div class="part-in">
            <el-radio-group @change="changeBtn" v-model="submitData.toefl_next_diff">
              <el-radio-button class="radio-con" v-for="(item,key,index) in collectData.toefl_next_diff" :label="key"
                :value="item" :key="key">{{item}}</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="question-con con-height" v-show="$route.query.index == 5">
          <p class="question-text">
            你的当前的职业是
          </p>
          <div class="part-in">
            <el-radio-group @change="changeBtn" v-model="submitData.identity">
              <el-radio-button class="radio-con" v-for="(item,key,index) in collectData.identity" :label="key"
                :value="item" :key="key">{{item}}</el-radio-button>
            </el-radio-group>
            <el-select class="select-margin" v-show="classBool" v-model="submitData.student_grade"
              placeholder="请选择你的年级">
              <el-option v-for="(item,key,index) in collectData.student_grade" :key="item" :label="item" :value="key">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="next-btn jion" v-if="submitData.toefl_is_examed == 1" :class="{active:nextBool}"
          v-show="$route.query.index >= 2 && $route.query.index < 5" @click="tabChange('next',$route.query.index,'jion')">Next</div>
        <div class="next-btn nojion" v-else :class="{active:nextBool}"
          v-show="$route.query.index >= 2 && $route.query.index < 5" @click="tabChange('next',$route.query.index,'noJion')">Next
        </div>
        <div class="next-btn" v-if="submitData.toefl_is_examed == 1" :class="{active:nextBool}" v-show="$route.query.index == 5"
          @click="tabChange('next',$route.query.index,'jion','submit')">Next</div>
          <div class="next-btn" v-else :class="{active:nextBool}" v-show="$route.query.index == 5"
          @click="tabChange('next',$route.query.index,'noJion','submit')">Next</div>
      </div>
      <div class="last-page-con" v-show="$route.query.index == 6">
        <div class="apply-success" v-if="is_beta == 1">
          <div class="success-top">
            <p class="success-title flex-wrap"><span class="success-icon"></span>报名成功！</p>
            <p class="success-title-text">请扫码添加工作人员，等待 App下载通知</p>
          </div>
          <div class="down-wrap">
            <h3 class="down-title">TOEFL GoSpeak! 小助手</h3>
            <div class="img-bg">
              <img src="@/assets/publicity-h5/ets-code.png" class="q-code" alt="">
            </div>
            <p class="down-text">GoSpeak 1.0 内测用户群</p>
            <p class="down-explain">工作人员会通知内测开始时间，<br />并发送 App 的下载链接</p>
            <p class="down-hit">
              未添加工作人员将无法参与 App 体验
              <!-- 若无法顺利加群，请添加微信好友YM_work<br /> 请工作人员拉你入群 -->
            </p>
          </div>
        </div>
        <div class="apply-success thanks" v-else>
          <div class="success-top">
            <p class="success-title flex-wrap">感谢支持！</p>
            <p class="success-title-text">非常遗憾，您本次未被选中内测。</p>
          </div>
          <div class="down-wrap">
            <p class="down-text">可能的原因包含：</p>
            <p class="down-explain thanks">1. 您所在的目标群体名额已满<br />2. 您并非本次内测目标群体</p>
            <p class="down-hit thanks">
              *敬请期待正式版上线。再次感谢您的支持！
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import VueCookie from 'vue-cookie';
  import axios from '@glo/kmf-axios';
  export default {
    name: '',
    data() {
      return {
        tabIndex: 1,
        collectData: {}, //信息收集数据
        submitData: {
          toefl_is_examed: '',
          toefl_last_date: '',
          toefl_next_diff: '',
          identity: '', //身份选项
          student_grade: '',
          toefl_last_scores: {
            0: 60,
            5: 15,
            6: 15,
            7: 15,
            8: 15
          },
        },
        loadingBool: false,
        classBool: false,
        nextBool: false,
        is_beta: '' //是否是内测用户
      }
    },
    created() {
      this.collectMsg(); //收集信息
      this.getAlreadyTest(); //获取是否已经内测
      

    },
    methods: {
      /**
       * 开始答题
      */
      startAnswer() {
        if(this.is_beta === 0 || this.is_beta == 1){
          this.tabIndex = 6;
          this.routerChange(this.tabIndex)
          return;
        }
        let queryData = JSON.parse(JSON.stringify(this.$route.query));
        queryData.index = Number(this.$route.query.index) + 1;
        this.$router.push({
          query: queryData
        })
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
                this.chooseScoreBool = true;
              } else {
                this.chooseScoreBool = false;
                this.nextBool = true;
              }
        } else {
          this.nextBool = true;
        }
      },
      /**
        * 收集信息
       */
      collectMsg() {
        var autheyCon = VueCookie.get('authkey') || this.$route.query.authkey;
        this.$http.get(api.getCollectMessage,{},{
          headers:{
            'Authorization':'Bearer ' + autheyCon
          }
        }).then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.collectData = Object.assign({}, this.collectData, res.result.collect_options);
          }
        }).catch((err) => { console.log(err) })
      },
      /**
       * 获取是否已经内测
      */
      getAlreadyTest() {
        var autheyCon = VueCookie.get('authkey') || this.$route.query.authkey;

        this.$http.get(api.getCollectIS,{},{
            headers:{
            'Authorization':'Bearer ' + autheyCon
          }
        }).then((res) => {
          // console.log(res)
          if (res.status == 200) {
            this.loadingBool = true;
            if (res.result.beta_status == 1 || res.result.beta_status == 0) {
              this.tabIndex = 6;
              this.is_beta = res.result.beta_status;
              this.routerChange(this.tabIndex)
            }
          }
        }).catch((err) => { console.log(err) })
      },
      /**
       * 下一题上一题切换
      */
      tabChange(type, index, jion, submit) {
        if (jion == "noJion") {
          this.submitData.toefl_last_scores = '';
          this.submitData.toefl_last_date = ''
          if (type == "last") {
            if (this.tabIndex > 3) {
              this.tabIndex = Number(index) - 1;
            } else {
              this.tabIndex = Number(index) - 2;
            }
          } else if (type == "next") {
            if (this.nextBool == false) return;
            this.nextBool = false;
            this.tabIndex = this.$route.query.index;
            if (this.tabIndex >= 3) {
              this.tabIndex = Number(index) + 1;
            } else {
              this.tabIndex = Number(index) + 2;
            }
            this.tabIndex > 6 ? this.tabIndex = 6 : '';
            if (
              window.kmfSensors &&
              Object.prototype.toString.call(window.kmfSensors) ===
              "[object Object]"
            ) {
              window.kmfSensors.track("App元素点击", {
                project: "ets",
                platform: "h5",
                product_line: "ets-h5",
              });
            }
          }
          this.routerChange(this.tabIndex)
        } else if (jion == "jion") {
          // this.submitData.toefl_last_scores = {
          //   0: 60,
          //   5: 15,
          //   6: 15,
          //   7: 15,
          //   8: 15
          // }
          if (type == "last") {
            this.tabIndex = Number(index) - 1;
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
                platform: "h5",
                product_line: "ets-h5",
              });
            }
            this.tabIndex = Number(index) + 1;
            this.tabIndex > 6 ? this.tabIndex = 6 : '';
          }
          this.routerChange(this.tabIndex)
        }
        if (submit == 'submit') {
          if(jion == "noJion"){
            this.submitData.toefl_last_scores = '';
            this.submitData.toefl_last_date = ''
          }
          if (this.submitData.toefl_last_scores) {
            this.submitData.toefl_last_scores = JSON.stringify(this.submitData.toefl_last_scores)
          }
          let submitAll = JSON.parse(JSON.stringify(this.submitData))
          submitAll.toefl_is_examed = Number(submitAll.toefl_is_examed);
          submitAll.toefl_next_diff = Number(submitAll.toefl_next_diff);
          submitAll.student_grade = Number(submitAll.student_grade);
          submitAll.identity = Number(submitAll.identity);
          var autheyCon = VueCookie.get('authkey') || this.$route.query.authkey;
          this.$http._post(api.submitCollectMessage, submitAll,{
            headers:{
              'Authorization':'Bearer ' + autheyCon
            }
          }).then((res) => {
            if (res.status == 200) {
              this.is_beta = res.result.is_beta;
              this.tabIndex = Number(index) + 1;
              this.tabIndex > 6 ? this.tabIndex = 6 : '';
              this.routerChange(this.tabIndex)
            }
          }).catch((err) => { console.log(err) });
        }
      },
      /**
       * 路由参数改变
      */
     routerChange(item){
      let queryData = JSON.parse(JSON.stringify(this.$route.query));
        queryData.index = item;
        this.$router.push({
          query: queryData
        })
     }
    },
    components: {
      // TTopic
    }
  }
</script>

<style scoped lang="scss">
  .flex-wrap {
    display: flex;
    /* align-items: center; */
  }

  .collect-wrap {
    width: 100%;
    height: 100vh;
    padding: 0 5%;
    box-sizing: border-box;
    background: #fff;
    position: relative;
    z-index: 1;

    .top-bg {
      position: absolute;
      right: 0;
      top: 0;
      width: 243px;
      height: 130px;
      background: url("~@/assets/publicity-h5/icon-bg.png") center center no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }

    .top-bg2 {
      position: absolute;
      right: 0;
      top: 50vh;
      width: 169px;
      height: 260px;
      background: url("~@/assets/publicity-h5/icon-eng.png") center center no-repeat;
      background-size: 100% 100%;
      z-index: -1;
    }

  }

  .collect-wrap-con {
    height: 100vh;
    box-sizing: border-box;
    padding-top: 21vh;

    .collect-title-icon {
      width: 66px;
      height: 66px;
      background: url("~@/assets/publicity-h5/robot.png") center center no-repeat;
      background-size: 100% 100%;
      margin-bottom: 24px;
    }
  }

  .select-margin {
    margin-top: 20px;
  }

  .collect-title {
    margin-bottom: 27px;
  }

  .collect-title-con {
    font-size: 40px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.8);
    line-height: 60px;
  }

  .collect-title-text {
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 1);
    line-height: 40px;
  }

  .collect-text {
    font-size: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.7);
    line-height: 30px;
  }

  .collect-text-con {
    font-size: 14px;
    font-family: PingFangSC-Light, PingFang SC;
    font-weight: 300;
    color: rgba(0, 0, 0, 0.4);
    line-height: 42px;
  }

  .start-btn {
    position: absolute;
    bottom: 8vh;
    left: 50%;
    margin-left: -155px;
    width: 309px;
    height: 47px;
    background: rgba(70, 72, 225, 1);
    border-radius: 24px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 47px;
    text-align: center;
  }

  .radio-con {
    border-radius: 5px !important;
    margin-right: 12px;
    margin-top: 10px;
  }

  /deep/ .el-radio-button__inner {
    border-radius: 5px !important;
    border: 1px solid hsl(222, 17%, 88%) !important;
  }

  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
    border: none !important;
  }

  .next-btn {
    width: 309px;
    height: 47px;
    background: rgba(219, 219, 219, 1);
    border-radius: 47px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.2);
    line-height: 47px;
    text-align: center;
    position: absolute;
    bottom: 8vh;
    left: 50%;
    margin-left: -155px;

    &.active {
      cursor: pointer;
      background: rgba(81, 83, 229, 1);
      color: #fff;
    }
  }

  .radio-wrap {
    flex-wrap: wrap;
  }

  .select-con {
    width: 80px;
    margin-right: 12px;
    margin-bottom: 15px;
  }

  .text-top {
    margin-top: 42px;
  }

  .question-con {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    padding: 18vh 0 0 8%;
    position: relative;

    .question-text {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
      line-height: 25px;
      margin-bottom: 36px;
    }
  }

  .last-page-con {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;

    .apply-success {
      width: 100%;
      height: 100vh;
      box-sizing: border-box;
      padding: 10vh 5% 0;
      text-align: center;
      &.thanks {
        text-align: left;
      }
    }

    .success-icon {
      width: 48px;
      height: 48px;
      display: inline-block;
      background: url("~@/assets/publicity-h5/success.png") center center no-repeat;
      background-size: 100% 100%;
      margin-right: 8px;
    }

    .success-title {
      justify-content: center;
      align-items: center;
      font-size: 28px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
      line-height: 30px;
    }

    .success-title-text {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.8);
      line-height: 30px;
      margin-bottom: 40px;
      text-align: center;
    }

    .down-wrap {
      width: 100%;
      height: 74vh;
      box-sizing: border-box;
      background: url("~@/assets/publicity-h5/bg-box.png") center center no-repeat;
      background-size: 100% 100%;
      padding: 50px 0 0 18px;

      .down-title {
        font-size: 14px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 92, 92, 1);
        line-height: 20px;
        letter-spacing: 1px;
        margin-bottom: 15px;
      }

      .img-bg {
        width: 155px;
        height: 155px;
        background: #F5F5FF;
        box-sizing: border-box;
        padding: 8px 0 0 0;
        margin: 0 auto 15px;

        img {
          width: 141px;
          height: 141px;
          margin: 0 auto;
        }
      }

      .down-text {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 21px;
        letter-spacing: 1px;
        margin-bottom: 8px;
      }

      .down-explain {
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.6);
        line-height: 21px;
        letter-spacing: 1px;
        margin-bottom: 51px;
        &.thanks {
          margin-bottom: 24px;
        }
      }

      .down-hit {
        width: 298px;
        height: 74px;
        background: rgba(249, 249, 255, 1);
        border-radius: 4px;
        box-sizing: border-box;
        padding: 16px 13px;
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.6);
        line-height: 21px;
        &.thanks {
          background: #fff;
          padding: 0;
        }
      }
    }
  }
</style>