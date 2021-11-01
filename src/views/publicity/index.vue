<template>
  <div>
    <div v-if="$route.query.publicity_type == 1">
      <t-header></t-header>
      <router-view></router-view>
      <t-footer></t-footer>
    </div>
    <div v-if="$route.query.publicity_type == 2">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import THeader from "@/components/header/index.vue";
  import TFooter from "@/components/footer/index.vue";
  export default {
    name: 'publicity',
    data() {
      return {
        
      }
    },
    created(){
      if (!window.kmfSensors) {
              this.$kmfSensors.init({
                pid: window.sessionStorage.getItem('pid'),
                params: {
                  project: "ets",
                  platform: "web",
                  product_line: "ets-web",
                },
              });
            }
            setTimeout(() => {
              if (
                window.kmfSensors &&
                Object.prototype.toString.call(window.kmfSensors) ===
                "[object Object]"
              ) {
                window.kmfSensors.track("web浏览页面", {
                  project: "ets",
                  platform: "web",
                  product_line: "ets-web",
                });
              }
            }, 500)
    },
    methods: {
      
    },
    components: {
      THeader,
      TFooter
    }
  }
</script>
<style lang="scss">
  
</style>