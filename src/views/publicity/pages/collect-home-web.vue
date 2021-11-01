<template>
  <div class="publicity-wrap">
    <div class="publicity-content">
      <!-- dialog蒙版 -->
      <div class="mark-wrap" v-show="dialogBool">
        <div class="mark-content">
          <div class="top-icon">
            <p class="close-icon" @click="dialogBool = !dialogBool"></p>
          </div>
          <section class="text-wrap">
            <h3>请登录考满分账号</h3>
            <p class="text-con">为了标记体验官资格，<br />
              需要先登录你的考满分账号</p>
            <p class="text-bot">
              TOEFL GoSpeak 中所有教学内容，<br />由 ETS 独家版权所有</p>
          </section>
          <p class="login-button" @click="loginTo">去登录/注册</p>
        </div>
      </div>
      <!-- 上半部分 -->
      <div class="content-top">
        <div class="dec-icon1"></div>
        <div class="top-right-icon"></div>
        <p class="title-icon-mes"></p>
        <h3 class="title-icon"></h3>
        <p class="title-text"></p>
        <div class="top-con flex-wrap">
          <div class="con-top-left"></div>
          <div class="con-top-right">
            <h3 class="con-top-title">TOEFL GoSpeak !</h3>
            <p class="con-top-text">从 0 开始，让 ETS 爸爸带你攻克口语难题</p>
          </div>
        </div>
        <div class="apply-button" @click="applyTo">报名体验</div>
      </div>
      <!-- 下半部分 -->
      <div class="content-bottom flex-wrap">
        <div class="bottom-left">
          <h3>参与流程</h3>
          <p class="bottom-text">
            1.点击上方按钮报名 <br />
            2.填写报名问卷 <br />
            3.扫码加群，等待App下载通知
          </p>
        </div>
        <div class="bottom-left right">
          <h3>注意事项</h3>
          <p class="bottom-text">
            1.目前产品还不完善，如果发现任何问题，希望大家能够给出真诚的反馈 <br />
            2.如果即同意保密协议，若涉及商业机密泄露，ETS有权追究其法律责任 <br />
            3.如有任何问题，请邮件至 fb-kmf@100tal.com
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/api';
  import VueCookie from 'vue-cookie';
  export default {
    name: 'publicity',
    data() {
      return {
        dialogBool: false,
        queryData: ''
      }
    },
    methods: {
      /**
       * 报名体验
      */
      applyTo() {
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
        if (VueCookie.get('authkey') == null) {
          this.dialogBool = true;
        } else {
          
          this.queryData = JSON.parse(JSON.stringify(this.$route.query))
          this.queryData.index = 1;
          this.$router.push({
            path: "/publicity/collect",
            query: this.queryData
          })
        }
      },
      /**
       * 登录注册
      */
      loginTo() {
        window.location.href = process.env.VUE_APP_PRFIEX + "account.kmf.com/login?backurl=" + encodeURIComponent(location.href);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .flex-wrap {
    display: flex;
    align-items: center;
  }

  .top-con {
    margin-top: 37px;
  }

  .publicity-wrap {
    background: #fff;
    padding: 0 0 89px 0;

    .publicity-content {
      margin: 0 auto;
      width: 1180px;
      box-sizing: border-box;
      padding-top: 62px;
      position: relative;
      z-index: 1;

      .content-top {
        position: relative;
        z-index: 1;
      }

      .top-right-icon {
        position: absolute;
        right: -63px;
        top: 23px;
        z-index: 10;
        width: 678px;
        height: 362px;
        background: url("~@/assets/publicity-web/right-icon.png") no-repeat center center;
        background-size: 100% 100%;
      }

      .dec-icon1 {
        position: absolute;
        top: -79px;
        right: 150px;
        z-index: 5;
        width: 473px;
        height: 160px;
        background: url("~@/assets/publicity-web/dec-icon1.png") no-repeat center center;
        background-size: 100% 100%;
      }
    }
  }

  .content-top {

    .title-icon-mes {
      width: 142px;
      height: 56px;
      background: url("~@/assets/publicity-web/title-icon.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .title-icon {
      width: 582px;
      height: 120px;
      margin-top: 18px;
      background: url("~@/assets/publicity-web/title-text.png") no-repeat center center;
      background-size: 100% 100%;
    }

    .con-top-left {
      width: 81px;
      height: 81px;
      background: url("~@/assets/publicity-web/icon-logo.png") no-repeat center center;
      background-size: 100% 100%;
      margin-right: 16px;
    }

    .con-top-title {
      font-size: 26px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(67, 67, 67, 1);
      line-height: 35px;
    }

    .con-top-text {
      margin-top: 8px;
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(67, 67, 67, 1);
      line-height: 28px;
    }

    .apply-button {
      width: 206px;
      height: 56px;
      background: rgba(70, 72, 225, 1);
      box-shadow: 0px 12px 18px -6px rgba(62, 80, 255, 0.74);
      border-radius: 8px;
      opacity: 0.85;
      filter: blur(0px);
      text-align: center;
      font-size: 22px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 56px;
      cursor: pointer;
      margin-top: 44px;

      &:hover {
        opacity: .9;
      }
    }
  }

  .content-bottom {
    margin-top: 167px;

    .bottom-left {
      &.right {
        width: 582px;
        margin-left: 64px;

        h3 {
          background: linear-gradient(313deg, rgba(251, 226, 131, 1) 0%, rgba(251, 159, 57, 1) 100%);
        }
      }

      width: 500px;
      height: 164px;
      background: rgba(247, 249, 251, 1);
      box-sizing: border-box;
      padding: 42px 0 0 20px;
      position: relative;

      h3 {
        position: absolute;
        top: -23px;
        left: 0;
        width: 126px;
        height: 46px;
        background: linear-gradient(314deg, rgba(100, 90, 255, 1) 0%, rgba(165, 115, 255, 1) 100%);
        border-radius: 120px 120px 120px 0px;
        font-size: 20px;
        font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        line-height: 46px;
        text-align: center;
        letter-spacing: 1px;
      }

      .bottom-text {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 1);
        line-height: 32px;
      }
    }
  }

  /* mark蒙版 */
  .mark-wrap {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);

    .mark-content {
      width: 427px;
      height: 386px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.04);
      border-radius: 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -213px;
      margin-top: -223px;

      .top-icon {
        width: 427px;
        height: 156px;
        background: url("~@/assets/publicity-web/k-icon.png") no-repeat center center;
        background-size: 100% 100%;
        position: absolute;
        top: -59px;
        left: 0;

        .close-icon {
          width: 20px;
          height: 20px;
          background: url("~@/assets/publicity-web/close.png") no-repeat center center;
          background-size: 100% 100%;
          position: absolute;
          top: 76px;
          right: 20px;
          cursor: pointer;
        }
      }

      .text-wrap {
        margin-top: 114px;
        text-align: center;
      }

      h3 {
        font-size: 26px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
        line-height: 40px;
      }

      .text-con {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 27px;
        margin-top: 9px;
      }

      .text-bot {
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.5);
        line-height: 21px;
        margin-top: 14px;
      }

      .login-button {
        width: 316px;
        height: 48px;
        background: rgba(81, 83, 229, 1);
        border-radius: 4px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 48px;
        margin: 28px auto 0;
        cursor: pointer;

        &:hover {
          opacity: .9;
        }
      }
    }
  }
</style>