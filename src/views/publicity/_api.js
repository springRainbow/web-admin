let PREFIX = process.env.VUE_APP_API_PREFIX;
export default {
  getCollectMessage: PREFIX + '/ets/user/collect-options',// 内容信息收集
  getCollectIS: PREFIX + '/ets/user/beta-role', // 是否进行内测
  submitCollectMessage: PREFIX + '/ets/user/collect' //提交信息
}