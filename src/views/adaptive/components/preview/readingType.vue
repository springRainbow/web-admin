<template>
  <div class="previewtype">
    <h3 v-if="previewData['question']">{{ previewData['question']['title'] }}</h3>
    <p v-if="previewData['question']" v-html="previewData['question']['html_content']"></p>
  </div>
</template>
<script>
export default {
  name: "audioType",
  data() {
    return {};
  },
  props: {
    previewData: {
      type: Object,
      required: true
    },
    childList: {
      type: Array,
      required: true
    },
    type: {
      type: Number | String,
      required: true
    },
    qmLink: {
      type: String,
      required: true
    }
  }
};
</script>
<style lang="scss" scpoed>
.previewtype {
  h3 {
    font-size: 16px;
    font-weight: bold;
    color: #666;
    margin-bottom: 20px;
  }
  audio {
    margin-bottom: 14px;
  }
  p {
    margin-bottom: 12px;
    color: #666;
  }
}
</style>