<template>
  <div class="collect-wrap">
    <div class="collect-content">
      <!-- 面包屑 -->
      <!-- 下半部分 -->
      <div class="collect-topic flex-wrap">
        <div class="left-bottom"></div>
        <div class="left-top"></div>
        <!-- 左边 -->
        <div class="topic-left">
          <h3 class="title"></h3>
          <p class="title-text">
            <span class="first-line">Welcome,</span><br />
            <span class="second-line">欢迎参与TOEFL GoSpeak 1.0 版本测试</span><br />
            <span class="three-line">为了筛选本次体验资格，请如实回答左侧问题</span><br />
            <span class="four-line" v-show="tabIndex == 0">*填写信息将仅用于本次报名</span>
          </p>
        </div>
        <t-topic @tabChange="tabChange"></t-topic>
      </div>
    </div>
  </div>
</template>

<script>
  import TTopic from '../components/topic.vue'
  export default {
    name: '',
    data() {
      return {
        tabIndex: 0,
      }
    },
    methods:{
      /**
       * 接收到的变化值
      */
      async tabChange(item){
        this.tabIndex = item;
        let queryData = JSON.parse(JSON.stringify(this.$route.query));
        queryData.index = this.tabIndex + 1;
        this.$router.push({
          query: queryData
        })
      }
    },
    components: {
      TTopic
    }
  }
</script>

<style scoped lang="scss">
  .flex-wrap {
    display: flex;
    /* align-items: center; */
  }

  .topic-left {
    margin-top: -10px;
  }

  .collect-wrap {
    width: 100%;
    background: #fff;

    .collect-content {
      width: 1180px;
      margin: 0 auto;
      padding: 31px 0 73px;
      box-sizing: border-box;
      position: relative;
      z-index: 1;
    }
  }

  .collect-topic {
    margin-top: 39px;

    .left-bottom {
      position: absolute;
      left: -245px;
      bottom: 0;
      width: 376px;
      height: 172px;
      background: url("~@/assets/publicity-web/dec-icon2.png") no-repeat center center;
      background-size: 100% 100%;
      z-index: -1;
    }

    .left-top {
      position: absolute;
      right: 69px;
      top: 0;
      width: 473px;
      height: 160px;
      background: url("~@/assets/publicity-web/dec-icon1.png") no-repeat center center;
      background-size: 100% 100%;
      z-index: -1;
    }

    .title {
      width: 63px;
      height: 63px;
      background: url("~@/assets/publicity-web/jason.png") no-repeat center center;
      background-size: 100% 100%;
      margin-top: 60px;
    }

    .title-text {
      margin-top: 9px;

      .first-line {
        font-size: 36px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.8);
        line-height: 60px;
      }

      .second-line {
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 40px;
      }

      .three-line {
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.66);
        line-height: 27px;
      }

      .four-line {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.4);
        line-height: 21px;
      }
    }
  }
</style>