import Vue from 'vue';
/**
 * 处理\n
 */
Vue.prototype.changeBr = function (text) {
    return text.replace(/\n/g, "<br/>")
};
// Vue.filter('changeBr',function(text){
//     return text.replace(/\n/g, "<br/>")
// })