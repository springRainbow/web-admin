import Vue from 'vue'
import Vuex from 'vuex'
import VueCookie from 'vue-cookie'
import axios from '@glo/kmf-axios'
import api from '@/api'
Vue.use(Vuex)
let http = axios.create({
  loadProgressBar: true,
  headers: { 'Authorization': 'Bearer ' + VueCookie.get('authkey') },
  createOptions: {},
})

export default new Vuex.Store({
  state: {
    userInfo: {},
    course: {}, // course 数据
  },
  mutations: {
    /**
     * 获取用户信息
     */
    SET_USER_INFO(state, {result}) {
      state.userInfo = result;
    }
  },
  getters: {
    getUserInfo: (state) => {
      return state.userInfo;
    }
  },
  actions: {
    async GET_USER_INFO({ commit }) {
      try {
        if(VueCookie.get('authkey')){
          let { result } = await http._get(api.getInfoBase);
          commit("SET_USER_INFO", { result });
        }
        
      } catch (error) {
      }
    }
  },
  modules: {

  }
})
