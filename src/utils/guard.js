/**
 * 导航守卫
 */
import VueCookie from 'vue-cookie'

export default ((to, from, next) =>{
    // 设置html title
    document.title = to.meta.title;
    // 获取cookie
    let authkey = VueCookie.get('authkey');
    // 进入页面,对url进行编码，防止浏览器拦截hash地址。
    let originUrl = encodeURIComponent(window.location.href);
    // 是否需要权限认证：前端路由判断，需要&&无authkey 直接跳转登录。
    if (to.meta.requiresAuth){
        // 需要权限认证，但是没有cookie authkey 
        if (!authkey){
            // 直接跳转登录，无需走到 axios拦截器
            window.location.replace(process.env.VUE_APP_PRFIEX + 'account.kmf.com/login?backurl=' + originUrl, '_blank');

        }else{
            next();
        }
    }else{
        next();
    }
    


})