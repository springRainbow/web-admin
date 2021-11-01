<template>
  <div class="all-type">
    <!-- audio type -->
    <!-- <div class="previewtype" v-if="false">
      <div v-if="type == 6">
        <h3 v-if="previewData['question']">
          title：{{ previewData["question"]["title"] }}
        </h3>
        <div v-if="previewData['audio'] && previewData['audio'].length > 0"
          v-for="(item, index) in previewData['audio']" :key="`audio${index}`">
          <audio :src="item.filePath" controls></audio>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Transcript：</span><span
              v-html="previewData['question']['html_content']"></span>
          </p>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Suggestion：</span><span
              v-html="previewData['question']['content_zh']"></span>
          </p>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Prepare time：</span><span
              v-html="previewData['audio'][0]['audio_time_human'].split(':')[0]"></span>
          </p>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Recording time：</span><span
              v-html="previewData['audio'][0]['audio_time_human'].split(':')[1]"></span>
          </p>
          <img v-if="item.audio_pic != ''" :src="item.audio_pic" :alt="item.title" style="width:240px;display:block" />
        </div>
        <div v-if="previewData['audio'] && previewData['audio'].length == 0">
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Transcript：</span><span
              v-html="previewData['question']['html_content']"></span>
          </p>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Suggestion：</span><span
              v-html="previewData['question']['content_zh']"></span>
          </p>
        </div>
      </div>
      <div v-else>
        <h3 v-if="previewData['question']">
          Phonemelist： {{ previewData["question"]["title"] }}
        </h3>
        <div v-if="previewData['audio'] && previewData['audio'].length > 0"
          v-for="(item, index) in previewData['audio']" :key="`audio${index}`">
          <audio :src="item.filePath" controls></audio>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Transcript：</span><span
              v-html="previewData['question']['ets_html_content']"></span>
          </p>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Additionnal Info：</span><span
              v-html="previewData['question']['ets_content_zh']"></span>
          </p>
          <div v-if="previewData['question']['content_zh_other_rs']" v-for="(val, key, index) in previewData['question'][
              'content_zh_other_rs'
            ]">
            <p v-html="val.word_replace"></p>
            <audio :src="val.audio_url" controls></audio>
          </div>
          <img v-if="item.audio_pic != ''" :src="item.audio_pic" :alt="item.title" style="width:240px;display:block" />
        </div>
        <div v-if="previewData['audio'] && previewData['audio'].length == 0">
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Transcript：</span><span
              v-html="previewData['question']['ets_html_content']"></span>
          </p>
          <p v-if="previewData['question']">
            <span style="font-weight:bold">Additionnal Info：</span><span
              v-html="previewData['question']['ets_content_zh']"></span>
          </p>
        </div>
      </div>
    </div> -->
    <!-- choice type -->
    <!-- <div class="previewtype" v-if="false">
      <p v-if="previewData['question']" v-html="previewData['question'].ets_html_content" style="color:#666"></p>
      {{previewData.questionListArr}}
      <div class="child-con" v-if="type == 17">
        <h3 class="child-title">Children：</h3>
        <div class="child-question-wrap" v-if="childList.length > 0" v-for="(item,index) in childList">
          <p>{{item.question.id}}</p>
          <p class="child-question" v-html="item.question.html_content"></p>
          <p class="child-question-zh" v-html="item.question.content_zh"></p>
          <el-radio-group v-model="radioChecked">
            <el-radio v-for="(item,index) in item.answer" :key="`ans${index}`" :label="item.selected" disabled
              style="display:block;margin-top:12px;">
              <i v-html="item.html_content"></i>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="answer" v-if="type == 3 || type == 13 || type == 18 || type == 19 ">
        <el-radio-group v-model="radioChecked" v-if="type == 3 || type == 13">
          <el-radio v-for="(item,index) in previewData['answer']" :key="`ans${index}`" :label="item.selected" disabled
            style="display:flex;align-items:center;margin-top:12px;">
            <i v-if="type == 3" v-html="item.ets_html_content"></i>
            <div style="display:inline-block;width: 380px" v-if="type == 13" v-html="item.ets_html_content"></div>
          </el-radio>
        </el-radio-group>
      </div>
      <div class="answer"
        v-if="type == 1 || type == 2 || type == 4 || type == 5 || type == 12 || type == 18 || type == 19">
        <el-checkbox-group v-model="checkChecked">
          <el-checkbox v-for="(item,index) in previewData['answer']" :key="`ans${index}`" :label="item.selected"
            disabled style="display:block;margin-top:12px;"><i v-html="item.html_content"></i></el-checkbox>
        </el-checkbox-group>
      </div>
    </div> -->
    <!-- reading type -->
    <div class="previewtype" v-if="type == 22 || type == 23">
      <h3 v-if="previewData['question']">{{ previewData['question']['title'] }}</h3>
      <p v-if="previewData['question']" v-html="previewData['question']['html_content']"></p>
      <div v-if="previewData.child">
        <div v-for="(childItem,index) in previewData.child" :key="index">
          <!-- reading parents -->
          <div v-if="childItem.question">
            <div v-if="childItem.question.type == 382">
              <div style="display: flex; justify-content: space-between;">
                <h3>{{childItem.question.id}}</h3>
                <a style="color:#1d6fe9;text-decoration: underline;" href="javascript:;" @click="goLibs(childItem.question.id)">Edit</a>
              </div>
              <h3 v-if="childItem['question']">
                Interval：{{ childItem["question"]["title_zh"] }}
              </h3>
              <p v-if="childItem['question']">
                <span style="font-weight:bold">Timer：</span><span
                  v-html="childItem['question']['content_zh']"></span>
              </p>
              <p v-if="childItem['question']">
                <span style="font-weight:bold">Instruction：</span><span
                  v-html="childItem['question']['title']"></span>
              </p>
              <p v-if="childItem.question" v-html="childItem['question']['html_content']">
              </p>
              <div v-if="type == 23" style="box-sizing:border-box;width: 100%;padding-left: 20px;" v-for="(grandItem,index) in childItem.child" :key="index">
                <div v-if="grandItem.question">
                  <!-- reading parents -->
                  <!-- {{grandItem.question.type}} -->
                  <div v-if="grandItem.question.type == 382 || grandItem.question.type == 105">
                    <div style="display: flex; justify-content: space-between;">
                      <h3>{{grandItem.question.id}}</h3>
                      <a style="color:#1d6fe9;text-decoration: underline;" href="javascript:;" @click="goLibs(grandItem.question.id)">Edit</a>
                    </div>
                    <p v-if="grandItem.question" v-html="grandItem['question']['html_content']"></p>
                  </div>
                  <!-- audio type -->
                  <div v-if="grandItem.question.type == 383">
                    <div style="display: flex; justify-content: space-between;">
                      <h3>{{grandItem.question.id}}</h3>
                      <a style="color:#1d6fe9;text-decoration: underline;" href="javascript:;" @click="goLibs(grandItem.question.id)">Edit</a>
                    </div>
                    <div>
                      <h3 v-if="grandItem['question']">
                        Interval：{{ grandItem["question"]["title"] }}
                      </h3>
                      <div v-if="grandItem['audio'] && grandItem['audio'].length > 0"
                        v-for="(item, index) in grandItem['audio']" :key="`audio${index}`">
                        <p v-if="grandItem['question']">
                          <span style="font-weight:bold">Transcript：</span><span
                            v-html="grandItem['question']['html_content']"></span>
                        </p>
                        <p v-if="grandItem['question']">
                          <span style="font-weight:bold">Suggestion：</span><span
                            v-html="grandItem['question']['content_zh']"></span>
                        </p>
                        <p v-if="grandItem['question']">
                          <span style="font-weight:bold">Prepare time：</span><span
                            v-html="grandItem['audio'][0]['audio_time_human'].split(':')[0]"></span>
                        </p>
                        <p v-if="grandItem['question']">
                          <span style="font-weight:bold">Recording time：</span><span
                            v-html="grandItem['audio'][0]['audio_time_human'].split(':')[1]"></span>
                        </p>
                        <audio :src="item.filePath" controls></audio>
                        <img v-if="item.audio_pic != ''" :src="item.audio_pic" :alt="item.title"
                          style="width:240px;display:block" />
                      </div>
                      <div v-if="grandItem['audio'] && grandItem['audio'].length == 0">
                        <p v-if="grandItem['question']">
                          <span style="font-weight:bold">Transcript：</span><span
                            v-html="grandItem['question']['html_content']"></span>
                        </p>
                        <p v-if="grandItem['question']">
                          <span style="font-weight:bold">Suggestion：</span><span
                            v-html="grandItem['question']['content_zh']"></span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <!-- choice -->
                  <div
                    v-if="grandItem.question.type == 101 || grandItem.question.type == 1011 || grandItem.question.type == 611">
                    <div style="display: flex; justify-content: space-between;">
                      <h3>{{grandItem.question.id}}</h3>
                      <a style="color:#1d6fe9;text-decoration: underline;" href="javascript:;" @click="goLibs(grandItem.question.id)">Edit</a>
                    </div>
                    <p v-if="grandItem['question']" v-html="grandItem['question'].ets_html_content" style="color:#666">
                    </p>
                    <div class="answer" v-if="grandItem.question.type == 101">
                      <el-radio-group v-model="radioChecked">
                        <el-radio v-for="(item,index) in grandItem['answer']" :key="`ans${index}`" :label="item.selected"
                          disabled style="display:flex;align-items:center;margin-top:12px;">
                          <i v-html="item.ets_html_content"></i>
                          <div style="display:inline-block;width: 380px" v-html="item.ets_html_content"></div>
                        </el-radio>
                      </el-radio-group>
                    </div>
                    <div class="answer" v-if="grandItem.question.type == 611">
                      <el-checkbox-group v-model="checkChecked">
                        <el-checkbox v-for="(item,index) in grandItem['answer']" :key="`ans${index}`" :label="item.selected"
                          disabled style="display:block;margin-top:12px;"><i v-html="item.html_content"></i></el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- audio type -->
            <div v-if="childItem.question.type == 383">
              <div style="display: flex; justify-content: space-between;">
                <h3>{{childItem.question.id}}</h3>
                <a style="color:#1d6fe9;text-decoration: underline;" href="javascript:;" @click="goLibs(childItem.question.id)">Edit</a>
              </div>
              <div>
                <h3 v-if="childItem['question']">
                  Interval：{{ childItem["question"]["title_zh"] }}
                </h3>
                <div v-if="childItem['audio'] && childItem['audio'].length > 0"
                  v-for="(item, index) in childItem['audio']" :key="`audio${index}`">
                  <p v-if="childItem['question']">
                    <span style="font-weight:bold">Transcript：</span><span
                      v-html="childItem['question']['html_content']"></span>
                  </p>
                  <p v-if="childItem['question']">
                    <span style="font-weight:bold">Suggestion：</span><span
                      v-html="childItem['question']['content_zh']"></span>
                  </p>
                  <p v-if="childItem['question']">
                    <span style="font-weight:bold">Prepare time：</span><span
                      v-html="childItem['audio'][0]['audio_time_human'].split(':')[0]"></span>
                  </p>
                  <p v-if="childItem['question']">
                    <span style="font-weight:bold">Recording time：</span><span
                      v-html="childItem['audio'][0]['audio_time_human'].split(':')[1]"></span>
                  </p>
                  <audio :src="item.filePath" controls></audio>
                  <img v-if="item.audio_pic != ''" :src="item.audio_pic" :alt="item.title"
                    style="width:240px;display:block" />
                </div>
                <div v-if="childItem['audio'] && childItem['audio'].length == 0">
                  <p v-if="childItem['question']">
                    <span style="font-weight:bold">Transcript：</span><span
                      v-html="childItem['question']['html_content']"></span>
                  </p>
                  <p v-if="childItem['question']">
                    <span style="font-weight:bold">Suggestion：</span><span
                      v-html="childItem['question']['content_zh']"></span>
                  </p>
                </div>
              </div>
            </div>
            <!-- choice -->
            <div
              v-if="childItem.question.type == 101 || childItem.question.type == 1011 || childItem.question.type == 611">
              <div style="display: flex; justify-content: space-between;">
                <h3>{{childItem.question.id}}</h3>
                <a style="color:#1d6fe9;text-decoration: underline;" href="javascript:;" @click="goLibs(childItem.question.id)">Edit</a>
              </div>
              <p v-if="previewData['question']" v-html="previewData['question'].ets_html_content" style="color:#666">
              </p>
              <div class="answer" v-if="childItem.question.type == 101">
                <el-radio-group v-model="radioChecked">
                  <el-radio v-for="(item,index) in childItem['answer']" :key="`ans${index}`" :label="item.selected"
                    disabled style="display:flex;align-items:center;margin-top:12px;">
                    <i v-html="item.ets_html_content"></i>
                    <div style="display:inline-block;width: 380px" v-html="item.ets_html_content"></div>
                  </el-radio>
                </el-radio-group>
              </div>
              <div class="answer" v-if="childItem.question.type == 611">
                <el-checkbox-group v-model="checkChecked">
                  <el-checkbox v-for="(item,index) in childItem['answer']" :key="`ans${index}`" :label="item.selected"
                    disabled style="display:block;margin-top:12px;"><i v-html="item.html_content"></i></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
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
        radioChecked: "1",
        checkChecked:["1"],
      };
    },
    props: {
      previewData: {
        type: Object,
        required: true,
      },
      childList: {
        type: Array,
        required: true
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
      /**
       * 跳转题库
       */
      goLibs(id) {
        let open = window.open();
        open.location = `${this.qmLink}${id}`;
      }
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

  .el-radio,
  .el-checkbox {
    white-space: pre-line;
  }

  .child-question-wrap {
    margin-top: 20px;
  }

  .child-question,
  .child-question-zh {
    margin-top: 10px;
  }

  .child-title {
    font-size: 16px;
    font-weight: bold;
    margin-top: 20px;
  }
</style>