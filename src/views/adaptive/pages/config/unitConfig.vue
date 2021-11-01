<template>
  <div class="unitconfig">
    <view-header :title="` Unit ID：${basicInfo.id}`">
      <template v-slot:tag>
        <el-tag class="unitconfig-id_type" type="info" size="mini">{{ unitType }}</el-tag>
      </template>
      <template v-slot:back>
        <i class="el-icon-arrow-left fl back" @click="$router.go(-1)"></i>
        <el-button 
        v-if="basicInfo.mark_status == 1"
        class="edit-btn new"
        size="mini"
        disabled type="success">新内容</el-button>
        <el-button
          v-if="basicInfo.mark_status == 2"
          class="edit-btn new"
          type="primary"
          size="mini"
          disabled
        >有更新</el-button>
        <el-button 
          v-if=" basicInfo.mark_status == 3"
          class="edit-btn new"
          size="mini"
          disabled
          type="danger">新内容待发布</el-button>
        <el-button 
          v-if=" basicInfo.mark_status == 4"
          class="edit-btn new"
          size="mini"
          disabled
          type="danger">待发布</el-button>
      </template>
      <template v-slot:button>
        <div class="fr" style="margin-right:32px;">
          <el-button type="primary" v-if="basicInfo.mark_status == 1 || basicInfo.mark_status == 2 || basicInfo.mark_status == 5" size="small" :disabled="basicInfo.mark_status == 5"
            @click="publish(basicInfo.map_id,'preview')">Preview</el-button>
          <el-button type="primary"
            v-if="basicInfo.mark_status == 3 || basicInfo.mark_status == 4" size="small" @click="publish(basicInfo.map_id,'publish')">Publish</el-button>
          <el-button type="danger" :disabled="basicInfo.mark_status == 1 || basicInfo.mark_status == 3"  size="small" @click="publish(basicInfo.map_id,'retract')">Retract</el-button>
          <el-button type="danger" size="small" @click="deleteUnit(basicInfo.map_id)">Delete Unit</el-button>
        </div>
      </template>
    </view-header>
    <div class="main">
      <el-row :gutter="24">
        <el-col :span="8" class="unitconfig-box">
          <div class="unitconfig-part">
            <h3 class="part-tit">
              Basic Info
              <div class="fr">
                <el-button
                  v-if="!canEditUnit"
                  size="mini"
                  type="primary"
                  @click="canEditUnit = true"
                >Edit</el-button>
                <el-button
                  v-if="canEditUnit"
                  type="primary"
                  plain
                  size="mini"
                  @click="saveUnit('unitForm')"
                >Save</el-button>
                <el-button v-if="canEditUnit" plain size="mini" @click="cancelSave">Cancel</el-button>
              </div>
            </h3>
            <el-form
              ref="unitForm"
              :rules="unitFormRules"
              :model="basicInfo"
              :disabled="!canEditUnit"
            >
              <el-form-item prop="en_name">
                <el-input type="text" placeholder="Unit Name" v-model="basicInfo.en_name"></el-input>
              </el-form-item>
              <el-form-item prop="cn_name">
                <el-input
                  type="text"
                  placeholder="Unit Name - Chinese（Optional）"
                  v-model="basicInfo.cn_name"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="basicInfo.course_id">
                  <el-option
                    v-for="item in courseData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input type="textarea" :autosize="{ minRows: 4}" v-model="basicInfo.content"></el-input>
              </el-form-item>
              <el-form-item>
                <upload
                  :options="opts"
                  :existFile="showUploadImg"
                  :limit="1"
                  @uploadSuccess="uploadSuccess"
                  @removeImg="removeImg"
                ></upload>
              </el-form-item>
            </el-form>
          </div>
          <div class="unitconfig-part">
            <h3 class="part-tit">
              Activity
              <span
                @click="setRank()"
                :class="canRank ? 'open-rank' : 'el-icon-finished finishrank'"
              ></span>
              <span class="num" v-html="`${activityList.length} total`"></span>
            </h3>
            <div class="unit-activity">
              <p class="thead">
                <em class="w0" v-if="!canRank"></em>
                <em class="w1">Name</em>
                <em class="w2">ID</em>
                <em class="w3">Questions</em>
                <em class="w4"></em>
              </p>
              <draggable v-model="activityList" class="list-group" tag="p" v-bind="dragOptions">
                <transition-group type="transition">
                  <p
                    class="tbody"
                    v-for="(item,index) in activityList"
                    :key="'table' + index"
                    :class="{'list-group-item':!canRank}"
                  >
                    <em class="w0" v-if="!canRank">
                      <i class="el-icon-sort"></i>
                    </em>
                    <em class="w1" v-html="item.name"></em>
                    <em class="w2" v-html="item.id"></em>
                    <em class="w3" v-html="item.detail_total"></em>
                    <em class="w4">
                      <el-popover placement="bottom" width="100" v-model="acPop[index]">
                        <a
                          class="pop-op"
                          style="display:block;margin-bottom:8px"
                          href="javascript:void(0)"
                          @click="goActivityConfig(item)"
                        >Edit</a>
                        <a
                          class="pop-op"
                          style="display:block"
                          href="javascript:void(0)"
                          @click="unitDetachsActivity(item,index)"
                        >Delete</a>
                        <i slot="reference" class="el-icon-more" style="cursor: pointer"></i>
                      </el-popover>
                    </em>
                  </p>
                </transition-group>
              </draggable>
            </div>
            <p style="margin-top:12px;" v-if="addType == 'search'">
              Add：
              <el-input
                class="unitconfig-part_add"
                placeholder="ActivityID"
                size="small"
                v-model.trim="searchActivityId"
                v-on:keyup.enter.native="handleIconSearch"
              >
                <i class="el-icon-search el-input__icon" slot="suffix"></i>
              </el-input>
              <span class="err-tips" v-show="errTxt != ''">{{ errTxt }}</span>
              <el-button
                class="fr"
                type="primary"
                size="small"
                @click="addType = 'chooseType'"
              >+ New</el-button>
            </p>
            <p style="margin-top:12px" v-if="addType == 'chooseType'">
              Add：
              <!-- <el-select
                size="small"
                class="unitconfig-part_add"
                v-model="choseType"
                placeholder="ChooseType"
              >
                <el-option v-for="(item,key) in types" :key="'ct' + key" :label="item" :value="key"></el-option>
              </el-select> -->
              <el-input
                class="unitconfig-part_add"
                placeholder="Activity Name"
                size="small"
                v-model="inputActiveName"
              >
              </el-input>
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                size="small"
                @click="typeAddActivity"
              ></el-button>
              <el-button icon="el-icon-close" circle size="small" @click="addType = 'search'"></el-button>
            </p>
          </div>
        </el-col>
        <el-col :span="16">
          <div
            class="unitconfig-part"
            style="border:1px solid #ededed;padding:12px 20px;"
            v-loading="scriptLoading"
          >
            <h3>
              Script
              <span
                v-if="lockStatus == '1' && lockUser.id == userInfo.id"
                @click="setRankScript()"
                :class="canRankScript ? 'open-rank' : 'el-icon-finished finishrank'"
              ></span>
              <span class="num" v-html="`${scripts.length} total`"></span>
              <el-button
                v-if="lockStatus == '0'"
                type="primary"
                class="fr"
                size="mini"
                @click="getScriptStatus('click')"
                :loading="editLoading"
              >Edit</el-button>
              <el-button
                v-if="lockStatus == '1' && lockUser.id == userInfo.id"
                type="primary"
                class="fr"
                size="mini"
                plain
                @click="opScriptStatus(1)"
              >Check in</el-button>
              <el-badge value="M" v-if="lockStatus == '1' && lockUser.id != userInfo.id" class="fr">
                <el-button type="info" size="mini" plain @click="showEditUser">Editing</el-button>
              </el-badge>
            </h3>
            <div class="script">
              <p class="thead">
                <em class="w0" v-if="!canRankScript"></em>
                <em class="s1">No.</em>
                <em class="s2">Type</em>
                <em class="s3">Description</em>
                <em class="s4">Go-to</em>
                <em class="s5"></em>
              </p>
              <draggable v-model="scripts" class="list-group" v-bind="dragOptionsScript">
                <transition-group type="transition">
                  <p
                    class="tbody"
                    v-for="(item,itemindex) in scripts"
                    :key="`p-${itemindex}`"
                    :class="{'list-group-item':!canRankScript,'no-delete':canNotDelete[itemindex]}"
                  >
                    <em class="w0" v-if="!canRankScript">
                      <i class="el-icon-sort"></i>
                    </em>
                    <em class="s1" v-html="item.seq">No</em>
                    <em class="s2" v-html="item.type_content">Type</em>
                    <em class="s3">
                      <i v-for="(detail,index) in item.details" :key="`detail-${index}`">
                        <b v-if="item.type == 1 || item.type == 5">{{ detail.desc }}</b>
                        <b v-if="item.type == 6 && index == 0">{{ detail.desc }}</b>
                        <img
                          v-if="item.type == 2"
                          :src="detail.desc"
                          style="width:auto;max-height:64px;cursor:pointer"
                          @click="videoDialog = true,previewVideo = '',previewImg = detail.desc"
                        />
                        <div v-if="item.type == 3">
                          <vue-plyr>
                            <audio :src="detail.desc" style="width:100%;"></audio>
                          </vue-plyr>
                        </div>
                        <video
                          v-if="item.type == 4"
                          :src="detail.desc"
                          style="height:64px;cursor:pointer;"
                          @click="showVideo(detail.desc)"
                        ></video>
                        <b
                          v-if="item.type == 7 && item.details[0]['question_practices']"
                        >[{{ item.details[0]['question_practices']['type_content'] }}] {{ detail.desc }}</b>
                      </i>
                    </em>
                    <em class="s4">
                      <div
                        v-for="(detail,index) in item.details"
                        :key="`detail2-${index}`"
                        style="display:block;"
                      >
                        <p v-for="(detailTo,detailToKey) in detail.to" :key="`det${detailToKey}`">
                          <b class="fl gotoType" v-if="detailToKey == 1">T</b>
                          <b class="fl gotoType" v-if="detailToKey == 2">F</b>
                          <el-select
                            v-model="detail.to[detailToKey]"
                            size="mini"
                            class="degotoSelect fl"
                            :disabled="lockStatus == '0' || lockUser.id != userInfo.id"
                            @change="handleChangeGoTo(detail.to,detail.id,index)"
                          >
                            <el-option label="No.--" :value="-1"></el-option>
                            <el-option
                              v-for="(t,i) in getScriptIds(detail.script_id)"
                              :key="`ids${i}`"
                              :label="`No.${t.seq}`"
                              :value="t.id"
                            ></el-option>
                          </el-select>
                        </p>
                      </div>
                    </em>
                    <em class="s5" v-if="lockStatus == '1' && lockUser.id == userInfo.id">
                      <i
                        class="el-icon-edit script-icon-edit"
                        @click="addScriptBox('edit',item.details)"
                      ></i>
                      <i
                        class="el-icon-delete script-icon-del"
                        @click="delScript(item.id,itemindex)"
                      ></i>
                    </em>
                  </p>
                </transition-group>
              </draggable>
              <el-button
                style="padding:8px;margin-top:12px;"
                v-if="!showAddScript"
                icon="el-icon-plus"
                :disabled="lockStatus == '0' || lockUser.id != userInfo.id"
                size="small"
                @click="addScriptBox('new')"
              ></el-button>
              <div class="add-script" v-if="showAddScript" id="scrollView">
                <div class="add-script_bar">
                  <span style="margin-right: 12px;">Type</span>
                  <el-select v-model="scriptForm.type" size="small" :disabled="scriptOp == 'edit'">
                    <el-option
                      v-for="(item,key) in scriptTypes"
                      :label="item"
                      :value="key"
                      :key="`script${key}`"
                    ></el-option>
                  </el-select>
                  <div class="fr">
                    <el-button
                      type="primary"
                      size="small"
                      @click="opScript(scriptOp)"
                      :disabled="questionTypeSupport"
                    >Save</el-button>
                    <el-button plain size="small" @click="showAddScript = false">Cancel</el-button>
                    <!-- <el-button type="danger" icon="el-icon-delete" circle size="small"></el-button> -->
                  </div>
                </div>
                <div class="add-script_cont" v-loading="scriptLoading">
                  <component
                    :type="scriptForm.type"
                    :editScriptData="editScriptData"
                    :is="curComponent"
                    :form="scriptForm"
                    :ids="scriptIds"
                    :uploadOpts="opts"
                    @returnData="returnData"
                    @isSupport="isSupport"
                  ></component>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="videoDialog">
      <vue-plyr v-if="previewVideo != '' && videoDialog">
        <video :src="previewVideo" style="width:100%;"></video>
      </vue-plyr>
      <img v-if="previewImg != ''" :src="previewImg" style="width:100%;" />
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api";
import draggable from "vuedraggable";
import { mapState } from "vuex";
import questionTypeVue from "../../components/scriptType/questionType.vue";
const textType = () =>
  import("@/views/adaptive/components/scriptType/textType");
