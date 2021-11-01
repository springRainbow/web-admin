let PREFIX = process.env.VUE_APP_API_PREFIX;
export default {
    // course列表
    courseList: PREFIX + '/ets/admin/al/courses',
    // course保存
    saveCourse: PREFIX + '/ets/admin/al/courses',
    // course删除
    delCourse: (id) => PREFIX + `/ets/admin/al/courses/${id}`,
    // 获取course下unit列表
    // unitList: (id) => PREFIX + `/ets/admin/al/units?course_id=${id}`,
    unitList: (id) => PREFIX + `/ets/admin/al/course-maps/${id}`,
    // 获取unit下script 列表
    scriptList: PREFIX + '/ets/admin/al/scripts',
    // unit编辑显示详情
    getUnitDetail: (id) => PREFIX + `/ets/admin/al/units/${id}`,
    // unit删除
    delUnit: (id) => PREFIX + `/ets/admin/al/units/${id}`,
    // unit保存
    saveUnit: PREFIX + '/ets/admin/al/units',
    // 获取activity列表
    activityList: PREFIX + '/ets/admin/al/activities',
    // 获取activity详情
    activityListDetail:(id) => PREFIX + `/ets/admin/al/activities/${id}`,
    // unit排序
    // unitOrder: PREFIX + '/ets/admin/al/unit/orders',
    unitOrder: PREFIX + '/ets/admin/al/course-maps/orders',
    // 发布 回收unit
    unitOnline: (id) => PREFIX + `/ets/admin/al/units/online/${id}`,
    // 获取activity type列表
    activityTypeList: PREFIX + '/ets/admin/al/activitiy/types',
    // unit config activity 排序
    activityRank: PREFIX + '/ets/admin/al/activity/orders',
    // 设置题目quesiton type 和practice as
    setTypes: PREFIX + '/ets/admin/al/question/types',
    // 设置题目与activity绑定--修改
    setActivityBindEdit: PREFIX + '/ets/admin/al/activity/questions-edit',
    // 设置题目与activity绑定-新增
    setActivityBindNew: PREFIX + '/ets/admin/al/activity/questions-bind',
    // activity下question 排序
    questionOrder: PREFIX + '/ets/admin/al/activity-question/orders',
    // 获取activity下的题目列表
    actitityQuestion: PREFIX + `/ets/admin/al/activity/questions`,
    // 设置题目与activity解绑
    unbindActivity: PREFIX + '/ets/admin/al/activity/questions',
    // 批量获取题目信息
    getChildList: PREFIX + '/ets/al/questions',
    // 删除activity
    delActivity: (id) => PREFIX + `/ets/admin/al/activities/${id}`,
    // unit下绑定activity
    unitBindActivity: PREFIX + '/ets/admin/al/activity-binds',
    // unit下解除绑定activity
    unitDetachsActivity: PREFIX + '/ets/admin/al/activity-detachs',
    // unit下绑定activity
    courseBindAssessment: PREFIX + '/ets/admin/al/assessment-binds',
    // unit下解除绑定 assement
    courseDetachAssessment: PREFIX + '/ets/admin/al/assessment-detachs',
    // 保存activity
    saveActivity: PREFIX + '/ets/admin/al/activities',
    // 获取题目列表，包含筛选
    questionList: PREFIX + '/ets/admin/al/questions',
    // 获取单题详情
    getSingleQues: (qid) => PREFIX + `/ets/al/questions/${qid}`,
    // 获取题目的练习方式
    getPracticeWay: PREFIX + '/ets/admin/al/question/practices',
    // 获取题目位置
    questionLocation: (qid) => PREFIX + `/ets/admin/al/question/locations/${qid}`,
    // 取course-unit层级选项列表
    getCourseTree: PREFIX +'/ets/admin/al/course-trees',
    // question type跳转题库
    getQuestionQm: PREFIX + '/ets/admin/al/question/types',
    // script 排序
    scriptOrder: PREFIX + '/ets/admin/al/script/orders',
    // 获取script类型和goto信息
    getScriptType: PREFIX + '/ets/admin/al/script/types',
    // 保存script
    saveScript: PREFIX + '/ets/admin/al/scripts',
    // 删除script
    delScript: (id) => PREFIX + `/ets/admin/al/scripts/${id}`,
    // script 编辑to
    editScriptTo: PREFIX + '/ets/admin/al/script/edit-to',
    // 获取script编辑状态
    scriptEditStatus: PREFIX + '/ets/admin/al/script/edit-status',
    // script 编辑锁定/解锁
    scriptLock: PREFIX + '/ets/admin/al/script/edit-op',
    // 资料：get获取列表 post提交列表 delete 删除 /{id}
    mediasUrl: PREFIX +'/ets/admin/al/medias',

    errorFbSave: PREFIX + '/ets/admin/al/question/feedback',//保存错误信息修改

    // 内容发布部分all
    publishPre: (qid) => PREFIX + `/ets/admin/al/publish/preview/${qid}`,//发布预览

    publishPub: (qid) => PREFIX + `/ets/admin/al/publish/offical/${qid}`,//发布正式

    publishRet: (qid) => PREFIX + `//ets/admin/al/publish/retract/${qid}`,//发布撤回

    publishEdit: (qid) => PREFIX + `/ets/admin/al/publish/edit/${qid}`,//编辑更改
    publishDel: (qid) => PREFIX + `/ets/admin/al/publish/delete/${qid}`, //新删除

    publishList: (course_id) => PREFIX + `/ets/admin/al/publish/sub-seqs/${course_id}`, //发布列表
    publishHasList: (course_id) => PREFIX + `/ets/admin/al/publish/sub-seqs/edit/${course_id}`, //更新发布过

    goToList: (activity_id) => PREFIX + `/ets/admin/al/activity-question/seqs/${activity_id}`, //获取goto题目list

    saveEditGoTo: PREFIX + `/ets/admin/al/activity-question/tos`,//保存goto编辑

    saveNewFieds: PREFIX + `/ets/admin/al/activity-question/detail`//保存新增字段
}