let API_PREFIX = process.env.VUE_APP_API_PREFIX;
let api = {
    // 获取用户信息
    getInfoBase: API_PREFIX + '/api-passport/user/info/base',
    // 获取rbac返回的菜单
    getMenu: API_PREFIX + '/ets/admin/menu',
    kdfsStsUrl: API_PREFIX + '/kdfs/sts/js', // 获取上传地址
};

const apiContext = require.context('../views', true, /_api\.js$/);
apiContext.keys().forEach(apictx => {
    const apiModule = apiContext(apictx);
    /**
    * 兼容 import export 和 require module.export 两种规范
    */
    api = { ...api, ...(apiModule.default || apiModule) }
})
export default api;