const path = require('path');
module.exports = {
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    productionSourceMap: false,
    devServer: {
        host: 'test-vue.kmf.com',
        port: 8080
    },
    chainWebpack: config => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type))); 
    }

}
function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './src/styles/scss/*.scss'),        //  引入共享全局变量
            ],
        })
}