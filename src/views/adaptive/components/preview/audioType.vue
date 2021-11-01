<template>
  <div class="previewtype">
    <div v-if="type == 6">
      <h3 v-if="previewData['question']">
        title：{{ previewData["question"]["title"] }}
      </h3>
      <div
        v-if="previewData['audio'] && previewData['audio'].length > 0"
        v-for="(item, index) in previewData['audio']"
        :key="`audio${index}`"
      >
        <audio :src="item.filePath" controls></audio>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Transcript：</span
          ><span v-html="previewData['question']['html_content']"></span>
        </p>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Suggestion：</span
          ><span v-html="previewData['question']['content_zh']"></span>
        </p>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Prepare time：</span
          ><span
            v-html="previewData['audio'][0]['audio_time_human'].split(':')[0]"
          ></span>
        </p>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Recording time：</span
          ><span
            v-html="previewData['audio'][0]['audio_time_human'].split(':')[1]"
          ></span>
        </p>
        <img
          v-if="item.audio_pic != ''"
          :src="item.audio_pic"
          :alt="item.title"
          style="width:240px;display:block"
        />
      </div>
      <div v-if="previewData['audio'] && previewData['audio'].length == 0">
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Transcript：</span
          ><span v-html="previewData['question']['html_content']"></span>
        </p>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Suggestion：</span
          ><span v-html="previewData['question']['content_zh']"></span>
        </p>
      </div>
    </div>
    <div v-else>
      <h3 v-if="previewData['question']">
        Phonemelist： {{ previewData["question"]["title"] }}
      </h3>
      <div
        v-if="previewData['audio'] && previewData['audio'].length > 0"
        v-for="(item, index) in previewData['audio']"
        :key="`audio${index}`"
      >
        <audio :src="item.filePath" controls></audio>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Transcript：</span
          ><span v-html="previewData['question']['ets_html_content']"></span>
        </p>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Additionnal Info：</span
          ><span v-html="previewData['question']['ets_content_zh']"></span>
        </p>
        <!-- <p v-if="previewData['question']"><span style="font-weight:bold">Prepare time：</span><span v-html="previewData['audio'][0]['audio_time_human'].split(':')[0]"></span></p>
          <p v-if="previewData['question']"><span style="font-weight:bold">Recording time：</span><span v-html="previewData['audio'][0]['audio_time_human'].split(':')[1]"></span></p> -->
        <div
          v-if="previewData['question']['content_zh_other_rs']"
          v-for="(val, key, index) in previewData['question'][
            'content_zh_other_rs'
          ]"
        >
          <p v-html="val.word_replace"></p>
          <audio :src="val.audio_url" controls></audio>
        </div>
        <img
          v-if="item.audio_pic != ''"
          :src="item.audio_pic"
          :alt="item.title"
          style="width:240px;display:block"
        />
      </div>
      <div v-if="previewData['audio'] && previewData['audio'].length == 0">
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Transcript：</span
          ><span v-html="previewData['question']['ets_html_content']"></span>
        </p>
        <p v-if="previewData['question']">
          <span style="font-weight:bold">Additionnal Info：</span
          ><span v-html="previewData['question']['ets_content_zh']"></span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "audioType",
  data() {
    return {
      splitStr: [""],
    };
  },
  props: {
    previewData: {
      type: Object,
      required: true,
    },
    type: {
      type: Number | String,
      required: true,
    },
    qmLink: {
        type: String,
        required: true
      }
  },
  watch: {
    previewData(val) {
      this.previewData = val;
    },
  },
  methods: {
    // cutString(str,mark){
    //   return str = str.split(mark);
    // }
  },
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
