<template>
  <div class="qdetail">
    <div v-if="from == 'activity'" class="rank-tit"
        v-infinite-scroll="addMoreQuestions"
        infinite-scroll-disabled="scrollBool">
      <div>
        <span>Questions</span> 
        <span
          v-if="questionList.length >1 && editGoToBool"
          @click="setRank()"
          :class="canRank ? 'open-rank' : 'el-icon-finished finishrank'"
        ></span>
        <span class="num" v-html="`${questionList.length} total`"></span>
      </div>
      <section class="section-button-wrap">
        <el-button type="primary" 
         :disabled="!editGoToBool"
         @click="drawerAddBool = !drawerAddBool">Add Questions</el-button>
        <div class="edit-button-wrap" v-show="editGoToBool">
          <el-button type="primary" @click="editGoToBool = !editGoToBool">Edit Go-to</el-button>
        </div>
        <div class="edit-button-wrap" v-show="!editGoToBool">
          <el-button type="primary" @click="saveEditGoTo">Save</el-button>
          <el-button @click="cancelGoTo('cancel')">Cancel</el-button>
        </div>
      </section>
    </div>
    <div v-if="from == 'assessment'" class="rank-tit">
      <div>
        <span>Questions</span> 
        <span
          v-if="questionList.length >1 && editGoToBool"
          @click="setRank()"
          :class="canRank ? 'open-rank' : 'el-icon-finished finishrank'"
        ></span>
        <span class="num" v-html="`${questionList.length} total`"></span>
      </div>
      <section class="section-button-wrap">
        <el-button type="primary" 
         :disabled="!editGoToBool"
         @click="drawerAddBool = !drawerAddBool">Add Questions</el-button>
      </section>
    </div>
    <el-row :gutter="20">
      <!-- <el-col :span="showDetail ? 14 : 24"> -->
        <el-col>
        <div class="question-table">
          <p class="thead">
            <em class="w0" v-if="!canRank"></em>
            <em class="w1" v-if="from == 'activity'">No.</em>
            <em class="w1">QuestionID</em>
            <em class="w2">{{ from == 'activity' ? 'PracticeAs' : 'Type' }}</em>
            <em class="w3" :class="{active:from == 'activity'}">Content</em>
            <em v-if="from == 'activity'" class="w4">{{ from == 'activity' ? 'Go-to type' : '' }}</em>
            <em v-if="from == 'activity'" class="w5 w5cont">{{ from == 'activity' ? 'Go-to' : '' }}</em>
          </p>
          <draggable v-model="questionList" class="list-group" tag="p" v-bind="dragOptions">
            <transition-group type="transition" >
              <p
                v-loading="loading"
                class="tbody"
                v-for="(item,index) in questionList"
                :key="'table' + index"
                :class="{'current':curClickIndex == index,'list-group-item':!canRank}"
                @click.stop="currentRowChange(item)"
              >
                <em class="w0" v-if="!canRank">
                  <i class="el-icon-sort"></i>
                </em>
                <em class="w1" v-if="from == 'activity'" v-html="item.seq_num"></em>
                <em class="w1" v-html="item.id"></em>
                <em class="w2" v-html="item.type_content"></em>
                <em class="w3 cont" :class="{active:from == 'activity'}"  v-html="item.html_content"></em>
                <em v-if="from == 'activity'" class="w4 cont">
                  <el-select @change="chooseGo(item,index)" :disabled="editGoToBool" v-if="item.question_practice_type == 18 || item.question_practice_type == 19" class="select-goto" v-model="item.to_type" placeholder="请选择">
                    <el-option
                      v-for="(val,key,index) in goToObj.to_type_details_choice"
                      :key="key+index"
                      :label="val"
                      :value="key">
                    </el-option>
                  </el-select> 
                  <el-select @change="chooseGo(item,index)" :disabled="editGoToBool" v-else-if="item.question_practice_type == 15 || item.question_practice_type == 17" class="select-goto" v-model="item.to_type" placeholder="请选择">
                    <el-option
                      v-for="(val,key,index) in goToObj.to_type_details_speech"
                      :key="val+index"
                      :label="val"
                      :value="key">
                    </el-option>
                  </el-select>
                  <el-select @change="chooseGo(item,index)" :disabled="editGoToBool" v-else class="select-goto" v-model="item.to_type" placeholder="请选择">
                    <el-option
                      v-for="(val,key,index) in goToObj.to_type_details_common"
                      :key="index"
                      :label="val"
                      :value="key">
                    </el-option>
                  </el-select></em>
                <em class="w5" v-if="from == 'activity'">
                  <!-- question 选项 -->
                  <div v-show="item.to_type == 1" class="margin-div-top">
                    <el-select 
                      @change = "changeGoToNumber(item,index)" 
                      :disabled="editGoToBool" 
                      class="select-goto" v-for="(toItem,toIndex) in item.tos"
                      :key="toIndex"
                      v-model="toItem.target_id" 
                      placeholder="请选择">
                      <el-option label="No.--" :value="'-1'"></el-option>
                      <el-option
                        v-for="itemGo in goToListArr"
                        :key="itemGo.seq"
                        :label="`No.${itemGo.seq}`"
                        :value="itemGo.id.toString()">
                      </el-option>
                    </el-select>
                  </div>
                  <!-- score 选项 -->
                  <div class="g-clearfix" v-show="item.to_type == 2">
                    <div class=" margin-div-top" v-for="(vl,opKey) in item.tos" :key="opKey">
                      <b class="gotoType" v-if="vl.option_id == key" v-for="(it,key,ind) in goToObj.score_types" :key="ind">{{it}}</b>
                      <el-select 
                      @change = "changeGoToNumber(item,index)"
                      :disabled="editGoToBool" 
                      v-model="vl.target_id"  
                      placeholder="请选择">
                        <el-option label="No.--" :value="'-1'"></el-option>
                        <el-option
                          v-for="itemGo in goToListArr"
                          :key="itemGo.seq"
                          :label="`No.${itemGo.seq}`"
                          :value="itemGo.id.toString()">
                        </el-option>
                      </el-select> 
                     
                    </div>
                  </div>
                  <!-- option 选项 -->
                  <div class="g-clearfix" v-show="item.to_type == 3">
                    <div class=" margin-div-top check-box" v-for="(vl,opKey) in item.tos" :key="opKey">
                      <b class="gotoType" v-if="vl.option_id == key" v-for="(it,key,ind) in item.question_options" :key="ind">{{it}}</b>
                      <el-select 
                        @change = "changeGoToNumber(item,index)"
                        :disabled="editGoToBool" 
                        v-model="vl.target_id" 
                        placeholder="请选择">
                        <el-option label="No.--" :value="'-1'"></el-option>
                        <el-option
                          v-for="itemGo in goToListArr"
                          :key="itemGo.seq"
                          :label="`No.${itemGo.seq}`"
                          :value="itemGo.id.toString()">
                        </el-option>
                      </el-select> 
                    </div>
                  </div>
                </em>
              </p>
            </transition-group>
          </draggable>
        </div>
        <!-- 加载更多 -->
        <!-- <div v-if="questionList.length > 0 && from == 'activity' && questionList.length < actiQuestionTotal" class="loading-more-questions" @click="addMoreQuestions">loading more questions...</div> -->
        <el-pagination
          v-if="from == 'question'"
          style="margin-top:20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="filter.page"
          :page-sizes="[5, 10, 15, 20, 25]"
          :page-size="filter.limit"
          layout="prev, pager, next,sizes,total"
          :total="pageTotal"
        ></el-pagination>
        <el-drawer
          class="drawer-show"
          :visible.sync="drawerAddBool"
          :with-header="false"
          :modal = "true"
          :modal-append-to-body = "false"
          size="70%">
          <div class="qdetail-ques_add" v-if="from == 'activity' ||from == 'assessment' ">
            <span>Add：</span>
            <el-input
              class="qdetail-ques_input"
              type="text"
              size="small"
              placeholder="QuestionID"
              @change="handleIconSearch"
              v-model.trim="searchQuestionId"
            >
              <i class="el-icon-search el-input__icon" slot="suffix"></i>
            </el-input>
            <span v-if="noQuestionid != ''" style="margin-left:12px;color:#f00">{{ noQuestionid }}</span>
            <el-button
              type="primary"
              style="margin-left:32px;"
              size="small"
              @click="addBind"
              :disabled="canEditNewQuestionType || add_practice_type == ''"
            >Add</el-button>
            <el-dropdown class="fr">
              <el-button type="primary" size="small">
                +New
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index,key) in qmtype" :key="'dropdown'+ key">
                  <a
                    :href="item.qm_link"
                    target="_blank"
                    style="display:block;width:100%;"
                  >{{ item.type_content }}</a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          
          <div
            class="single-question"
            id="scrollView"
            v-if="(from == 'activity' || from == 'assessment') && singleQuestion.id && saveSuccess"
          >
          <section class="section-top">
            <div class="g-clearfix">
              <div class="question-type-wrap">
                <div class="info">
                  <span class="fl">Type：</span>
                  <el-select
                    v-model="add_topic_type"
                    size="small"
                    :disabled="!canEditNewQuestionType"
                    @change="handleAddSetType('questionType','new')"
                  >
                    <el-option
                      v-for="(item,key) in addSelectQTypes"
                      :key="'add' + key"
                      :label="item"
                      :value="key"
                    ></el-option>
                  </el-select>
                  <el-button
                    style="margin-left:12px;"
                    size="mini"
                    type="primary"
                    v-if="canEditNewQuestionType"
                    :disabled="add_topic_type == ''"
                    @click="saveQuestion('new')"
                  >Save</el-button>
                  <p
                    v-if="canEditNewQuestionType"
                    style="padding-left:120px;color:#f00;font-size:12px;margin-top:4px;"
                  >Once set, it cannot be changed anymore</p>
                </div>
                <!-- <div class="extra-part-btn">
                  <div>
                    <el-button
                    v-if="addNewFields.newFieldsBool"
                    type="primary"
                    size="small"
                    @click="saveNewFieds('add')"
                  >Save</el-button>
                  <el-button
                    v-if="addNewFields.newFieldsBool"
                    size="small"
                    @click="cancelNewFieds('add')"
                  >Cancel</el-button>
                  </div>
                  <el-button
                    class="edit-button-hint"
                    v-if="!addNewFields.newFieldsBool"
                    type="primary"
                    plain
                    size="small"
                    icon="el-icon-edit"
                    @click="addNewFields.newFieldsBool = !addNewFields.newFieldsBool"
                  >Edit</el-button>
                </div> -->
              </div>
              <div class="info">
                <span class="fl">Practice As：</span>
                <el-select
                  v-model="add_practice_type"
                  size="small"
                  :disabled="canEditNewQuestionType"
                  :placeholder="canEditNewQuestionType ? 'save type first' : 'choose'"
                  @change="handleAddSetType('practiceType','new')"
                >
                  <el-option
                    v-for="(item,key) in addSelectPTypes"
                    :key="'add' + key"
                    :label="item"
                    :value="key"
                  ></el-option>
                </el-select>
              </div>
              <div class="info" v-if="from == 'activity'">
                <span class="fl">Instruction：</span>
                <el-input
                  v-model="addNewFields.detailMsg.instruction"
                  class="instruction-text-area"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  >
                </el-input>
              </div>
              <div class="info" v-if="from == 'activity' && (add_practice_type == 6 || add_practice_type == 23 || add_practice_type == 22)">
                <span class="fl">Feedback：</span>
                <el-select
                  v-model="addNewFields.detailMsg.feedback"
                  placeholder="ChooseType"
                  size="small"
                >
                  <el-option
                    v-for="(op,key) in addNewFields.feedbackOpotion"
                    :key="'ptype' + key"
                    :label="op"
                    :value="key"
                  ></el-option>
                </el-select>
              </div>
              <div class="info" v-if="from == 'activity' && add_practice_type == 11">
                <!-- <div class="info" v-if="from == 'activity'"> -->
                <span class="fl">Show Prompt：</span>
                <el-switch
                  v-model="addNewFields.detailMsg.show_prompt"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  >
                </el-switch>
              </div>
            </div>
          </section>
          <section class="section-bottom flex-box">
            <div class="g-clearfix preview-left" v-if="add_topic_type != ''">
              <span style="display:block;margin-bottom:20px;">
                Preview
                <el-button
                  class="fr"
                  type="primary"
                  plain
                  size="small"
                  icon="el-icon-edit"
                  @click="goLibs(searchQuestionId)"
                >Edit</el-button>
              </span>
              <component :is="addComponent" :type="add_topic_type" :previewData="addPreviewQuestion" :childList = "quesitionAddChildList" :qmLink="qm_op_link"></component>
            </div>
            <div class="section-right preview-right">
              <h3>Addition:</h3>
              <!-- error tip -->
              <div class="info error-wrap g-clearfix" v-if="errorAdd.errorMsg.error_feedback.id">
                <div class="hint-button-wrap">
                  <span class="fl" style="margin-bottom:12px;margin-top:12px;">Hint:</span>
                  <div>
                    <el-button
                      v-if="errorAdd.errorMsgBool"
                      type="primary"
                      size="small"
                      @click="saveErrFb('add','hint')"
                    >Save</el-button>
                    <el-button
                      v-if="errorAdd.errorMsgBool"
                      size="small"
                      @click="cancelEdit('add','hint')"
                    >Cancel</el-button>
                  </div>
                  <el-button
                    class="edit-button-hint"
                    v-if="!errorAdd.errorMsgBool"
                    type="primary"
                    size="small"
                    plain
                    icon="el-icon-edit"
                    @click="errorAdd.errorMsgBool = !errorAdd.errorMsgBool"
                  >Edit</el-button>
                </div>
                <div class="text-area-wrap">
                  <el-input
                    class="error-text-area"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入内容"
                    :disabled="!errorAdd.errorMsgBool"
                    v-model="errorAdd.errorMsg.error_feedback.hint">
                  </el-input>
                </div>
                <!-- Correct Feedback -->
                <div class="hint-button-wrap" v-if="errorAdd.errorMsg.error_feedback.has_correct_feedback == 1">
                  <span class="fl" style="margin-bottom:12px;margin-top:12px;">Correct Feedback:</span>
                  <div>
                    <el-button
                    v-if="errorAdd.correctFeedBool"
                    type="primary"
                    size="small"
                    @click="saveErrFb('add','correct')"
                  >Save</el-button>
                  <el-button
                    v-if="errorAdd.correctFeedBool"
                    size="small"
                    @click="cancelEdit('add','correct')"
                  >Cancel</el-button>
                  </div>
                  <el-button
                    class="edit-button-hint"
                    v-if="!errorAdd.correctFeedBool"
                    type="primary"
                    plain
                    size="small"
                    icon="el-icon-edit"
                    @click="errorAdd.correctFeedBool = !errorAdd.correctFeedBool"
                  >Edit</el-button>
                </div>
                <!-- <div class="location error fl"> -->
                  <div class="text-area-wrap"v-if="errorAdd.errorMsg.error_feedback.has_correct_feedback == 1" >
                    <el-input
                      :disabled="!errorAdd.correctFeedBool"
                      class="error-text-area"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      v-model="errorAdd.errorMsg.error_feedback.correct_feedback">
                    </el-input>
                  </div>
                <!-- </div> -->
              </div>
              <!-- error 解析 -->
              <div class="explain-error-wrap">
                <div class="explain-error-con" v-if="errorAdd.errorMsg.error_feedback.has_error_general == 1 || errorAdd.errorMsg.error_feedback.has_error_option == 1">
                  <div class="hint-button-wrap error-feedback-btn">
                    <h3 class="explain-error-wrap-h3">Error Feedback:</h3>
                    <div>
                      <el-button
                      v-if="errorAdd.errorFeedBool"
                      type="primary"
                      size="small"
                      @click="saveErrFb('add','feedback')"
                    >Save</el-button>
                    <el-button
                      v-if="errorAdd.errorFeedBool"
                      size="small"
                      @click="cancelEdit('add','feedback')"
                    >Cancel</el-button>
                    </div>
                    <el-button
                      class="edit-button-hint"
                      v-if="!errorAdd.errorFeedBool"
                      type="primary"
                      plain
                      size="small"
                      icon="el-icon-edit"
                      @click="errorAdd.errorFeedBool = !errorAdd.errorFeedBool"
                    >Edit</el-button>
                  </div>
                  <div v-if="errorAdd.errorMsg.error_feedback.has_error_general == 1">
                    <p>General:</p>
                    <el-input
                      class="error-text-area"
                      type="textarea"
                      :rows="4"
                      placeholder="请输入内容"
                      :disabled="!errorAdd.errorFeedBool"
                      v-model="errorAdd.errorMsg.error_feedback.question_feedback">
                    </el-input>
                  </div>
                  <div v-if="errorAdd.errorMsg.error_feedback.option_feedback && errorAdd.errorMsg.error_feedback.has_error_option == 1">
                    <div class="explain-option" v-for="(val,key,index) in errorAdd.errorMsg.error_feedback.option_feedback" :key="index">
                      <span>{{key}} : </span>
                      <el-input
                        class="error-text-area"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        :disabled="!errorAdd.errorFeedBool"
                        v-model="errorAdd.errorMsg.error_feedback.option_feedback[key]">
                      </el-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </div>
        </el-drawer>
      </el-col>
      <el-drawer
      class="drawer-show"
      :visible.sync="drawer"
      :with-header="false"
      :modal = "true"
      :modal-append-to-body = "false"
      size="70%">
        <!-- <el-col> -->
          <el-col :span="showDetail ? 24 : 0">
          <div v-if="showDetail" class="qdetail-ques_detail" v-loading="detailLoading">
            <section class="section-top">
              <h3>
                <!-- Basics -->
                <el-popover
                  class="fr"
                  placement="top"
                  width="160"
                  v-model="detachPop"
                  v-if="from == 'activity'"
                >
                  <p>Do you mean to detach this question from this activity?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="detachPop = false">Cancel</el-button>
                    <el-button type="primary" size="mini" @click="detach">Detach</el-button>
                  </div>
                  <el-button type="danger" slot="reference" plain size="small">Detach</el-button>
                </el-popover>
              </h3>
              <div class="info h3 g-clearfix">
                <span class="fl">Question ID：</span>
                {{ curRowData.id }}
              </div>
              <div :class="{change_warp:true,mart100:this.from=='activity'}">
                 <p :class="{ unable:changePrevUnable }" @click="changePrev"> < Prev</p><p :class="{ unable:changeNextUnable }"  @click="changeNext">Next ></p>
              </div>
              <div class="question-type-wrap">
                <div class="info g-clearfix">
                  <span class="fl">Question Type：</span>
                  <el-select
                    v-model="show_topic_type"
                    placeholder="ChooseType"
                    :disabled="!canEditShowQuestionType"
                    size="small"
                    style="margin-right:8px"
                    @change="handleSetType('questionType','edit')"
                  >
                    <el-option
                      v-for="(op,key) in selectQTypes"
                      :key="'qtype'+ key"
                      :label="op"
                      :value="key"
                    ></el-option>
                  </el-select>
                  <el-button
                    size="small"
                    type="primary"
                    v-if="canEditShowQuestionType"
                    :disabled="show_topic_type == ''"
                    @click="saveQuestion('show')"
                  >Save</el-button>
                  <p
                    v-if="canEditShowQuestionType"
                    style="padding-left:120px;color:#f00;font-size:12px;margin-top:4px;"
                  >Once set, it cannot be changed anymore</p>
                </div>
                <div v-if="from == 'activity'" class="extra-part-btn">
                  <div>
                    <el-button
                    v-if="editNewFields.newFieldsBool"
                    type="primary"
                    size="small"
                    @click="saveNewFieds('edit')"
                  >Save</el-button>
                  <el-button
                    v-if="editNewFields.newFieldsBool"
                    size="small"
                    @click="cancelNewFieds('edit')"
                  >Cancel</el-button>
                  </div>
                  <el-button
                    class="edit-button-hint"
                    v-if="!editNewFields.newFieldsBool"
                    type="primary"
                    plain
                    size="small"
                    icon="el-icon-edit"
                    @click="editNewFields.newFieldsBool = !editNewFields.newFieldsBool"
                  >Edit</el-button>
                </div>
              </div>
              <div class="info g-clearfix" v-if="from == 'activity'">
                <span class="fl">Practice As：</span>
                <el-select
                  v-model="show_practice_type"
                  placeholder="ChooseType"
                  size="small"
                  @change="handleSetType('practiceType','edit')"
                >
                  <el-option
                    v-for="(op,key) in selectPTypes"
                    :key="'ptype' + key"
                    :label="op"
                    :value="key"
                  ></el-option>
                </el-select>
              </div>
              <div class="info" v-if="from == 'activity'">
                <span class="fl">Instruction：</span>
                <el-input
                  v-model="editNewFields.detailMsg.instruction"
                  class="instruction-text-area"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  :disabled="!editNewFields.newFieldsBool"
                  >
                </el-input>
              </div>
              <div class="info" v-if="from == 'activity' && (show_practice_type == 6 || show_practice_type == 23 || show_practice_type == 22)">
                <span class="fl">Feedback：</span>
                <el-select
                  v-model="editNewFields.detailMsg.feedback"
                  placeholder="ChooseType"
                  size="small"
                  :disabled="!editNewFields.newFieldsBool"
                >
                  <el-option
                    v-for="(op,key) in editNewFields.feedbackOpotion"
                    :key="'ptype' + key"
                    :label="op"
                    :value="key"
                  ></el-option>
                </el-select>
              </div>
              <div class="info" v-if="from == 'activity' && show_practice_type == 11">
                <!-- <div class="info" v-if="from == 'activity'"> -->
                <span class="fl">Show Prompt：</span>
                <el-switch
                  v-model="editNewFields.detailMsg.show_prompt"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  :disabled="!editNewFields.newFieldsBool">
                </el-switch>
              </div>
              <div class="info g-clearfix">
                <span class="fl" style="margin-bottom:12px;">Nested in：</span>
                <div class="location fl" :class="{nestedInBox: addMoreBool}">
                  <!-- 所属的activity位置 -->
                  <div
                    class="location-p"
                    v-for="(lo,index) in qLocation.activity"
                    :key="'activity' + index"
                  >
                    <p v-if="lo.location.length">
                      <a v-if="lo.mode == 1" :href="`./unitconfig?unit_id=${lo.id}`">
                        <span class="location-span" v-if="item.courses[0]"  v-for="item in lo.location" :key="'aclo' + item.id">
                          {{ item.courses[0].name }}
                          /
                          {{ item.en_name }}
                          /
                          {{ lo.name }}
                        </span>
                      </a>
                      <a v-if="lo.mode == 2" :href="`./assessmentconfig?activity_id=${lo.id}`">
                        <span class="location-span" v-if="item.courses[0]"  v-for="item in lo.location" :key="'aclo' + item.id">
                          {{ item.courses[0].name }}
                          /
                          {{ item.en_name }}
                          /
                          {{ lo.name }}
                        </span>
                      </a>
                    </p>
                  </div>
                  <!-- 所属的script位置 -->
                  <div
                    class="location-p"
                    v-for="(lo,index) in qLocation.script"
                    :key="'script' + lo.id"
                  >
                    <p v-if="lo.location.length">
                      <a :href="`./unitconfig?unit_id=${lo.id}`">
                        <span class="location-span" v-if="item.courses[0]"   v-for="item in lo.location" :key="'sclo' + item.id">
                          {{ item.courses[0].name }}
                          /
                          {{ item.en_name }}
                          /
                          {{ lo.name }}
                        </span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="add-nested" v-show="addMoreBool && (qLocation.script.length + qLocation.activity.length) > 1 " @click="addMoreBool = !addMoreBool">
                <p class="add-other">
                  And other {{qLocation.script.length + qLocation.activity.length - 1}}
                  <span class="el-icon-arrow-down"></span></p>
              </div>
            </section>
            <!-- 下半部分 -->
            <section class="section-bottom flex-box">
              <div class="preview preview-left" v-if="show_topic_type">
                <h3>
                  Preview
                  <el-button
                    class="fr"
                    type="primary"
                    plain
                    size="small"
                    icon="el-icon-edit"
                    @click="goLibs(curQuestionId)"
                  >Edit</el-button>
                </h3>
                <div>
                  <component
                    :is="showComponent"
                    :type="show_topic_type"
                    :previewData="showPreviewQuestion"
                    :childList="quesitionShowChildList"
                    :qmLink="qm_op_link"
                  ></component>
                </div>
              </div>
              <section class="preview-right">
                <h3>Addition:</h3>
                   <!-- error tip -->
                <div v-if="errorEdit.errorMsg.error_feedback">
                  <div class="info error-wrap g-clearfix" v-if="errorEdit.errorMsg.error_feedback.id">
                      <div class="hint-button-wrap">
                        <span class="fl" style="margin-bottom:12px;margin-top:12px;">Hint:</span>
                        <div>
                          <el-button
                          v-if="errorEdit.errorMsgBool"
                          type="primary"
                          size="small"
                          @click="saveErrFb('edit','hint')"
                        >Save</el-button>
                        <el-button
                          v-if="errorEdit.errorMsgBool"
                          size="small"
                          @click="cancelEdit('edit','hint')"
                        >Cancel</el-button>
                        </div>
                        <el-button
                          class="edit-button-hint"
                          v-if="!errorEdit.errorMsgBool"
                          type="primary"
                          plain
                          size="small"
                          icon="el-icon-edit"
                          @click="errorEdit.errorMsgBool = !errorEdit.errorMsgBool"
                        >Edit</el-button>
                      </div>
                      <div class="text-area-wrap">
                        <el-input
                          class="error-text-area"
                          type="textarea"
                          :rows="4"
                          placeholder="请输入内容"
                          :disabled="!errorEdit.errorMsgBool"
                          v-model="errorEdit.errorMsg.error_feedback.hint">
                        </el-input>
                      </div>
                      <!-- Correct Feedback -->
                      <div class="hint-button-wrap" v-if="errorEdit.errorMsg.error_feedback.has_correct_feedback == 1">
                        <span class="fl" style="margin-bottom:12px;margin-top:12px;">Correct Feedback:</span>
                        <div>
                          <el-button
                          v-if="errorEdit.correctFeedBool"
                          type="primary"
                          size="small"
                          @click="saveErrFb('edit','correct')"
                        >Save</el-button>
                        <el-button
                          v-if="errorEdit.correctFeedBool"
                          size="small"
                          @click="cancelEdit('edit','correct')"
                        >Cancel</el-button>
                        </div>
                        <el-button
                          class="edit-button-hint"
                          v-if="!errorEdit.correctFeedBool"
                          type="primary"
                          plain
                          size="small"
                          icon="el-icon-edit"
                          @click="errorEdit.correctFeedBool = !errorEdit.correctFeedBool"
                        >Edit</el-button>
                      </div>
                      <div class="text-area-wrap" v-if="errorEdit.errorMsg.error_feedback.has_correct_feedback == 1">
                        <el-input
                          class="error-text-area"
                          type="textarea"
                          :rows="4"
                          placeholder="请输入内容"
                          :disabled="!errorEdit.correctFeedBool"
                          v-model="errorEdit.errorMsg.error_feedback.correct_feedback">
                        </el-input>
                    </div>
                  </div>
                </div>
                
                <!-- error 解析 -->
                <div class="explain-error-wrap" v-if="errorEdit.errorMsg.error_feedback">
                  <div class="explain-error-con" v-if="errorEdit.errorMsg.error_feedback.has_error_general == 1 || errorEdit.errorMsg.error_feedback.has_error_option == 1 ">
                    <div class="hint-button-wrap error-feedback-btn">
                      <h3 class="explain-error-wrap-h3">Error Feedback:</h3>
                      <div>
                        <el-button
                        v-if="errorEdit.errorFeedBool"
                        type="primary"
                        size="small"
                        @click="saveErrFb('edit','feedback')"
                      >Save</el-button>
                      <el-button
                        v-if="errorEdit.errorFeedBool"
                        size="small"
                        @click="cancelEdit('edit','feedback')"
                      >Cancel</el-button>
                      </div>
                      <el-button
                        class="edit-button-hint"
                        v-if="!errorEdit.errorFeedBool"
                        type="primary"
                        plain
                        size="small"
                        icon="el-icon-edit"
                        @click="errorEdit.errorFeedBool = !errorEdit.errorFeedBool"
                      >Edit</el-button>
                    </div>
                    <div v-if="errorEdit.errorMsg.error_feedback.has_error_general == 1">
                      <p>General:</p>
                      <el-input
                        class="error-text-area"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        :disabled="!errorEdit.errorFeedBool"
                        v-model="errorEdit.errorMsg.error_feedback.question_feedback">
                      </el-input>
                    </div>
                    <div v-if="errorEdit.errorMsg.error_feedback.option_feedback && errorEdit.errorMsg.error_feedback.has_error_option == 1 ">
                      <div class="explain-option" v-for="(val,key,index) in errorEdit.errorMsg.error_feedback.option_feedback" :key="index">
                        <span>{{key}} : </span>
                        <el-input
                          class="error-text-area"
                          type="textarea"
                          :rows="4"
                          placeholder="请输入内容"
                          :disabled="!errorEdit.errorFeedBool"
                          v-model="errorEdit.errorMsg.error_feedback.option_feedback[key]">
                        </el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </div>
        </el-col>
      </el-drawer>
    </el-row>
  </div>