const uploadType = () =>
  import("@/views/adaptive/components/scriptType/uploadType");
const activityType = () =>
  import("@/views/adaptive/components/scriptType/activityType");
const questionType = () =>
  import("@/views/adaptive/components/scriptType/questionType");
const responseType = () =>
  import("@/views/adaptive/components/scriptType/responseType");
export default {
  name: "unitConfig",
  data() {
    return {
      unitData: {},
      courseData: {},
      basicInfo: {
        // 基础数据
        id: "", // unit id
        en_name: "", // required
        cn_name: "",
        content: "",
        course_id: "", // required
        attachments: [],
        map_id:"", //与course的关联ID
        mark_status: "" //当前的状态
      },
      oldCourseId: "",
      activityList: [], // activity列表
      activityIds: [], // 当前已经存在的ids
      oldOfficlalUnit: [],
      scripts: [], // script数据
      unitType: "test",
      searchActivityId: "", // 搜索添加activity
      inputActiveName: "",
      searchActivityData: {},
      hasSearchActivity: true, // 是否存在搜索的activity
      types: {}, // activity types
      choseType: "", // 选择的type
      addType: "search", // 新增activity方式
      is_must: true,
      opts: {
        space: "kmf-doc",
        subject: process.env.NODE_ENV == "development" ? "test" : "ets",
        product_line: "ets"
      },
      canEditUnit: false, // 获取编辑unit basic info的权限
      errTxt: "",
      drag: false,
      canRank: true, // activity排序
      canRankScript: true, // script排序
      acPop: [], // activity 列表 弹出框
      scriptTypes: {},
      scriptForm: {
        type: "1",
        location: this.$route.query.unit_id // 所属unit id
      },
      editScriptData: [],
      scriptIds: [], // 所有scriptid
      showAddScript: false,
      showUploadImg: [],
      unitFormRules: {
        en_name: [{ required: true, message: "must", trigger: "blur" }]
      },
      scriptLoading: true, // 保存script loading状态
      videoDialog: false,
      previewVideo: "",
      previewImg: "",
      lockStatus: "0", // 0 未锁定 1锁定 锁定状态 返回passport_id
      lockUser: {},
      editLoading: false,
      questionTypeSupport: false,
      scriptOp: "new", // script操作方式
      curEditScriptId: 0,
      canNotDelete: [], // 关联关系id true为有关联不能删除 对应索引
      queryData:'', //路由参数
      oldIdArray:[],//保存原始数组ID
    };
  },
  watch: {
    searchActivityId(val) {
      this.errTxt = "";
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
    dragOptionsScript() {
      return {
        animation: 200,
        group: "description",
        disabled: this.canRankScript,
        ghostClass: "ghost"
      };
    },
    curComponent() {
      let componentMap = {
        1: textType,
        2: uploadType,
        3: uploadType,
        4: uploadType,
        5: responseType,
        6: activityType,
        7: questionType
      };
      return componentMap[this.scriptForm.type];
    },
    ...mapState(["userInfo"])
  },
  components: {
    draggable,
    textType,
    uploadType,
    activityType,
    questionType,
    responseType
  },
  created() {
    // 获取当前编辑的数据
    this.getUnitDetail(); // 获取编辑详情
    // this.getActivityList();
    this.activityTypeList();
    this.getScriptInfo();
    this.getScriptType();
    this.getScriptStatus(); // 获取script编辑状态
  },
  mounted() {
    this.$store.dispatch("GET_USER_INFO");
  },
  beforeDestroy() {
    this.$bus.off("setScrollId", { id: "scrollView" });
  },
  methods: {
    /**
     * 编辑unit显示详情
     */
    async getUnitDetail() {
      let { result } = await this.$http._get(
        api.getUnitDetail(this.$route.query.unit_id)
      );
      this.courseData = result.courses;
      if(result.sheets){
        let unitData = result.sheets;
        this.basicInfo = {
          id: unitData.id,
          en_name: unitData.en_name,
          cn_name: unitData.cn_name,
          content: unitData.content,
          course_id: unitData.course_sheets.course_id,
          attachments: unitData.attachments,
          map_id: unitData.course_sheets.id,
          mark_status: unitData.course_sheets.mark_status
        };
        this.oldCourseId =  unitData.course_sheets.course_id;
        this.showUploadImg = unitData.attachments;
      }
      // 取消区分test部分
      // if (unitData.is_test) {
      //   this.unitType = "test";
      // } else {
        this.unitType = "official";
      // }
      this.getActivityList()
    },
    /**
     *  获取activity列表
     * @param {String} type 查询的类型 'list'：展示列表 'search':搜索 'choseType'：通过type添加
     */
    async getActivityList() {
      let curQuery = this.$route.query;
      console.log(this.basicInfo)
      let res = await this.$http._get(api.activityList, {
        course_id: this.basicInfo.course_id,
        sheet_id: curQuery.unit_id,
        cate_id: "0",
        mode: 1,
        has_location: 1
      });
      let activity = res.result.activites.list;
      let question_options = res.result.question_options;
      let ids = []; // 当前列表中存在的id
      let seqs = []; // 题目的顺序seq
      let activityArr = [];
      activity.forEach((el, index) => {
        ids.push(el.id);
        this.acPop.push(false);
      });
      activity.sort(this.compare("seq"));
      this.oldIdArray = []
      activity.forEach((val)=>{
        this.oldIdArray.push(val.id);
      });
      this.activityList = activity;
      this.activityIds = ids;
    },
    /**
     * 获取script
     */
    async getScriptInfo() {
      this.scriptLoading = true;
      let { result, status, message } = await this.$http._get(api.scriptList, {
        sheet_id: this.$route.query.unit_id
      });
      if (status == 200) {
        let _scriptIds = [];
        this.scripts = result.scripts;
        this.scripts.forEach((el, index) => {
          _scriptIds.push({
            seq: el.seq,
            id: el.id,
            includeTo: []
          });
          el["details"].forEach((de, deIndex) => {
            de["to"] = JSON.parse(de.to);
            de["type"] = el.type;
            for (let i in de["to"]) {
              de["goto"] = de["to"][i];
              de["gotoType"] = i;
              _scriptIds[index]["includeTo"].push(de["to"][i]);
            }
          });
        });
       
        this.scriptIds = _scriptIds;
        this.scriptLoading = false;
      } else {
        this.$message({
          duration:1000,
          type: "error",
          message: message
        });
      }
    },
    /**
     * unit保存 basic info 信息
     */
    async saveUnit(scope) {
      if(this.basicInfo.attachments.length > 0){
        if(this.basicInfo.attachments[0].url){
          this.basicInfo.attachments[0]['uri'] = this.basicInfo.attachments[0].url;
        }
      }
      this.$refs[scope].validate(valid => {
        if (valid) {
          this.$http._post(api.saveUnit, this.basicInfo).then(res => {
            if (res.status == 200) {
              this.canEditUnit = false;
              if(res.result.is_edit_mark == 1){
                // 记录更新编辑
                this.$http._post(api.publishEdit(res.result.map_id),{id:res.result.map_id}).then((res)=>{
                  this.basicInfo.mark_status = res.result.mark_status
                  // this.queryData = JSON.parse(JSON.stringify(this.$route.query));
                  // this.queryData.mark_status = res.result.mark_status;
                  // this.$router.push({
                  //   query:this.queryData
                  // })
                })
              } 
              if (this.basicInfo.course_id != this.oldCourseId) {
                this.$http._post(api.publishHasList(this.oldCourseId),{course_id:this.oldCourseId}).then((res)=>{
                  if(res.status == 200){
                    
                  }
                });
                this.$http._post(api.publishHasList(this.basicInfo.course_id),{course_id:this.basicInfo.course_id}).then((res)=>{
                  if(res.status == 200){
                    
                  }
                });
                this.oldCourseId = this.basicInfo.course_id;
                this.basicInfo.map_id = res.result.map_id;
                // let queryData = JSON.parse(JSON.stringify(this.$route.query))
                    // queryData.course_id = this.basicInfo.course_id;
                //     queryData.unit_id = this.$route.query.unit_id;
                //     queryData.map_id = res.result.map_id;
                //     queryData.mark_status = this.queryData.mark_status;
                // this.$router.push({
                //   query: queryData
                // });
              }
              this.getUnitDetail();
            }
          });
        }
      });
    },
    /**
     * 取消修改
     */
    cancelSave() {
      this.canEditUnit = false;
      this.getUnitDetail();
    },
    /**
     * 文件上传成功后
     */
    uploadSuccess(data) {
      this.$set(this.basicInfo.attachments, 0, {
        name: data.source_name,
        uri: `${data.domain}/${data.full_url}`
      });
      // this.basicInfo.attachments.push({
      //   name: data.source_name,
      //   uri: `${data.domain}/${data.full_url}`
      // });
      this.$set(this.showUploadImg, 0, {
        name: data.source_name,
        url: `${data.domain}/${data.full_url}`
      });
    },
    /**
     * 删除img
     */
    removeImg(del) {
      if (del) {
        this.basicInfo.attachments = [];
      }
    },
    /**
     * 排序 activity
     */
    async setRank(op, opOrder,type) {
      if (!opOrder && !op) {
        this.canRank = !this.canRank;
      }
      if (this.canRank || opOrder || op) {
        let order = [];
        var oldIdUnit = [];
        if (opOrder) {
          order = opOrder;
        } else {
          await this.activityList.forEach((el, index) => {
            order.push({ id: el.id, seq: index + 1 });
            oldIdUnit.push(el.id);
          });
        }
        if (order.length != 0) {
          let {
              result,
              status,
              message
            } = await this.$http._post(api.activityRank, { orders: order });
            if (status == 200) {
              if (!op) {
                this.$message({
                  duration:1000,
                  type: "success",
                  message: "success"
                });
              }
              if(result.is_edit_mark == 1){
                // 记录更新编辑
                this.$http._post(api.publishEdit(this.basicInfo.map_id),{id:this.basicInfo.map_id}).then((res)=>{
                  this.basicInfo.mark_status = res.result.mark_status;
                  // this.queryData = JSON.parse(JSON.stringify(this.$route.query));
                  // this.queryData.mark_status = res.result.mark_status;
                  // this.$router.push({
                  //   query:this.queryData
                  // });
                })
            }
            this.getActivityList();
          // if(this.oldIdArray.length > 0 && oldIdUnit){
          //   if(this.arrayEquals(this.oldIdArray,oldIdUnit) == false){
          //     if(type == "add" || type == "delete")return;
          //     this.$http._post(api.publishHasList(this.$route.query.course_id),{course_id:this.$route.query.course_id}).then((res)=>{
          //           if(res.status == 200){
                      
          //           }
          //         });
          //     }
          //   }
          } 
          // else {
          //   this.$message({
          //     type: "error",
          //     message: message
          //   });
          // }
        }
      }
    },
    /**
     * 排序 script
     */
    async setRankScript(isDel, opid) {
      if (!isDel) {
        this.canRankScript = !this.canRankScript;
      }
      if (this.canRankScript || isDel) {
        this.scriptLoading = true;
        let order = [];
        if (opid) {
          // 新增排序
          order = [{ id: opid, seq: this.scripts.length + 1 }];
        } else {
          await this.scripts.forEach((el, index) => {
            order.push({ id: el.id, seq: index + 1 });
          });
        }
        if (order.length != 0) {
          let {
            result,
            status,
            message
          } = await this.$http._post(api.scriptOrder, { orders: order });
          if (status == 200) {
            if (!isDel) {
              // window.location.reload()
              // this.$message({
              //   type: "success",
              //   message: "success"
              // });
            }
            // this.$forceUpdate();
            this.getScriptInfo();
          } else {
            this.$message({
              duration:1000,
              type: "error",
              message: message
            });
          }
        }
      }
    },
    /**
     * 通过选择type 添加activity
     */
    async typeAddActivity() {
      // await this.saveActivity({ type: this.choseType });
      if (this.inputActiveName != "") {
        let { result, status, message } = await this.$http._post(
          api.saveActivity,
          {
            mode: 1,
            name:this.inputActiveName,
          }
        );
        if (status == 200 && result.success) {
            await this.unitBindActivity({
              sheet_id: this.$route.query.unit_id,
              activity_id: result.success
            });
          await this.setRank(true, [
            { id: result.success, seq: this.activityList.length + 1 }
          ],"add");
          this.addType = "search";
        }
      }
    },
    /**
     * 搜索 activity id
     */
    async handleIconSearch() {
      if(this.searchActivityId == "")return;
      if (this.activityIds.indexOf(Number(this.searchActivityId)) > -1) {
        this.errTxt = "Activity already exist";
      } else {
          this.unitBindActivity({
            activity_id: this.searchActivityId,
            sheet_id: this.$route.query.unit_id
          });
      }
    },
    /**
     * 保存activity
     */
    async unitBindActivity(param) {
      let { result, status, message } = await this.$http._post(
        api.unitBindActivity,
        param
      );
      if (status == 200) {
        if (result.success) {
          this.$message({
            duration:1000,
            type: "success",
            message: "add success"
          });
          this.setRank(true, [
          { id: param.activity_id, seq: this.activityList.length + 1 }
        ],"add");
        } else {
          this.errTxt = "Activity no exist";
        }
      } 
    },
    /**
     * get activity type list
     */
    async activityTypeList() {
      let res = await this.$http._get(api.activityTypeList);
      this.types = res.result.types;
    },
    /**
     * 跳转到activity config
     */
    goActivityConfig(data) {
      this.$router.push({
        name: "activityConfig",
        query: {
          activity_id: data.id
        }
      });
    },
    /**
     * 删除activity
     */
    unitDetachsActivity(data, index) {
      this.$set(this.acPop, index, false);
      this.$confirm(
        "Do you mean to detach this activity? This change cannot be recovered.",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "error"
        }
      )
        .then(() => {
          // console.log(data)
          if(data.mode == 1){
            this.$http
            ._post(api.unitDetachsActivity, {
              sheet_activity_id: data["sheet_activites"][0].id
            })
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  duration:1000,
                  type: "success",
                  message: "delete success"
                });
                this.$delete(this.activityList, index);
                if (this.activityList.length != 0) {
                  this.setRank(true,"","delete");
                }
                // 删除后重新请求list
                // this.getActivityList();
              }
            });
          } else {this.$http
            ._post(api.courseDetachAssessment, {
              sheet_activity_id: data.id
            })
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  duration:1000,
                  type: "success",
                  message: "delete success"
                });
                this.$delete(this.activityList, index);
                if (this.activityList.length != 0) {
                  this.setRank(true,"","delete");
                }
              }
            });
          }
        })
        .catch(() => {});
    },
    /**
     * 删除script
     */
    delScript(id, index) {
      let arr = []; //存储存在的关联关系
      let seq = [];
      this.scriptIds.forEach((el, elindex) => {
        if (el.includeTo.indexOf(id) > -1) {
          arr[elindex] = true;
          seq.push(el.seq);
        } else {
          arr[elindex] = false;
        }
      });
      this.canNotDelete = arr;
      if (this.canNotDelete.indexOf(true) > -1) {
        this.$alert(
          `This item is linked to No.${seq.join(
            " No."
          )}. Please unlink them, then try to delete this item.`,
          "warning",
          {
            confirmButtonText: "Ok",
            callback: action => {}
          }
        );
      } else {
        this.$confirm(
          "Do you mean to delete this script? This change cannot be recovered.",
          "Warning",
          {
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            type: "error"
          }
        )
          .then(() => {
            this.$http._delete(api.delScript(id)).then(res => {
              if (res.status == 200) {
                this.$message({
                  duration:1000,
                  type: "success",
                  message: "delete success"
                });
                this.$delete(this.scripts, index);
                if (this.scripts.length != 0) {
                  // 删除后重新请求list
                  this.setRankScript(true);
                }
              }
            });
          })
          .catch(() => {});
      }
    },
    /**
     * 获取下拉列表的选项
     *  */
    getScriptIds(id) {
      let eArray = [];
      this.scriptIds.forEach(item => {
        if (item.id != id) {
          eArray.push(item);
        }
      });
      return eArray;
    },


    /**
     * 删除unit
     */
     delUnit(data) {
      this.$confirm(
        "Do you mean to delete this unit? This change cannot be recovered.",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "error"
        }
      )
        .then(() => {
            this.$http._delete(api.publishDel(data)).then(res => {
              if (res.status == 200) {
                this.$message({
                  duration:1000,
                  type: "success",
                  message: "delete success"
                });
                // 删除后重新请求list
                this.$router.push({
                  name: "course",
                  query: {
                    course_id: this.oldCourseId
                  }
                });
              }
            }).catch((err)=>{console.log(err)})
          
        })
        .catch(() => {});
    },
    /**
     * 发布、预览、撤回
     */
     async publish(data, type) {
        let Api = '',
            text = '',
            hint = '',
            content = ''
        if ( type == 'preview' ) { // 发布预览
          Api = api.publishPre(data);

          this.$http._post(Api,{ id: data }).then((res)=>{
              if(res.status == 200){
                  this.$message({
                    duration:1000,
                    type: "success",
                    message: "preview success"
                  });
                  this.basicInfo.mark_status = res.result.mark_status
                  // this.queryData = JSON.parse(JSON.stringify(this.$route.query));
                  // this.queryData.mark_status = res.result.mark_status;
                  // this.$router.push({
                  //   query:this.queryData
                  // })
              }
            });
        } else {
          if (type == 'publish') { //发布正式
            Api = api.publishPub(data);
            text = 'Do you mean to publish this content to the students?';
            hint = 'Publish';
            content = 'Students will see this change right after you publish it.Note that it may change the order students are allowed to practice. So be careful when you publish.'
          } else { //撤回
            Api = api.publishRet(data);
            text = 'Do you mean to retract this content from the students?',
            hint = 'Retract'
            content = 'Students will no longer see this content until you publish it again.'
          }
          const h = this.$createElement;
          this.$msgbox({
            title: hint,
            message: h('div', null, [
              h('p', text),
              h('p', { style: 'color: #ccc' }, content)
            ]),
            showCancelButton: true,
            confirmButtonText: hint,
            cancelButtonText: "Cancel",
            type: "error"
          }).then(()=>{
            this.$http._post(Api,{ id: data }).then((res)=>{
              if(res.status == 200){
                if(type == "publish"){
                  this.$message({
                    duration:1000,
                    type: "success",
                    message: "publish success"
                  });
                } else {
                  this.$message({
                    duration:1000,
                    type: "success",
                    message: "retract success"
                  });
                }
                this.basicInfo.mark_status = res.result.mark_status;
                // this.queryData = JSON.parse(JSON.stringify(this.$route.query));
                // this.queryData.mark_status = res.result.mark_status;
                // this.$router.push({
                //   query:this.queryData
                // })
              }
            });
          });
        }
      },

    /**
     * 发布unit
     */
    // publish() {
    //   this.$http
    //     ._post(api.unitOnline(this.$route.query.unit_id), { offline: 0 })
    //     .then(res => {
    //       if (res.status == 200) {
    //         this.$message({
    //           type: "success",
    //           message: "publish success"
    //         });
    //         this.unitType = "official";
    //       }
    //     });
    // },
    /**
     * 回收unit
     */
    // retract() {
    //   this.$confirm("Do you mean to retract this unit? ", "Warning", {
    //     confirmButtonText: "Retract",
    //     cancelButtonText: "Cancel",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.$http
    //         ._post(api.unitOnline(this.$route.query.unit_id), { offline: 1 })
    //         .then(res => {
    //           if (res.status == 200) {
    //             this.$message({
    //               type: "success",
    //               message: "retract success"
    //             });
    //             this.unitType = "test";
    //           }
    //         });
    //     })
    //     .catch(() => {});
    // },
    /**
     * 删除unit
     */
    deleteUnit(data) {

      const h = this.$createElement;
      this.$msgbox({
        title: "Delete",
            message: h('div', null, [
              h('p', 'Do you mean to delete this content?'),
              h('p', { style: 'color: #ccc' }, 'The content will be deleted from all versions.This change cannot be recovered.')
            ]),
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: "Cancel",
            type: "error"
      })
        .then(() => {
          this.$http._delete(api.publishDel(data)).then(res => {
              if (res.status == 200) {
                    this.$message({
                      duration:1000,
                      type: "success",
                      message: "delete success"
                    });
                    this.$router.push({
                      name: "course",
                      query: {
                        course_id: this.oldCourseId
                      }
                    });
                  }
            }).catch((err)=>{console.log(err)})
          
        })
        .catch(() => {});
    },
    compare(property) {
      return function(a, b) {
        return a[property] - b[property];
      };
    },
    /**
     * 获取script 类型和 goto信息
     */
    async getScriptType() {
      let { result, status, message } = await this.$http._get(
        api.getScriptType
      );
      if (status == 200) {
        this.scriptTypes = result.item.types;
      } else {
        this.$message({
          duration:1000,
          type: "error",
          message: message
        });
      }
    },
    returnData(data) {
      console.log(data);
      this.scriptForm = Object.assign(this.scriptForm, data);
    },
    isSupport(data) {
      this.questionTypeSupport = data;
    },
    /**
     * 操作script
     */
    async opScript(op, param) {
      if (op != "changeGoto") {
        this.scriptLoading = true;
        let obj = {};
        if (op == "new") {
          obj = this.scriptForm;
        } else {
          obj = Object.assign(this.scriptForm, {
            script_id: this.curEditScriptId
          });
        }
        let { result, status, message } = await this.$http._post(
          api.saveScript,
          obj
        );
        if (status == 200) {
          if (op == "new") {
            // 如果是新增，请求排序
            await this.setRankScript(true, result.success);
          } else {
            await this.getScriptInfo();
          }
          this.scriptForm = {
            type: "1",
            location: this.$route.query.unit_id // 所属unit id
          };
          this.editScriptData = [];
          this.$bus.off("setScrollId", { id: "scrollView" });
          this.showAddScript = false;
        }
      } else {
        let { result, status, message } = await this.$http._post(
          api.saveScript,
          param
        );
      }
    },
    /**
     * 添加/编辑 script
     * @param {String} op new edit
     * @param {Array} data 当前点击数据
     *  1: textType,
        2: uploadType,
        3: uploadType,
        4: uploadType,
        5: responseType,
        6: activityType,
        7: questionType
     */
    addScriptBox(op, data) {
      if (!this.scriptLoading) {
        this.scriptOp = op;
        this.showAddScript = true;
        this.$nextTick(() => {
          this.$bus.emit("setScrollId", { id: "scrollView" });
        });
        if (op == "edit") {
          let _data = data[0];
          let type = _data["type"].toString();
          this.editScriptData = data;
          this.$set(this.scriptForm, "type", type);
          this.curEditScriptId = _data["script_id"];
        } else {
          this.editScriptData = [];
        }
      }
    },
    /**
     * 修改goto 'changeGoto'
     * @param {Object} curDetail 当前数据
     * @param {Number} index 当前小项目索引
     */
    async handleChangeGoTo(curDetail, id, index) {
      let { result, status, message } = await this.$http._post(
        api.editScriptTo,
        { detail_id: id, to: curDetail }
      );
      if (status == 200) {
        // 修改 ids中的goto集合
        // this.scriptIds.forEach((el, i) => {
        //   if (el.id == curDetail.script_id) {
        //     // 同一个script id
        //     this.$set(this.scriptIds[i]["includeTo"],index,curDetail.goto)
        //     // this.scriptIds[i]["includeTo"][index] = curDetail.goto;
        //   }
        // });
        this.getScriptInfo();
        this.$message({
          duration:1000,
          type: "success",
          message: "change success"
        });
      }
    },
    /**
     * 获取script 编辑状态
     * @param {String} way 触发方式，默认为load加载页面  click为点击
     * @result lock_status 0未锁定 非0锁定，值为passport_id
     */
    async getScriptStatus(way) {
      this.editLoading = true;
      let { result, status, message } = await this.$http._get(
        api.scriptEditStatus,
        {
          sheet_id: this.$route.query.unit_id
        }
      );
      if (status == 200) {
        this.lockStatus = result.lock_status;
        this.lockUser = result.lock_user;
        this.editLoading = false;
        if (this.lockStatus == 0 && way == "click") {
          // 如果是未锁定状态
          await this.opScriptStatus(0); //开启锁定
        }
        if (
          this.lockStatus == "1" &&
          this.lockUser.id != this.userInfo.id &&
          way == "click"
        ) {
          this.$alert(
            `You can wait for ${this.lockUser.name} to finish editing,  or contact Michael to save changes and give it to you right away.`,
            `${this.lockUser.name} is editing this unit`
          );
        }
      }
    },
    /**
     * 锁定或者归还script 0 锁定 1解锁
     */
    async opScriptStatus(op) {
      let { result, status, message } = await this.$http._post(api.scriptLock, {
        op: op,
        sheet_id: this.$route.query.unit_id
      });
      if (status == 200 && result.success) {
        this.lockStatus = Number(1) - Number(op);
        this.$set(this.lockUser, "id", this.userInfo.id);
        this.$set(this.lockUser, "name", this.userInfo.name);
      }
    },
    /**
     * 显示当前编辑的人
     */
    showEditUser() {
      this.$alert(
        `You can wait for ${this.lockUser.name} to finish editing,  or contact Michael to save changes and give it to you right away.`,
        `${this.lockUser.name} is editing this unit`
      );
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
     * 预览视频
     */
    showVideo(scope) {
      this.previewVideo = scope;
      this.videoDialog = true;
    }
  }
};
</script>
<style lang="css" scoped>
.unitconfig .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
.el-dropdown-menu {
  margin-top: -10px !important;
}
</style>
<style lang="scss" scoped>
.unitconfig {
  .back {
    font-size: 24px;
    margin-top: 16px;
    margin-left: 12px;
    cursor: pointer;
    &:hover {
      color: #4c91ff;
    }
  }
  &-id {
    font-size: 22px;
    font-weight: bold;
    &_type {
      margin-left: 20px;
    }
  }
  &-box {
    border: 1px solid #ededed;
    border-radius: 2px;
  }
  &-part {
    padding: 16px 0;
    h3 {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
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
        vertical-align: bottom;
        margin: 0 8px;
      }
      .finishrank {
        color: #4c91ff;
        font-size: 24px;
        margin: 0 8px;
        cursor: pointer;
        vertical-align: bottom;
      }
    }
    &_tit {
      font-weight: bold;
      color: #666;
      margin-top: 24px;
    }
    &_icon {
      cursor: pointer;
    }
    &_add {
      width: 160px;
      margin-right: 20px;
    }
    .thead {
      background: #fafafa;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      em {
        font-weight: bold;
      }
    }
    .tbody {
      padding: 10px 0;
      border-bottom: 1px solid #ededed;
      background: #fff;
      &.no-delete {
        background: rgb(250, 236, 216);
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
    }
    .unit-activity {
      font-size: 0;
      em {
        display: inline-block;
        font-size: 14px;
        box-sizing: border-box;
        padding: 0 8px;
      }

      .w1 {
        width: 40%;
      }
      .w2 {
        width: 22%;
      }
      .w3 {
        width: 22%;
      }
    }
    .script {
      em {
        display: inline-block;
        font-size: 14px;
        box-sizing: border-box;
        padding: 0 8px;
        vertical-align: middle;
        b {
          font-weight: normal;
          display: block;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: initial;
        }
      }
      .s1 {
        width: 6%;
      }
      .s6 {
        width: 8%;
      }
      .s2 {
        width: 15%;
      }
      .s3 {
        width: 42%;
      }
      .s4 {
        width: 18%;
        .degotoSelect {
          width: 80%;
          margin-bottom: 4px;
        }
        .gotoType {
          width: 24px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          box-sizing: border-box;
          border: 1px solid #dcdfe6;
          border-right: 0;
          border-radius: 4px;
        }
      }
      .s5 {
        i {
          font-size: 16px;
          cursor: pointer;
        }
        .script-icon-edit {
          margin-right: 16px;
          &:hover {
            color: #4c91ff;
          }
        }
        .script-icon-del {
          &:hover {
            color: #f00;
          }
        }
      }
      .add-script {
        box-sizing: border-box;
        border: 1px solid #ededed;
        &_bar {
          border-bottom: 1px solid #ededed;
          padding: 12px;
        }
        &_cont {
          box-sizing: border-box;
          padding: 24px;
        }
      }
    }
  }
  .err-tips {
    font-size: 12px;
    color: #f00;
  }
}

.edit-btn {
    margin-left: 10px;
  }
</style>