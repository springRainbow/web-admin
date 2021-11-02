<template>
  <div id="app">
    <div
      v-if="
        $route.query.publicity_type == 1 || $route.query.publicity_type == 2
      "
    >
      <router-view></router-view>
    </div>
    <div v-if="$route.query.publicity_type == undefined && etsBool">
      <el-container class="main">
        <el-header
          v-if="$route.query.publicity_type == undefined && etsBool"
          class="main-header g-shadow"
        >
          <img class="main-logo fl" src="./assets/logo.png" alt="logo" />
  <h3 class="fl">KMF·ETS Collaboration</h3>
    <div class="fr header-avatar">
      <span class="fl logout" @click="logout">Log out</span>
      <el-avatar
        :size="40"
        :src="userInfo.pic_url"
        slot="reference"
      ></el-avatar>
    </div>
        </el-header>
        <el-container>
          <el-aside
            class="main-aside"
            :style="{ width: isCollapse ? 'auto' : '241px' }"
          >
            <vue-scroll>
              <el-menu
                class="main-menu"
                text-color="#000"
                active-text-color="#1D6FE9"
                :collapse="isCollapse"
                :default-active="defaultActive"
                router
              >
                <el-menu-item
                  v-for="(menu, index) in menuList"
                  :index="menu.remark"
                  :key="`menu${index}`"
                >
                  <template>
                    <i
                      :class="[menuIcon[index], { 'menu-icon': isCollapse }]"
                    ></i>
                    <span slot="title">{{ menu.name }}</span>
                  </template>
                </el-menu-item>
              </el-menu>
              <div class="main-aside_close">
                <i
                  :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                  @click="collapseMenu"
                ></i>
              </div>
            </vue-scroll>
          </el-aside>
          <el-main class="main-content">
            <vue-scroll ref="mainScroll">
              <router-view></router-view>
            </vue-scroll>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>
<script>
import api from "@/api";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "app",
  data() {
    return {
      isCollapse: false, // 折叠导航
      menuList: [],
      defaultActive: "course",
      menuMap: {
        unitConfig: "course",
        activityConfig: "activity",
        course: "course",
        activity: "activity",
        question: "question",
        media: "media"
      },
      menuIcon: [
        "el-icon-reading",
        "el-icon-collection",
        "el-icon-document",
        "el-icon-upload"
      ],
      etsBool: false //判断展示后台还是宣传页
    };
  },
  watch: {
    $route(val) {
      this.defaultActive = this.menuMap[val.name];
    }
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    setTimeout(() => {
      if (this.$route.query.publicity_type == undefined) {
        this.getMenu();
      }
    }, 800);
    this.getUserInfo();
  },
  mounted() {
    this.$bus.on("setScrollId", data => {
      this.$refs["mainScroll"].scrollIntoView(`#${data.id}`, 500);
    });
    window.sessionStorage.setItem("pid", this.userInfo.passport_id);
    setTimeout(() => {
      this.isCollapse = true;
    }, 2000);
  },
  methods: {
    ...mapActions({
      getUserInfo: "GET_USER_INFO"
    }),
    // 获取菜单
    getMenu() {
      this.$http._get(api.getMenu).then(res => {
        if (res.status == 200) {
          this.etsBool = true;
          Object.values(res.result.item).forEach((el, index) => {
            if (el.remark == "ets-learning") {
              this.menuList = el.sub;
            }
          });
        }
      });
    },
    // 折叠菜单
    collapseMenu() {
      this.isCollapse = !this.isCollapse;
    },
    // 退出登录
    logout() {
      window.location.href = `${process.env.VUE_APP_PRFIEX}account.kmf.com/logout`;
    }
  },
  components: {}
};
</script>
<style>
@import "~@/styles/css/reset.css";
.el-aside {
  overflow: hidden;
}
.menu-icon {
  font-size: 24px !important;
}
</style>
<style lang="scss">
.footer {
  text-align: right;
  color: #666;
  h3 {
    font-weight: bold;
    padding-top: 6px;
  }
  p {
    font-size: 12px;
    padding-bottom: 6px;
  }
}
.el {
  &-header {
    background: #fff;
    z-index: 9;
  }
}
.main {
  width: 100%;
  height: 100%;
  position: absolute;
  color: #333;
  &-header {
    h3 {
      font-size: 22px;
      font-weight: bold;
      line-height: 60px;
    }
    .header-avatar {
      margin-top: 12px;
      margin-right: 32px;
      color: #409eff;
      cursor: pointer;
      .logout {
        margin-top: 6px;
        margin-right: 4px;
        cursor: pointer;
        background: #fff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        padding: 6px 12px;
        border-radius: 4px;
        display: none;
        &:hover {
          text-decoration: underline;
        }
      }
      &:hover {
        .logout {
          display: block;
        }
      }
    }
  }
  &-logo {
    width: 48px;
    height: 48px;
    margin-top: 8px;
    margin-right: 8px;
  }
  &-aside {
    position: relative;
    // height: 100%;
    background: #fff;
    overflow: hidden;
    border-right: 1px solid #e5e5e5;
    box-sizing: border-box;
    padding-top: 20px;
    h3 {
      padding: 20px;
      font-size: 16px;
      font-weight: bold;
      &.collapse {
        padding: 20px 0;
        text-align: center;
      }
    }
    &_close {
      font-size: 24px;
      position: absolute;
      width: 100%;
      height: 56px;
      bottom: 0;
      border-top: 1px solid #ededef;
      box-sizing: border-box;
      line-height: 56px;
      background: #fff;
      color: #666;
      i {
        cursor: pointer;
        margin-left: 20px;
      }
    }
  }
  &-menu {
    border-right: 0 !important;
    li {
      font-weight: 700;
    }
    &:not(.el-menu--collapse) {
      width: 240px;
    }
    .el-menu-item.is-active {
      background: rgba(29, 111, 233, 0.05);
      border-right: 4px solid #1d6fe9;
    }
  }
  &-content {
    // height: 100%;
    color: #333;
    padding: 0 !important;
    position: relative;
    background: #fff;
  }
}
</style>
