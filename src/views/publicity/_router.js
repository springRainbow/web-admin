export default [
  {
    path: '/publicity',
    name: 'publicity',
    meta: {
      title: "GoSpeak 体验官招募",
      requiresAuth: false,
    },
    component: () => import(/* webpackChunkName: 'publicity' */ './index.vue'),
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: "GoSpeak 体验官招募",
          requiresAuth: false,
        },
        component: () => import(/* webpackChunkName: 'collect-web' */ './pages/collect-home-web.vue'),
      },
      {
        path: 'collect',
        name: 'collect',
        meta: {
          title: "报名体验",
          requiresAuth: false,
        },
        component: () => import(/* webpackChunkName: 'collect-web' */ './pages/collect-con-web.vue'),
      },
      {
        path: 'mobile-home',
        name: 'mobile-home',
        meta: {
          title: "GoSpeak 体验官招募",
          requiresAuth: false,
        },
        component: () => import(/* webpackChunkName: 'collect-h5' */ './pages/collect-home-h5.vue'),
      },
      {
        path: 'mobile-collect',
        name: 'mobile-collect',
        meta: {
          title: "报名体验",
          requiresAuth: false,
        },
        component: () => import(/* webpackChunkName: 'collect-h5' */ './pages/collect-con-h5.vue'),
      },
    ]
  },

]