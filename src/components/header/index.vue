<template>
  <div class="g-www-header">
    <div class="outer g-clearfix">
      <h1 class="ct-logo">
        <a href="javascript:;" class="logo">考满分</a>
      </h1>
      <ul class="navigator fl">
        <li>
          <a target="_blank" :href="tofelLink" class="nav">TOEFL</a>
        </li>
        <li>
          <a target="_blank" :href="greLink" class="nav">GRE</a>
        </li>
        <li>
          <a target="_blank" :href="ieltsLink" class="nav">IELTS</a>
        </li>
        <li>
          <a target="_blank" :href="gmatLink" class="nav">GMAT</a>
        </li>
        <li>
          <a target="_blank" :href="courseLink" class="nav">课程</a>
        </li>
        <li>
          <a target="_blank" :href="vocabularyLink" class="nav">词汇</a>
        </li>
        <li>
          <a target="_blank" :href="activityLink" class="nav">活动</a>
        </li>
        <li>
          <a target="_blank" :href="classLink" class="nav">公开课</a>
        </li>
      </ul>
      <div class="asidecol fr" @mouseover="showSub" @mouseleave="hideSub">
        <ul v-if="status!='401'" class="aside-menu">
          <li class="menu hasnav user-info" id="js-sys-message">
            <a href="javascript:;" class="nav avatar-wrap">
              <img class="avatar" v-if="avator" :src="avator" />
              <img class="avatar" v-else src="~@/assets/header/avator_default.jpg" />
              <span class="msg-count message-count"></span>
            </a>
            <div class="sub-nav" v-show="isShow">
              <a target="_blank" :href="myCourseLink" class="sub-nav-menu mycourse">我的课程</a>
              <a target="_blank" :href="msgLink" class="sub-nav-menu message">
                消息
                <span class="msg-count message-count"></span>
              </a>
              <a target="_blank" :href="accountUrl" class="sub-nav-menu account">帐号管理</a>
              <div class="loginout">
                <a :href="logOutUrl" class="lk-loginout">退出登录</a>
              </div>
            </div>
          </li>
        </ul>
        <div class="login-wrap" v-else>
          <a href="javascript:void(0)" @click="login" class="btn-login js-kmf-login">登录</a>
          <a :href="registerUrl" class="btn-register" target="_blank">注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "@/api/index.js";
  import vueCookie from "vue-cookie";
  export default {
    data() {
      return {
        status: '', //是否登录
        avator: "", //头像
        tofelLink: process.env.VUE_APP_PRFIEX + "toefl.kmf.com",
        greLink: process.env.VUE_APP_PRFIEX + "gre.kmf.com",
        ieltsLink: process.env.VUE_APP_PRFIEX + "ielts.kmf.com",
        gmatLink: process.env.VUE_APP_PRFIEX + "gmat.kmf.com",
        courseLink: process.env.VUE_APP_PRFIEX + "course.kmf.com", //课程
        vocabularyLink: process.env.VUE_APP_PRFIEX +
          "www.kmf.com/static/appcenter?website=toeflwords", //词汇
        activityLink: "", //活动
        classLink: process.env.VUE_APP_PRFIEX + "ke.kmf.com/open?from=www", //公开课
        myCourseLink: process.env.VUE_APP_PRFIEX + "ke.kmf.com/coursecenter", //我的课程
        msgLink: process.env.VUE_APP_PRFIEX + "msg.kmf.com/msg?s=-1", //消息
        accountUrl: process.env.VUE_APP_PRFIEX + "account.kmf.com/accountmanage/security", //帐号管理
        logOutUrl: process.env.VUE_APP_PRFIEX + "account.kmf.com/logout?backurl=" + encodeURIComponent(location.href),
        registerUrl: process.env.VUE_APP_PRFIEX + 'test-account.kmf.com/register',
        isShow: false //是否显示
      };
    },
    created() {
      if (vueCookie.get('authkey') != null) {
        this.getUerInfo();
      } else {
        this.status = '401';
      }


    },
    methods: {
      showSub() {
        this.isShow = true;
      },
      hideSub() {
        this.isShow = false;
      },
      login() {
        window.location.href = process.env.VUE_APP_PRFIEX + "account.kmf.com/login?backurl=" + encodeURIComponent(location.href);
      },
      //获取用户信息
      getUerInfo() {
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + this.$cookie.get('authkey');
        this.$http._get(api.getInfoBase).then(res => {

          if (res == '401') {
            this.status = res;
          }

          if (res.status == 200) {
            this.avator = res.result.pic_url;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .g-www-header {
    min-width: 1180px;
    width: 100%;
    height: 80px;
    background: #fff;

    .outer {
      width: 1180px;
      margin: 0 auto;
      color: #fff;
      position: relative;

      .ct-logo {
        float: left;
        width: 180px;
        height: 80px;
        margin-right: 40px;
      }

      .logo {
        width: 172px;
        height: 64px;
        overflow: hidden;
        display: block;
        background: url("~@/assets/header/logo.png") no-repeat;
        text-indent: -9999px;
        background-size: cover;
        margin-top: 8px;
      }

      .navigator {
        line-height: 80px;

        li {
          float: left;
          margin-right: 33px;
          font-size: 18px;

          a {
            color: #333;
            text-decoration: none;
            outline: none;

            &:hover {
              color: #419cff;
              text-decoration: underline;
            }
          }
        }
      }
    }

    .asidecol {
      &:hover {
        .user-info .avatar-wrap::before {
          transform: rotate(180deg);
        }
      }

      .user-info {
        padding-top: 18px;
        position: absolute;
        right: 0;

        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          position: absolute;
        }

        .nav .msg-count {
          left: 32px;
          top: -4px;
        }

        .avatar-wrap {
          position: relative;
          width: 44px;
          height: 57px;
          padding-right: 16px;
          display: block;

          &::before {
            content: "";
            position: absolute;
            right: 0;
            top: 22px;
            border-width: 4px 4px 0;
            border-style: solid;
            border-color: #333 transparent transparent;
            -webkit-transition: all 0.25s ease-in-out;
            transition: all 0.25s ease-in-out;
          }
        }
      }

      .sub-nav {
        position: absolute;
        top: 70px;
        right: 0;
        z-index: 10;
        width: 200px;
        padding: 4px 14px 18px;
        border-top: 1px solid #419cff;
        background: #fff;
        overflow: hidden;
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.08);

        .loginout {
          padding-top: 14px;
          text-align: right;
        }

        .sub-nav-menu {
          position: relative;
          height: 60px;
          padding-left: 38px;
          display: block;
          border-bottom: 1px dotted #e2e2e2;
          line-height: 60px;
          font-size: 16px;

          &::before {
            content: '';
            position: absolute;
            left: 8px;
            top: 23px;
            background: url('~@/assets/header/kmf_icon.png') no-repeat;
            display: block;
            width: 18px;
            height: 18px;
          }

          &.mycourse::before {
            background-position: 0 -110px;
          }

          &.mycourse:hover::before {
            background-position: 0 -135px;
          }

          &.message::before {
            background-position: -27px -110px;
          }

          &.message:hover::before {
            background-position: -27px -135px;
          }

          &.account::before {
            background-position: -55px -110px;
          }

          &.account:hover::before {
            background-position: -55px -135px;
          }
        }
      }

      .login-wrap {
        margin-top: 20px;

        a {
          width: 68px;
          height: 28px;
          margin-left: 8px;
          display: inline-block;
          border-radius: 2px;
          line-height: 28px;
          color: #666;
          text-align: center;
          cursor: pointer;

          &.btn-login {
            border: 1px solid #999;
            background: #fff;
          }

          &.btn-register {
            border: 1px solid #4c91ff;
            background: #4c91ff;
            color: #fff;
          }
        }
      }
    }
  }
</style>