<template>
  <div class="mobile-home-wrap">
    <div class="top-bg"></div>
    <div class="mark-wrap" v-show="dialogBool">
      <div class="mark-con">
        <div class="mark-top-icon"></div>
        <section class="mark-text-wrap">
          <h3 class="mark-title">请登录考满分账号</h3>
          <p class="mark-text">为了标记体验官资格，<br />需要先登录你的考满分账号</p>
          <p class="mark-text-con">TOEFL GoSpeak 中所有教学内容，<br />由 ETS 独家版权所有</p>
        </section>
        <div class="mark-apply-btn" @click="loginTo">去登录/注册</div>
        <div class="close-btn" @click="dialogBool = !dialogBool"></div>
      </div>
    </div>
    <div class="mobile-home-con">
      <h3 class="title-icon"></h3>
      <p class="text-icon"></p>
      <p class="title-text">招募产品体验官</p>
      <div class="top-div flex-wrap">
        <div class="left-icon"></div>
        <div class="right-text-wrap">
          <h3 class="right-title">TOEFL GoSpeak !</h3>
          <p class="right-text">从 0 开始<br /></h3> 让 ETS 爸爸带你攻克口语难题</p>
        </div>
      </div>
      <div class="order-icon"></div>
      <!-- 下半部分 -->
      <div class="content-bottom">
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
      <div class="apply-btn" @click="applyTo">报名体验</div>
    </div>
  </div>
</template>

<script>
  import VueCookie from 'vue-cookie';
  export default {
    name: '',
    data() {
      return {
        dialogBool: false,
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
            platform: "h5",
            product_line: "ets-h5",
          }); 
        }
        // console.log(VueCookie.get('authkey'))
        // console.log(this.$route.query.authkey)
        if (VueCookie.get('authkey') == null && this.$route.query.authkey == undefined) {
          // if (VueCookie.get('authkey') == null ) {
          this.dialogBool = true;
        } else {

          this.queryData = JSON.parse(JSON.stringify(this.$route.query))
          this.queryData.index = 1;
          this.$router.push({
            path: "/publicity/mobile-collect",
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
    },
    components: {

    }
  }
</script>

<style scoped lang="scss">
  .flex-wrap {
    display: flex;
  }

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

  .mobile-home-wrap {
    width: 100%;
    position: relative;
    z-index: 1;
    /* height: 100vh; */
    box-sizing: border-box;
    padding: 32px 5% 0;
    background: #fff;
  }

  .mobile-home-con {
    width: 100%;
    padding-bottom: 160px;

    .order-icon {
      height: 650px;
      width: 100%;
      background: url("~@/assets/publicity-h5/content.png") center center no-repeat;
      background-size: 100% 650px;
      margin-top: 45px;
      margin-bottom: 64px;
    }

    .title-icon {
      width: 78px;
      height: 31px;
      background: url("~@/assets/publicity-h5/big-message.png") center center no-repeat;
      background-size: 100% 100%;
      margin-bottom: 16px;
    }

    .text-icon {
      width: 276px;
      height: 84px;
      background: url("~@/assets/publicity-h5/icon-title.png") center center no-repeat;
      background-size: 100% 100%;
      margin-bottom: 16px;
    }

    .title-text {
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.8);
      line-height: 34px;
      margin-bottom: 24px;
    }
  }

  .content-bottom {
    /* margin-top: 167px; */

    .bottom-left {
      &.right {
        width: 100%;
        margin-left: 0;

        h3 {
          background: linear-gradient(313deg, rgba(251, 226, 131, 1) 0%, rgba(251, 159, 57, 1) 100%);
        }

        &:last-child {
          margin-top: 94px;
        }
      }

      width: 100%;
      /* height: 164px; */
      background:rgba(247, 249, 251, 1);
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

  .top-div {

    .left-icon {
      width: 75px;
      height: 75px;
      background: url("~@/assets/publicity-h5/icon-home-title.png") center center no-repeat;
      background-size: 100% 100%;
    }

    .right-text-wrap {
      margin-left: 21px;

      .right-title {

        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
        line-height: 28px;
      }

      .right-text {
        font-size: 14px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.8);
        line-height: 20px;
      }
    }
  }

  .apply-btn {
    position: fixed;
    bottom: 8vh;
    left: 50%;
    margin-left: -155px;
    width: 309px;
    height: 47px;
    background: rgba(70, 72, 225, 1);
    border-radius: 47px;
    line-height: 47px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    z-index: 1;
  }

  .mark-wrap {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;

    .mark-con {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -152px;
      margin-top: -151px;
      width: 303px;
      height: 302px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      text-align: center;

      .mark-top-icon {
        box-sizing: border-box;
        margin-top: -42px;
        margin-bottom: 9px;
        width: 100%;
        height: 104px;
        background: url("~@/assets/publicity-h5/mark-top.png") center center no-repeat;
        background-size: 306px 104px;
      }

      .mark-title {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.8);
        line-height: 27px;
        margin-bottom: 12px;
      }

      .mark-text {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 23px;
        margin-bottom: 10px;
      }

      .mark-text-con {
        font-size: 12px;
        font-family: PingFangSC-Light, PingFang SC;
        font-weight: 300;
        color: rgba(0, 0, 0, 0.6);
        line-height: 18px;
        margin-bottom: 23px;
      }

      .mark-apply-btn {
        width: 260px;
        height: 46px;
        background: rgba(81, 83, 229, 1);
        border-radius: 4px;
        margin: 0 auto;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 46px;
        letter-spacing: 1px;
      }

      .close-btn {
        position: absolute;
        bottom: -60px;
        left: 50%;
        margin-left: -20px;
        width: 40px;
        height: 40px;
        background: url("~@/assets/publicity-h5/icon-close.png") center center no-repeat;
        background-size: 100% 100%;
      }
    }
  }
</style>