</template>
<script>
import api from "@/api";
import draggable from "vuedraggable";
const choiceType = () =>
  import("@/views/adaptive/components/preview/choiceType");
const audioType = () => import("@/views/adaptive/components/preview/audioType");
const readingType = () =>
  import("@/views/adaptive/components/preview/readingType");
const allType = () =>
  import("@/views/adaptive/components/preview/allType");
export default {
  name: "quesDetail",
  data() {
    return {
      questionList: [],
      showDetail: false,
      show_topic_type: "", // 点击表格后，显示详情
      show_practice_type: "", // 点击表格后，显示详情
      add_topic_type: "", // 点击add的数据
      add_practice_type: "", // 点击add的数据
      selectQTypes: {}, // 处理后的qtypes
      selectPTypes: {}, // 处理后的ptypes
      qtypes: {}, // 题目类型
      curRowData: {}, // 表格内当前点击的数据
      originQuestions: [], //接口返回原始的question
      topic_types: [], // question type映射关系
      pracitice_types: {}, // 练习方式的映射关系
      curQuestionId: "",
      searchQuestionId: "", // 搜索的question id
      qLocation: {
        activity: [],
        script: []
      }, // 题目位置
      singleQuestion: {}, // 单题题目详情--添加使用
      showPreviewQuestion: {},
      addPreviewQuestion: {},
      addSelectQTypes: {}, // add状态下筛选 questioin type
      addSelectPTypes: {}, // add状态下筛选 practice type
      pageTotal: 0,
      loading: true,
      detailLoading: true,
      canEditShowQuestionType: true, // 是否可编辑 右侧展示的quesiton typoe
      canEditNewQuestionType: true, // 是否可以编辑 add quesiton type
      saveSuccess: false,
      curClickIndex: -1,
      drag: false,
      canRank: true,
      detachPop: false, // 解绑的确认弹层
      noQuestionid: "",
      qm_op_link: "",
      errorEdit:{
        errorMsgBool: false, //错误编辑
        errorMsg:{},
        oldErrorMsg:'',
        errorFeedBool: false, //错误feedback编辑
        correctFeedBool: false
      },
      errorAdd:{
        errorMsgBool: false, //错误新增题目
        errorMsg:{},
        oldErrorMsg:'',
        errorFeedBool: false, //错误feedback编辑
        correctFeedBool: false
      },
      qListStr:'',//多个题目ID
      quesitionShowChildList:[],//多个子题目
      quesitionAddChildList:[],
      oldIdArray: [],//保存原始数组ID
      drawer: false, //抽屉
      drawerAddBool: false, //新增关联题目抽屉
      addMoreBool: true, //nested in 展开
      questionPage: 1, //activity下question当前页数
      questionLimit: 10, //activity下question每次请求最大限制个数
      actiQuestionTotal: 0, //activity下question总共的个数
      goToObj: { //goto 数据
        to_types: {},
        score_types: {},
        to_type_details_common: { //公共选项
          0: "None",
          1: "Question"
        },
        to_type_details_choice: { //选择选项
          0: "None",
          1: "Question",
          3: "Option"
        },
        to_type_details_speech: { //score 选项
          0: "None",
          1: "Question",
          2: "Score"
        }
      },
      addNewFields:{ //activity下question新增字段数据
        detailMsg:{
          activity_id: "",
          instruction: "",
          show_prompt: true,
          feedback: "0",
        },
        feedbackOpotion: {
          0: "None",
          1: "Speech rates"
        },
        oldDetailMsg: '',
        newFieldsBool: false
      },
      editNewFields:{ //activity下question新增字段数据
        detailMsg:{
          activity_id: "",
          instruction: "",
          show_prompt: true,
          feedback: "0",
        },
        feedbackOpotion: {
          0: "None",
          1: "Speech rates"
        },
        oldDetailMsg: '',
        newFieldsBool: false
      },
      // rankBool: false,
      questionList_length: 0,
      scrollBool: true,
      editGoToBool: true, //编辑goto逻辑
      goToListArr:[], //获取gotonumber列表
      saveGoList:[], //保存修改的goto内容
      fromChangeNext:false,//是否来自抽屉 next
      fromChangePrev:false,//是否来自抽屉 prev
      changeNextUnable:false,//是否禁用抽屉next
      changePrevUnable:false//是否禁用抽屉prev
    };
  },
  props: {
    from: {
      type: String,
      default: "activity",
      required: true
    },
    filter: {
      type: Object,
      required: false
    },
    qmtype: {
      type: Object,
      required: false
    },
    courseId: {
      type: Number,
      default: 999,
      required: false
    }
  },
  watch: {
    filter: {
      handler(oldVal, newVal) {
        if (newVal) {
          this.curClickIndex = -1;
          this.showDetail = false;
          this.getQuestion("cancel");
        }
      },
      deep: true,
      immediate: true
    },
    searchQuestionId(val) {
      this.noQuestionid = "";
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: this.canRank,
        ghostClass: "ghost"
      };
    },
    showComponent() {
      let map = {
        1: choiceType,
        2: choiceType,
        3: choiceType,
        4: choiceType,
        5: choiceType,
        6: audioType,
        7: audioType,
        8: readingType,
        9: audioType,
        10: audioType,
        11: audioType,
        12: choiceType,
        13: choiceType,
        17: choiceType,
        18: choiceType,
        19: choiceType,
        20: choiceType,
        21: choiceType,
        22: allType,
        23: allType
      };
      return map[this.show_topic_type];
    },
    addComponent() {
      let map = {
        1: choiceType,
        2: choiceType,
        3: choiceType,
        4: choiceType,
        5: choiceType,
        6: audioType,
        7: audioType,
        8: readingType,
        9: audioType,
        10: audioType,
        11: audioType,
        12: choiceType,
        13: choiceType,
        17: choiceType,
        18: choiceType,
        19: choiceType,
        20: choiceType,
        21: choiceType,
        22: allType,
        23: allType
      };
      return map[this.add_topic_type];
    },
      // disabled () {
      //   return this.questionList_length >= this.actiQuestionTotal
      // }
  },
  
  components: {
    draggable,
    choiceType,
    audioType,
    readingType
  },
  created() {
    
    if(this.from == 'activity'){
      this.getGoToList(); //获取题目gotoList
      this.getQuestion();
    } else {
      this.getQuestion("cancel");
    }
  },
  beforeDestroy() {
    this.$bus.off("setScrollId", { id: "scrollView" });
  },
  methods: {
    /**
     * 获取对应的question list
     */
    async getQuestion(cancel,rank) {
      this.scrollBool = true;
      try {
        let res = {};
        if (this.from == "activity") {
          if(rank == 'rank'){
            this.questionPage = 1
          }
          // console.log(addmore)
          // // 停止滚动加载
          // if(this.questionList.length >= this.actiQuestionTotal && addmore == "addmore")return;

          res = await this.$http._get(
            api.actitityQuestion,{
              activity_id: this.$route.query.activity_id,
              page: this.questionPage,
              limit: this.questionLimit
            }
          );
        } else {
          res = await this.$http._get(api.questionList, this.filter);
        }
        if (res.status == 200) {
          this.loading = false;
          this.oldIdArray = [];
          let _ques = []; // 整理后的quesiton数据
          this.actiQuestionTotal = res.result.total; //activity下总共的问题数
          res.result.questions.forEach((el, index) => {
            // if(this.from == "activity"){
            //   el["activity_detail"]["tos"].forEach(val => {
            //     val.option_id = val.option_id.toString();
            //     val.target_id = val.target_id.toString();
            //   });
            // }
            _ques.push({
              // index: index,
              id: el["question_detail"]["id"],
              type: el["question_detail"]["type"],
              type_content:
                this.from == "activity"
                  ? el["question_practice"]["type_content"]
                  : el["question_topic"]["type_content"],
              html_content: el["question_detail"]["ets_html_content"],
              detail_id: el["activity_detail"]
                ? el["activity_detail"]["id"]
                : "",
                to_type: this.from == "activity" ? el["activity_detail"]["to_type"].toString() : '',
                seq_num: this.from == "activity" ? el["activity_detail"]["seq"] : '',
                question_practice_type: this.from == "activity" ? el["question_practice"]["practice_type"] : '',
                tos: this.from == "activity" ? el["activity_detail"]["tos"] : '',
                question_options: this.from == "activity" ? el["question_options"] : '',
                activity_detail: el["activity_detail"],
            }); 
            // console.log(el)
            this.oldIdArray.push(el["question_detail"]["id"]);
          });
          if (this.from == "activity"){
            if(cancel == 'cancel'){
              this.questionList = _ques;
              this.originQuestions = res.result.questions;
            } else {
              // this.rankBool = true;
              this.questionList = this.questionList.concat(_ques); // 题目列表（渲染表格）
              this.originQuestions = this.originQuestions.concat(res.result.questions);
            }
            // console.log(this.originQuestions)
            this.questionList_length = this.questionList.length;
            if(this.questionList_length >= this.actiQuestionTotal){
              this.scrollBool = true;
            } else {
              this.scrollBool = false;
            }
            this.goToObj.to_types = res.result.go_tos.to_types;
            this.goToObj.score_types = res.result.go_tos.to_type_details["2"]
          } else {
            this.questionList = _ques; // 题目列表（渲染表格）
            this.originQuestions = res.result.questions;
          }
           // 接口返回原始的question数据
          this.qtypes = res.result.types;
          this.topic_types = res.result.topic_types; // question type对应的映射关系
          this.pracitice_types = res.result.pracitice_types;
          this.pageTotal = res.result.total;
          this.qm_op_link = res.result.qm_op_link;
          if(this.fromChangeNext){
            this.currentRowChange(this.questionList[0]);
            this.fromChangeNext=false;
          }
          if(this.fromChangePrev){
            this.currentRowChange(this.questionList[this.questionList.length-1]);
            this.fromChangePrev=false;
          }
        } else {
          this.$message({
            offset: 60,
            duration:1000,
            type: "error",
            message: res.message
          });
        }
      } catch (error) {}
    },
    /**
     * 批量获取题目
    */
    getChildList(item,way){
      // console.log(item)
      if(item.child && item.child.length > 0){
        this.qListStr = '';
        item.child.forEach(val => {
          this.qListStr += val.id + ","
        });
        this.$http._get(api.getChildList,{
          ids:this.qListStr
        }).then((res)=>{
          if(res.status == 200){
            item.child = res.result.questions
            if(way){
              this.quesitionShowChildList = res.result.questions;
            } else {
              this.quesitionAddChildList = res.result.questions;
            }
            item.child.forEach(val=>{
              if(val.child && val.child.length){
                this.getChildList(val)
              }
            })
          }
        }).catch((err)=>{console.log(err)})
      }
    },
    /**
     * 获取单题题目详情
     */
    async getSingleQuestion(qid, way) {
      let { result, status, message } = await this.$http._get(
        api.getSingleQues(qid)
      );
      if (status == 200) {
        if(result.question.question.project == 7){
          this.saveSuccess = true;
          if (way) {
            this.errorEdit = {
              errorMsgBool: false, //错误编辑
              errorMsg:{},
              oldErrorMsg:'',
              errorFeedBool: false, //错误feedback编辑
              correctFeedBool: false
            }
            // error_feedback为空的时候设置空对象
            let resultMsg = result.question;
            if(resultMsg.error_feedback.option_feedback == "" || resultMsg.error_feedback.option_feedback == null){
              resultMsg.error_feedback.option_feedback = {}
              resultMsg.answer.forEach((ele)=>{
                resultMsg.error_feedback.option_feedback[ele.option_name] = ""
              })
            }
            if(resultMsg.error_feedback.question_feedback == "" || resultMsg.error_feedback.question_feedback == undefined){
              resultMsg.error_feedback.question_feedback = ""
            }
            this.errorEdit.errorMsg = Object.assign({},this.errorEdit.errorMsg,resultMsg)
            this.errorEdit.oldErrorMsg = JSON.stringify(resultMsg)
            this.showPreviewQuestion = result.question;
            if(this.showPreviewQuestion.child.length > 0){
              this.getChildList(this.showPreviewQuestion,way)
            }
          } else {
            this.errorAdd = {
              errorMsgBool: false, //错误新增题目
              errorMsg:{},
              oldErrorMsg:'',
              errorFeedBool: false, //错误feedback编辑
              correctFeedBool: false
            }
            let resultMsg = result.question;
            // error_feedback为空的时候设置空对象
            if(resultMsg.error_feedback.option_feedback == "" || resultMsg.error_feedback.option_feedback == null){
              resultMsg.error_feedback.option_feedback = {}
              resultMsg.answer.forEach((ele)=>{
                resultMsg.error_feedback.option_feedback[ele.option_name] = ""
              })
            }
            this.errorAdd.errorMsg = Object.assign({},this.errorAdd.errorMsg,resultMsg)
            this.errorAdd.oldErrorMsg = JSON.stringify(resultMsg)
            this.addPreviewQuestion = result.question;
            this.singleQuestion = result.question["question"];
            if(this.addPreviewQuestion.child.length > 0){
              this.getChildList(this.addPreviewQuestion,way)
            }
            if(this.from == "activity"){
              this.getActQuMsg(result.question.question.id,"add");
            }
          } 
        } else {
          this.$message({
            offset: 60,
            duration:1000,
            type: "error",
            message: '题目未找到'
          });
        }
      } else {
        this.$message({
          offset: 60,
          duration:1000,
          type: "error",
          message: message
        });
      }
    },
    /**
    * 循环遍历获取当前题目新增的字段信息
    */
    getActQuMsg(qid,type){

      this.questionList.forEach((ele)=>{
        if(ele.activity_detail.id == qid){
          this.editNewFields = { //activity下question新增字段数据
              detailMsg:{
                activity_id: ele.activity_detail.id,
                instruction: ele.activity_detail.instruction == "" ? "" : ele.activity_detail.instruction ,
                show_prompt: ele.activity_detail.show_prompt === "" ? true : !!ele.activity_detail.show_prompt ,
                feedback: ele.activity_detail.feedback_type == "" ? "0" : ele.activity_detail.feedback_type.toString() ,
              },
              feedbackOpotion: {
                0: "None",
                1: "Speech rates"
              },
              newFieldsBool: false
            };
            this.editNewFields.oldDetailMsg = JSON.stringify(this.editNewFields.detailMsg)
          } else {
            this.addNewFields = { //activity下question新增字段数据
              detailMsg:{
                activity_id: "",
                instruction: "",
                show_prompt: true,
                feedback: "0",
              },
              feedbackOpotion: {
                0: "None",
                1: "Speech rates"
              },
              oldDetailMsg: '',
              newFieldsBool: false
            };
            this.addNewFields.oldDetailMsg = JSON.stringify(this.addNewFields.detailMsg)
          }
      })
    },
    /**
     * 保存新增activity下question字段
     *
     */
    saveNewFieds(type,id){
      if(type == "edit"){
        var saveQuMsg = {
          id: this.editNewFields.detailMsg.activity_id,
          instruction:this.editNewFields.detailMsg.instruction,
          show_prompt: Number(this.editNewFields.detailMsg.show_prompt),
          feedback_type: Number(this.editNewFields.detailMsg.feedback)
        }
      } else {
        var saveQuMsg = {
          id: id,
          instruction:this.addNewFields.detailMsg.instruction,
          show_prompt: Number(this.addNewFields.detailMsg.show_prompt),
          feedback_type: Number(this.addNewFields.detailMsg.feedback)
        }
      }
      
      this.$http._post(api.saveNewFieds,saveQuMsg).then((res)=>{
        if(res.status == 200){
          if(type == "edit"){
            this.editNewFields.newFieldsBool = !this.editNewFields.newFieldsBool;
            this.editNewFields.oldDetailMsg = JSON.stringify(this.editNewFields.detailMsg);
            this.questionPage = 1;
            this.getQuestion("cancel")
          } else {
            this.addNewFields.newFieldsBool = !this.addNewFields.newFieldsBool;
            this.addNewFields.oldDetailMsg = JSON.stringify(this.addNewFields.detailMsg);
          }
          this.$message({
            offset: 60,
            duration:1000,
            type: "success",
            message: "save success"
          });
          
        }
      })
    },
    /**
     * 取消新增字段编辑
    */
    cancelNewFieds(type){
      if(type == "edit"){
        this.editNewFields.detailMsg = JSON.parse(this.editNewFields.oldDetailMsg);
        this.editNewFields.newFieldsBool = !this.editNewFields.newFieldsBool;
      } else {
        this.addNewFields.detailMsg = JSON.parse(this.addNewFields.oldDetailMsg);
        this.addNewFields.newFieldsBool = !this.addNewFields.newFieldsBool;
      }
      
    },
    /**
     * 获取题目的练习方式
     * @param {Object} param 请求的参数
     * @param {Number|String} type 当前题目的类型（从题库返回）
     */
    async getPracticeWay(param, type) {
      let { result } = await this.$http._get(api.getPracticeWay, param);
      // 当前题目的题目类型（question_type）
      let curQuestionType = result.topic_types[type];
      let showQuestionType = {};
      for (let t in result.types) {
        if (curQuestionType.includes(Number(t))) {
          showQuestionType[t] = result.types[t];
        }
      }
      this.addSelectQTypes = showQuestionType;
      if (result.question["question_topic"]["topic_type"]) {
        this.canEditNewQuestionType = false;
        this.add_topic_type = result.question["question_topic"][
          "topic_type"
        ].toString();
        // 根据当前题目类型去查找对应练习方式可选择的范围
        let pTypeArea = result.pracitice_types[this.add_topic_type];
        // 根据可选择的范围去筛选要展示的数据
        let showPracticeType = {};
        pTypeArea.forEach(el => {
          showPracticeType[el] = result.types[el];
        });
        this.addSelectPTypes = showPracticeType;
        if (Object.keys(this.addSelectPTypes).length > 0) {
          this.add_practice_type = Object.keys(
            this.addSelectPTypes
          )[0].toString();
        }
      } else {
        this.add_topic_type = "";
        this.canEditNewQuestionType = true;
      }
      if (result.question["question_practice"]["practice_type"]) {
        this.add_practice_type = result.question["question_practice"][
          "practice_type"
        ].toString();
      }
    },
    /**
     * 获取question 位置
     */
    async questionLocation(id) {
      let { result } = await this.$http._get(api.questionLocation(id));
      this.qLocation["activity"] = this.handleLocationData(
        result.locations[`${id}`]["activity"],
        result.sheets
      );
      this.qLocation["script"] = this.handleLocationData(
        result.locations[`${id}`]["script"],
        result.sheets
      );
      this.detailLoading = false;
    },
    /**
     * 选中表格的某一行
     */
    async currentRowChange(val) {
      if (!val) return;
      this.drawer = true;
      this.curClickIndex = val.seq_num - 1; // 当前点击的行
      this.detailLoading = true;
      this.getSingleQuestion(val.id, "click"); // 获取题目详情
      this.questionLocation(val.id); // 获取题目位置
      this.showDetail = true; // 展示右侧详细信息
      this.curQuestionId = val.id; // 当前点击的question id
      this.curRowData = val; // 当前点击的数据（表格中带回的数据）
      // let curOriginQues = this.originQuestions[val.index]; // 当前点击的原始数据
      if(this.from == "activity"){
        this.getActQuMsg(val.activity_detail.id,"edit");
      }
      // 当前点击的原始数据
      let curOrginArr = this.originQuestions.filter(ele =>{
        return ele.question_detail.id == val.id
      })
      let curOriginQues = curOrginArr[0]
      // 获取当前点击question的题目类型 val.type 题库中返回的题目类型
      let curQuestionType = this.topic_types[val.type];
      // curQuestionType = [3,18,13]
      // 展示当前的题目类型 question_type
      let showQuestionType = {};
      for (let t in this.qtypes) {
        if (curQuestionType.includes(Number(t))) {
          showQuestionType[t] = this.qtypes[t];
        }
      }
      this.selectQTypes = showQuestionType;

      // 如果当前题目存在topic_type（question_type）,则展示当前的
      if (curOriginQues["question_topic"].topic_type) {
        this.canEditShowQuestionType = false;
        this.show_topic_type = curOriginQues[
          "question_topic"
        ].topic_type.toString();
        // 根据当前的题目类型去 this.practice_types中查找对应的练习方式可选择的范围
        let pTypeArea = this.pracitice_types[this.show_topic_type];
        // 根据可选择的范围去 this.qtypes 中筛选要展示出的select下拉框
        let showPracticeType = {};
        pTypeArea.forEach(el => {
          showPracticeType[el] = this.qtypes[el];
        });
        this.selectPTypes = showPracticeType;
        if (this.from == "activity") {
          //   如果当前题目存在练习方式
          if (curOriginQues["question_practice"].practice_type) {
            this.show_practice_type = curOriginQues[
              "question_practice"
            ].practice_type.toString();
          } else {
            this.show_practice_type = "";
          }
        }
      } else {
        this.show_topic_type = "";
        this.canEditShowQuestionType = true;
      }
      //如果选中或翻到本页最后一条且是最后一页 置灰next;activity下无分页器 try一下
      if(this.curClickIndex==this.questionList.length-1){
        try{
            this.filter.page==Math.ceil(parseInt(this.pageTotal)/parseInt(this.filter.limit))?this.changeNextUnable=true:'';
        }catch{
            this.changeNextUnable=true;
        }
      }else{
        this.changeNextUnable=false;
      }
      //如果选中或翻到本页第一条且是第一页 置灰prev;activity下无分页器 try一下
      if(this.curClickIndex==0){
        try{
            this.filter.page==1?this.changePrevUnable=true:'';
        }catch{
            this.changePrevUnable=true;
        }
      }else{
        this.changePrevUnable=false;
      }
    },
    /**
     * 设置set下拉框change事件
     * @param {String} type 绑定的类型：题型、练习方式
     * @param {String} op 操作：新增new 编辑edit
     */
    async handleSetType(type, op) {
      if (type == "questionType") {
        // 筛选quesiton_type后需要去查找对应的可选择的练习方式范围
        let canSelectType = this.pracitice_types[this.show_topic_type];
        let showPracticeType = {};
        canSelectType.forEach(el => {
          showPracticeType[el] = this.qtypes[el];
        });
        if (this.from == "activity") {
          if (canSelectType.indexOf(Number(this.show_practice_type)) > -1) {
            // 如果当前范围包含当前练习方式
            // this.show_practice_type =
          } else {
            this.show_practice_type = ""; // 不包含为 choose type
          }
          this.selectPTypes = showPracticeType;
        }
      } else {
        if (this.show_topic_type != "") {
          this.setTypes(
            {
              question: this.curQuestionId,
              topic_type: this.show_topic_type,
              practice_type: this.show_practice_type
            },
            op,
            "show"
          );
        }
      }
    },
    /**
     * 保存错误修改信息
     */
    saveErrFb(data,type){
      let dataMsg = {};
      if(data == "add"){
        if(type == 'hint'){
          dataMsg = {
            topic_id:this.errorAdd.errorMsg.error_feedback.id,
            hint: this.errorEdit.errorMsg.error_feedback.hint
          }
        } else if(type == 'correct'){
          dataMsg = {
            topic_id: this.errorAdd.errorMsg.error_feedback.id,
            correct_feedback: this.errorAdd.errorMsg.error_feedback.correct_feedback
          }
        } else {
          let newOption = {}
          this.errorAdd.errorMsg.answer.forEach((ele)=>{
            newOption[ele.id] = this.errorAdd.errorMsg.error_feedback.option_feedback[ele.option_name]
          })
          dataMsg = {
            topic_id: this.errorAdd.errorMsg.error_feedback.id,
            option_feedback: JSON.stringify(newOption),
            question_feedback: this.errorAdd.errorMsg.error_feedback.question_feedback
          }
        }
      } else {
        if(type == 'hint'){
          dataMsg = {
            topic_id:this.errorEdit.errorMsg.error_feedback.id,
            hint: this.errorEdit.errorMsg.error_feedback.hint
          }
        } else if(type == 'correct'){
          dataMsg = {
            topic_id: this.errorEdit.errorMsg.error_feedback.id,
            correct_feedback: this.errorEdit.errorMsg.error_feedback.correct_feedback
          }
        } else {
          let newOption = {}
          this.errorEdit.errorMsg.answer.forEach((ele)=>{
            newOption[ele.id] = this.errorEdit.errorMsg.error_feedback.option_feedback[ele.option_name]
          })
          dataMsg = {
            topic_id: this.errorEdit.errorMsg.error_feedback.id,
            option_feedback: JSON.stringify(newOption),
            question_feedback: this.errorEdit.errorMsg.error_feedback.question_feedback
          }
        }
      }
      this.$http._post(api.errorFbSave,dataMsg).then((res)=>{
            if(res.status == 200){
              if(data == "add") {
                if(type == 'hint'){
                  this.errorAdd.errorMsgBool =! this.errorAdd.errorMsgBool;
                } else if(type == 'correct'){
                  this.errorAdd.correctFeedBool =! this.errorAdd.correctFeedBool;
                } else {
                  this.errorAdd.errorFeedBool = !this.errorAdd.errorFeedBool
                }
                this.errorAdd.oldErrorMsg = JSON.stringify(this.errorAdd.errorMsg);
              } else {
                if(type == 'hint'){
                  this.errorEdit.errorMsgBool =! this.errorEdit.errorMsgBool;
                } else if(type == 'correct'){
                  this.errorEdit.correctFeedBool =! this.errorEdit.correctFeedBool;
                } else {
                  this.errorEdit.errorFeedBool = !this.errorEdit.errorFeedBool
                }
                this.errorEdit.oldErrorMsg = JSON.stringify(this.errorEdit.errorMsg)
              }
              
            }
          }).catch((err)=>{console.log(err)})
    },
    /**
     * 取消错误修改信息
     */
    cancelEdit(data,type){
      if(data == 'edit'){
        this.errorEdit.errorMsg = JSON.parse(this.errorEdit.oldErrorMsg);
        if(type == 'hint'){
          this.errorEdit.errorMsgBool = !this.errorEdit.errorMsgBool;
        } else if (type == 'correct'){
          this.errorEdit.correctFeedBool = !this.errorEdit.correctFeedBool;
        } else {
          this.errorEdit.errorFeedBool = !this.errorEdit.errorFeedBool;
        }
      } else {
        this.errorAdd.errorMsg = JSON.parse(this.errorAdd.oldErrorMsg);
        if(type == 'hint'){
          this.errorAdd.errorMsgBool = !this.errorAdd.errorMsgBool;
        } else if (type == 'correct'){
          this.errorAdd.correctFeedBool = !this.errorAdd.correctFeedBool;
        } else {
          this.errorAdd.errorFeedBool = !this.errorAdd.errorFeedBool;
        }
      }
      
    },
    handleAddSetType(type, op) {
      if (type == "questionType") {
        // 筛选quesiton_type后需要去查找对应的可选择的练习方式范围
        let canSelectType = this.pracitice_types[this.add_topic_type];
        let showPracticeType = {};
        canSelectType.forEach(el => {
          showPracticeType[el] = this.qtypes[el];
        });
        if (this.from == "activity") {
          if (canSelectType.indexOf(Number(this.add_practice_type)) > -1) {
            // 如果当前范围包含当前练习方式
            // this.show_practice_type =
          } else {
            this.add_practice_type = ""; // 不包含为 choose type
          }
          this.addSelectPTypes = showPracticeType;
          if (Object.keys(this.addSelectPTypes).length > 0) {
            this.add_practice_type = Object.keys(
              this.addSelectPTypes
            )[0].toString();
          }
        }
      }
    },
    /**
     * question type需要点击按钮保存
     */
    async saveQuestion(type) {
      if (type == "show") {
        this.setTypes(
          {
            question: this.curQuestionId,
            topic_type: this.show_topic_type
          },
          "edit",
          "show"
        );
      } else {
        this.setTypes(
          {
            question: this.searchQuestionId,
            topic_type: this.add_topic_type
          },
          "new",
          "add"
        );
      }
    },
    /**
     * activity 保存
     */
    async saveActivity() {
      await this.$http._post(api.saveActivity, this.form);
    },
    /**
     * add按钮新增和activity的绑定
     */
    addBind() {
      this.scrollBool = true;
      this.setTypes(
        {
          question: this.searchQuestionId,
          topic_type: this.add_topic_type,
          practice_type: this.add_practice_type
        },
        "new",
        "add"
      );
    },
    /**
     * 设置question type 和practice type
     */
    async setTypes(param, op, way) {
      this.scrollBool = true;
      let { result, status, message } = await this.$http._post(
        api.setTypes,
        param
      );
      if (status == 200) {
        if (this.from == "question" && way == "show") {
          // this.errorEdit = {
          //   errorMsgBool: false, //错误编辑
          //   errorMsg:{},
          //   oldErrorMsg:'',
          //   errorFeedBool: false
          // }
          this.errorEdit.errorMsg.error_feedback = Object.assign(this.errorEdit.errorMsg.error_feedback,result.question_topic);
          this.errorEdit.errorMsg.error_feedback.id = result. question_topic.id;
          this.errorEdit.oldErrorMsg = JSON.stringify(this.errorEdit.errorMsg);
          this.curRowData["type_content"] = this.qtypes[param.topic_type];
          this.canEditShowQuestionType = false;
        } 
        if (way == "add") {
          this.canEditNewQuestionType = false;
        }
        if (param.practice_type) {
          if (way == "show") {
            this.curRowData["type_content"] = this.qtypes[param.practice_type];
          }

          let obj = {};
          if (op == "new") {
            obj = {
              activity_id: this.$route.query.activity_id,
              question_practices: result.question_practice.id
            };
          } else {
            obj = {
              detail_id: this.curRowData.detail_id,
              question_practices: result.question_practice.id
            };
          }
          this.setActivityBind(obj, op);
        }
        // this.questionPage = 1;
      // await this.getQuestion("cancel");
      } else {
        this.$message({
          offset: 60,
          duration:1000,
          type: "error",
          message: message
        });
        this.questionPage = 1;
        await this.getQuestion("cancel");
      }
      
    },
    /**
     * 设置题目去activity绑定--编辑
     */
    setActivityBind(param, op) {
      this.scrollBool = true;
      let url = "";
      if (op == "new") {
        url = api.setActivityBindNew;
      } else {
        url = api.setActivityBindEdit;
      }
      this.$http._post(url, param).then(res => {
        if (res.status == 200) {
          if (op == "new") {
            this.setRank(true, [
              { id: res.result.success, seq: this.questionList.length + 1 }
            ]);
            this.saveSuccess = false;
            this.searchQuestionId = "";
            this.addPreviewQuestion = {}
            // this.drawerAddBool = !this.drawerAddBool;
            this.saveNewFieds("add",res.result.success);
          } else {
            this.getQuestion("cancel");
          }
          this.$message({
            offset: 60,
            duration:1000,
            type: "success",
            message: "bind success",
          });
        }
      });
    },
    /**
     * 解绑
     */
    async detach() {
      this.scrollBool = true;
      let { result, status, message } = await this.$http._delete(
        api.unbindActivity,
        {
          detail_id: this.curRowData.detail_id
        }
      );
      if (status == 200) {
        this.$delete(this.questionList, this.curClickIndex);
        this.curClickIndex = -1;
        this.curQuestionId = 0;
        this.showDetail = false;
        this.detachPop = false;
        this.drawer = !this.drawer;
        this.setRank(true,"","delete");
        this.$message({
          offset: 60,
          duration:1000,
          type: "success",
          message: "detach success"
        });
      } else if (status == 9103){
        // 数据已存在 表示当前题目有被其他题目goto关联
        this.$confirm(
        "Cannot detach question Please make sure no Go-to are linked to this question.",
        "Warning",
        {
          showCancelButton: false,
          confirmButtonText: "",
          cancelButtonText: "",
          type: "error"
        }
      ).then(()=>{})
      }
       else {
        this.$message({
          offset: 60,
          duration:1000,
          type: "error",
          message: message
        });
      }
    },
    /**
     * 搜索question id
     */
    async handleIconSearch(e) {
      this.canEditNewQuestionType = true;
      if (this.searchQuestionId != "") {
        await this.getSingleQuestion(this.searchQuestionId);
      }
      if (this.singleQuestion.id) {
        await this.getPracticeWay(
          {
            question_id: this.searchQuestionId,
            target_id: this.$route.query.activity_id,
            target_type: 1 // 1 activity 2 script
          },
          this.singleQuestion.type
        );
        this.$nextTick(() => {
          this.$bus.emit("setScrollId", { id: "scrollView" });
        });
      } else {
        this.noQuestionid = "no data";
      }
    },
    /**
     * 启动编辑
     */
    editActivity() {
      this.canEdit = true;
    },
    /**
     * 获取题目位置数据处理
     * @param {Array} originData 原始的数据
     * @param {Array} originSheet 原始映射数据
     */
    handleLocationData(originData, originSheet) {
      let ids = [];
      originData.forEach(el => {
        ids.push(el.sheet_ids);
      });
      ids.forEach((el, index) => {
        originData[index]["location"] = [];
        el.forEach(e => {
          originSheet.forEach(s => {
            if (e == s.id) {
              originData[index]["location"].push(s);
            }
          });
        });
      });
      return originData;
    },
    async setRank(op, opOrder,type) {
      this.scrollBool = true;

      if (!opOrder && !op) {
        if(this.questionList.length > 0 && this.from == 'activity' && this.questionList.length < this.actiQuestionTotal){
          this.$message({
              offset: 60,
              duration:1000,
              type: "warning",
              message: "请加载全部后编辑"
            });
        } else {
          this.canRank = !this.canRank;
        }
      }
      if (this.canRank || opOrder || op) {
        let order = [];
        var oldIdUnit = [];
        if (opOrder) {
          order = opOrder;
        } else {
          await this.questionList.forEach((el, index) => {
            order.push({ id: el.detail_id, seq: index + 1 });
            oldIdUnit.push(el.id)
          });
        }
        if (order.length != 0) {
          let {
            result,
            status,
            message
          } = await this.$http._post(api.questionOrder, { orders: order });
          if (status == 200) {
            this.$message({
              offset: 60,
              duration:1000,
              type: "success",
              message: "success"
            });
            if(this.from == 'activity'){
              this.getGoToList(); //获取题目gotoList
            }
            this.questionList = [];
            this.getQuestion("","rank");
            // window.location.reload()
          } else {
            this.$message({
              offset: 60,
              duration:1000,
              type: "error",
              message: message
            });
          }
          // if(this.from == "activity"){
          //   if(this.oldIdArray.length > 0 && oldIdUnit){
          //     if(this.arrayEquals(this.oldIdArray,oldIdUnit) == false){
          //       if(type == "add" || type == "delete")return
          //       this.$http._post(api.publishHasList(this.courseId),{course_id:this.courseId}).then((res)=>{
          //         if(res.status == 200){
                    
          //         }
          //       });
          //     }
          //   }
            
          // }
        }
      }
    },
    /**
     * 表格表头样式
     */
    rowClass({ row, rowIndex }) {
      return "background:#fafafa";
    },
    /**
     * 修改每页展示条数
     */
    handleSizeChange(val) {
      this.filter.limit = val;
      // this.getQuestion();
    },
    /**
     * 选择页数
     */
    handleCurrentChange(val) {
      this.filter.page = val;
      //this.getQuestion();
    },
    /**
     * 对比数组是否相等
    */
    arrayEquals(array1, array2) {
        if(!(array1 || array1)) {
          return false;
        }
        // 先比较长度 
        if (array1.length != array2.length)return false;
            

        for (var i = 0, l=array1.length; i < l; i++) {
            // 检查是否为内嵌数组
            if (array1[i] instanceof Array && array2[i] instanceof Array) {
                // 递归比较数组
                if (!arrayEquals(array1[i],array2[i]))return false;
                          
            } else if (array1[i] != array2[i]) { //标量比较 
                return false;   
            }           
        }       
        return true;
    },
    /**
     * 跳转题库
     */
    goLibs(id) {
      let open = window.open();
      open.location = `${this.qm_op_link}${id}`;
    },
    /**
     * 获取goto题目列表
    */
    async getGoToList(){
    this.$http._get(api.goToList(this.$route.query.activity_id)).then((res)=>{
      this.goToListArr = res.result.seqs;
    }).catch(err => {console.log(err)})
   },
   /**
    * 选择goto去到的题目
   */
   changeGoToNumber(item,index){
    // 添加修改的item
    var saveChangeItem = {
        id: item.detail_id,
        tos: item.tos,
        to_type: item.to_type
      }
      this.saveGoList.push(saveChangeItem)
   },
    /**
     * 选择goto类型
    */
    chooseGo(item,index){
      // 切换当前goto的类型
          item.tos = [];
      switch(item.to_type){
        case "0":
          item.tos = [];
          break;
        case "1":
          var valObj = {
            option_id: "0",
            target_id: "-1"
          }
          item.tos.push(valObj);
          break;
        case "2":
          for (let ele in this.goToObj.score_types) {  
              var valObj = {
                option_id: "",
                target_id: "-1"
              }
              valObj.option_id = ele
              item.tos.push(valObj)
            }
          break;
        case "3":
          for (let ele in item.question_options) {  
            var valObj = {
              option_id: "",
              target_id: "-1"
            }
            valObj.option_id = ele
            item.tos.push(valObj)
          }
          break;
      }
      this.changeGoToNumber(item,index);
      
    },
    /**
     * 加载更多问题
    */
    addMoreQuestions(){
      this.questionPage++;
      this.getQuestion();
    },
    /**
     * 取消编辑go-to
    */
    cancelGoTo(cancel) {
      this.editGoToBool = !this.editGoToBool;
      this.questionPage = 1;
      this.getQuestion(cancel)
    },
    // innerLoadMore(n){
    //   this.addMoreQuestions();
    // },
    /**
     * 保存编辑goto
    */
   saveEditGoTo(){
    let obj = {};

    let activityArr = this.saveGoList.reduce((cur,next) => {
        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
        return cur;
    },[]) //设置cur默认类型为数组，并且初始值为空的数组
    if(activityArr.length == 0){
      this.editGoToBool = !this.editGoToBool
    } else {
      this.$http._post(api.saveEditGoTo,{
       activity_details: activityArr
     }).then((res)=>{
      if(res.status == 200){
        this.$message({
            offset: 60,
            duration:1000,
            type:'success',
            message:'编辑成功'
        });
        this.editGoToBool = !this.editGoToBool
      }
     }).catch((err)=>{console.log(err)})
    }
   },
    // /**
    //  * 删除当前选项
    // */
    // delOption(val,item,index){
    //   console.log(val,item,index)
    //   this.questionList.forEach(ele => {
    //     if(ele.id == val.id){
    //       if(ele.tos.length == 1)return
    //       ele.tos.splice(index,1)
    //     }
    //   })
    // },
    // /**
    //  * 增加当前选项
    // */
    // addOption(val,){
    //   console.log(val,item,index)
    //   this.questionList.forEach(ele => {
    //     if(ele.id == val.id){
    //       if(ele.tos.length == 1)return
    //       ele.tos.splice(index,1)
    //     }
    //   })
    // }

    //抽屉切换下一个
    changeNext(){
      //this.questionList   当页数据列表
      //this.curClickIndex  触发当前当页的第几条
      //this.filter.limit   每页条数
      //this.filter.page    当前页
      //Math.ceil(parseInt(this.pageTotal)/parseInt(this.filter.limit))// 页码总数
      if(this.changeNextUnable){ return; }
      if(this.curClickIndex==this.questionList.length-1) { 
        if(this.filter.page==Math.ceil(parseInt(this.pageTotal)/parseInt(this.filter.limit))){
          //最后一条且最后页
        }else{
          this.fromChangeNext=true;
          this.filter.page+=1;//翻页
        }
        return
      }
     this.curClickIndex+=1; 
     this.currentRowChange(this.questionList[this.curClickIndex])
    },
    //抽屉切换上一个
    changePrev(){
      if(this.changePrevUnable){ return; }
      if(this.curClickIndex==0) { 
        if(this.filter.page==Math.ceil(parseInt(this.pageTotal)/parseInt(this.filter.limit))){
          //第一条且第一页
        }else{
          this.fromChangePrev=true;
          this.filter.page-=1;//翻页
        }
        return
      }
     this.curClickIndex-=1; 
     this.currentRowChange(this.questionList[this.curClickIndex])
    }
  }
};
</script>
<style lang="css">
.tbody .cont img {
  display: none;
}
.tbody .cont center {
  display: inline-block;
}
</style>
<style lang="scss" scoped>
.question-table {
  width: 100%;
  font-size: 0px;
  em {
    display: inline-block;
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .thead {
    background: #fafafa;
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
    em {
      font-weight: bold;
    }
  }
  .tbody {
    box-sizing: border-box;
    border-bottom: 1px solid #ededed;
    /* height: 48px; */
    line-height: 30px;
    background: #fff;
    cursor: pointer;
    display: flex;
    .cont {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      /* line-height: initial; */
      max-height: 37px;
    }
    &.current {
      background: #e8f1fd;
    }
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .no-move {
    transition: transform 0s;
  }
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  .list-group {
    min-height: 20px;
  }
  .list-group-item {
    cursor: move;
  }
  .w0 {
    width: 30px;
    line-height: 48px;
    height: 48px;
    overflow: hidden;
  }

  .w1 {
    width: 80px;
    line-height: 48px;
    height: 48px;
    overflow: hidden;
  }
  .w2 {
    width: 180px;
    line-height: 48px;
    height: 48px;
    overflow: hidden;
  }
  .w3 {
    width: calc(100% - 330px);
    line-height: 48px;
    height: 48px;
    overflow: hidden;
    &.active {
      width: 300px;
    }
  }
  .w4 {
    width: 150px;
    line-height: 48px;
    max-height: 48px!important;
    overflow: hidden;
  }
  .w5 {
    width: calc(100% - 820px);
    min-height: 48px!important;
    /* overflow: hidden; */
    &.w5cont {
      overflow: hidden;
    }
  }
}
.qdetail {
  &-at {
    box-sizing: border-box;
    padding: 32px;
    border: 1px solid #ededed;
    margin-bottom: 32px;
    &_location {
      text-decoration: underline;
      &.noLink {
        text-decoration: none;
        cursor: default;
        color: #333;
      }
    }
  }
  &-ques {
    &_cont {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &_input {
      width: 200px;
    }
    &_add {
      border: 1px solid #e4e4e4;
      border-top: 0;
      padding: 12px;
      box-sizing: border-box;
    }
    &_detail {
      padding: 20px;
      box-sizing: border-box;
      /* background: #fafafa; */
      h3 {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
  }
  .single-question {
    /* background: #fafafa; */
    background: #ffffff;
    padding: 20px 32px 100px;
    box-sizing: border-box;
    margin-bottom: 100px;
  }
  .rank-tit {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .num {
      font-size: 12px;
      color: #999;
      font-weight: normal;
    }
    .open-rank {
      width: 24px;
      height: 24px;
      display: inline-block;
      background: url("../../../../assets/rank-cion.png") no-repeat;
      background-size: 24px;
      cursor: pointer;
      vertical-align: sub;
      margin: 0 8px;
    }
    .finishrank {
      color: #4c91ff;
      font-size: 24px;
      margin: 0 8px;
      cursor: pointer;
    }
  }
}
.info {
  margin-bottom: 12px;
  min-height: 32px;
  &.h3 {
    font-size: 18px;
    font-weight: bold;
  }
  span {
    width: 120px;
  }
  .location {
    // padding-left: 120px;
    // margin-bottom: 32px;
    &-span {
      display: block;
      width: 100%;
    }
    &.error {
      margin-top: 6px;
      
    }
  }
}

.error-content {
  word-break: break-all;
  width: 270px;
  margin-top: 6px;
  margin-bottom: 12px;
}

.error-wrap {
  /* display: flex; */
  /* justify-self: start; */
  span {
    display: inline-block;
  }
}

.hint-button-wrap {
  display: flex;
  justify-content: space-between;
  &.error-feedback-btn {
    margin-bottom: 10px;
  }
}

.text-area-wrap{
  margin-bottom: 12px;
}

.error-text-area {
  margin-bottom: 12px;
  /* width: 350px; */
}
.error-text-area-add {
  margin-bottom: 12px;
  /* width: 370px; */
}

.explain-error-wrap{
  margin-top: 15px;
  .explain-error-wrap-h3 {
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 8px;
  }
  .explain-option {
    margin-top: 10px;
    display: flex;
    span {
      display: inline-block;
      width: 20px;
    }
  }
  .explain-option-con {
    display: inline-block;
    margin-left: 10px;
  }
}

.drawer-show {
  overflow: auto;
}

/deep/ .el-drawer {
  overflow: auto;
}

.flex-box {
  display: flex;
}

.section-top {
  border-bottom: solid 1px #ccc;
  position: relative;
}

.section-bottom {
  padding-top: 20px;
  .preview-left,.preview-right {
    width: 50%;
    overflow: hidden;
    box-sizing: border-box;
  }
  .preview-left {
    border-right: 1px solid #ccc;
    padding: 0 20px 0 0;
  }
  .preview-right {
    padding: 0 0px 0 20px;
  }
}

/* 新增加载更多 */
.nestedInBox {
  height: 23px;
  overflow: hidden;
}

.add-nested {
  color: #ccc;
  margin-top: -20px;
  margin-left: 120px;
  margin-bottom: 12px;
  cursor: pointer;
}

.select-goto {
  width: 100px;
}

.instruction-text-area {
  width: 350px;
}

.margin-div-top {
  margin-top: 5px;
  margin-bottom: 5px;
}

.loading-more-questions {
  height: 48px;
  background: #e4e4e4;
  width: 100%;
  text-align: center;
  line-height: 48px;
  color: #000;
  cursor: pointer;
}

.check-box {
  display: flex;
  align-items: center;
}

.gotoType {
  display: inline-block;
  width: 100px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: normal;
  text-align: center;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 5px;
}

.section-button-wrap {
  display: flex;
  .edit-button-wrap {
    margin-left: 10px;
  }
}
.edit-button-hint {
  height: 32px;
}

.question-type-wrap {
  display: flex;
  justify-content: space-between;
}
</style>
<style>
  img.kmf-ill-picture {
      max-width: 100%!important;
      max-height: 100%!important;
    }
  .change_warp{ 
     position: absolute;
     top: 0;
     right: 20px;
     overflow: hidden;
    }
 .change_warp.mart100{ right: 100px; }  
 .change_warp p{ user-select: none;cursor: pointer;float: left;padding: 5px 15px;border: 1px solid #999;border-radius: 5px;font-size: 12px;font-weight: 500;margin-left: 20px }  
 .change_warp p.unable{ color: #ccc;border-color: #ccc }
 .change_warp p:hover{ background: #1D6FE9;color: white;border-color: #1D6FE9 }
 .change_warp p.unable:hover{ background:none;border-color: #ccc;color: #ccc }
</style>