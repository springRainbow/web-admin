# admin-ets

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
.
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue\
│   ├── api             // api集合
│   │   └── index.js
│   ├── assets          // 静态资源-图片
│   │   ├── logo.png
│   ├── components      // 全局组件
│   │   ├── common      // 全局自动注册组件
│   │   │   ├── upload
│   │   │   │   ├── export.js
│   │   │   │   └── upload.vue
│   │   └── index.js
│   ├── directives      // 自定义指令
│   ├── filters         // 自定义过滤器
│   ├── main.js         // vue主入口
│   ├── plugins         // 处理插件
│   │   ├── kmf-axios.js
│   │   └── vue-bus.js
│   ├── router          // 路由入口
│   │   └── index.js
│   ├── store           // vuex
│   │   └── module      // vuex分模块
│   │   └── index.js    // vuex入口
│   ├── styles          // 全局定义样式文件
│   │   ├── css
│   │   │   └── reset.css
│   │   └── scss
│   │       ├── _function.scss
│   │       ├── _mixin.scss
│   │       └── _variables.scss
│   ├── utils               // 全局功能JS模块
│   │   └── guard.js
│   └── views               // 视图层
│       └── business        // 业务层
│           ├── _api.js     // 业务层api
│           ├── _router.js  // 业务层路由
│           ├── components  // 业务层组件
│           ├── index.vue   // 业务层入口
│  
└── vue.config.js           // vue 配置