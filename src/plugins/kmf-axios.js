import Vue from 'vue';
import VueCookie from 'vue-cookie';
import axios from '@glo/kmf-axios';
import api from '../api/index'
// 当前页面 url
let originUrl = encodeURIComponent(window.location.href);
let headers = {}
if (VueCookie.get("authkey")) {
    headers = {
      Authorization: "Bearer " + VueCookie.get("authkey"),
    };
}
Vue.prototype.$http = axios.create({
  loadProgressBar: true,
  headers: headers,
  createOptions: {},
  response(res) {
    let data = res.data;
    // 公共回调当前is_edit_mark为1时调取编辑记录更新接口
    // if(data.status == 200 && data.result.is_edit_mark == 1){
    // Vue.prototype.$http._post(api.publishEdit(308),{id:308}).then((res)=>{console.log(res)})
    // }
    if (data.status != 200) {
      if (data.status == 9105) {
        Vue.prototype.$notify.error({
          title: "Permission denied",
          message: "Insufficient permission to perform this action.",
        });
      } else {
        Vue.prototype.$message({
          type: "error",
          message: data.message,
        });
      }
    }
  },
  errCallback(err) {
    if (err.status == 401) {
      Vue.prototype.$notify.error({
        title: "Permission denied",
        message: "Insufficient permission to perform this action.",
      });
    } else if (err.status == "") {
      // window.location.reload();
    } else {
      Vue.prototype.$message({
        type: "error",
        message: err.msg,
      });
    }
  },
});