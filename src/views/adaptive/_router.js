export default [
    {
        path: '/adaptive',
        name: 'adaptive',
        meta: {
            title: "Adaptive Learning",
            requiresAuth: true,
        },
        component: () => import(/* webpackChunkName: 'adaptive' */ './index.vue'),
        children:[
            {
                path: 'course',
                name: 'course',
                meta:{
                    title:'Course List',
                    requiresAuth: true,
                },
                component: () => import(/* webpackChunkName: 'adaptive' */ './pages/course.vue')
            },
            {
                path: 'activity',
                name: 'activity',
                meta: {
                    title: 'Activity List',
                    requiresAuth: true,
                },
                component: () => import(/* webpackChunkName: 'adaptive' */ './pages/activity.vue')
            },
            {
                path: 'question',
                name: 'question',
                meta: {
                    title: 'Question List',
                    requiresAuth: true,
                },
                component: () => import(/* webpackChunkName: 'adaptive' */ './pages/question.vue')
            },
            {
                path: 'unitconfig',
                name: 'unitConfig',
                meta: {
                    title: 'Unit Config',
                    requiresAuth: true,
                },
                component: () => import(/* webpackChunkName: 'adaptive' */ './pages/config/unitConfig.vue')
            },
            {
                path: 'activityconfig',
                name: 'activityConfig',
                meta: {
                    title: 'Activity Config',
                    requiresAuth: true,
                },
                component: () => import(/* webpackChunkName: 'adaptive' */ './pages/config/activityConfig.vue')
            },
            {
                path: 'assessmentconfig',
                name: 'asessmentConfig',
                meta: {
                    title: 'Activity Config',
                    requiresAuth: true,
                },
                component: () => import(/* webpackChunkName: 'adaptive' */ './pages/config/assessmentConfig.vue')
            },
            {
                path: 'media',
                name: 'media',
                meta: {
                    title: 'Media Upload',
                    requiresAuth: true,
                },
                component: () => import(/* webpackChunkName: 'adaptive' */ './pages/media.vue')
            }
        ]
    }
]