<template>
  <div class="cc">
    <view-header title="Course List"></view-header>
    <div class="main">
      <el-select class="cc-select" v-model="levelSelect" disabled placeholder="select course">
        <el-option value="1" label="Level: Low B1"></el-option>
      </el-select>
      <div class="cc-panel g-clearfix">
        <!-- course list -->
        <div class="cc-panel_style cc-panel_course">
          <h3>
            <span>Course</span>
            <el-button
              class="fr add-btn"
              type="primary"
              size="mini"
              plain
              icon="el-icon-plus"
              @click="addItem('course'),curCourseIndex = -1"
            ></el-button>
          </h3>
          <vue-scroll ref="courseVs">
            <ul class="cc-panel_list" ref="course">
              <li
                v-for="(item,index) in courseList"
                :key="item.id"
                :class="{'active': curCourseIndex == index || queryData.course_id == item.id}"
              >
                <div
                  v-show="curCourseId != item.id"
                  @click="showCourseUnit(item.id),curCourseIndex = index"
                  class="cc-panel_list-item"
                >
                  <p class="name" v-html="item.name" :title="item.name"></p>
                  <p class="content" v-html="item.content" :title="item.content"></p>
                  <div class="cc-panel_list-icon">
                    <i class="el-icon-edit" @click.stop="editCourse(item)"></i>
                    <el-dropdown
                      :hide-on-click="false"
                      @command="handleCommand"
                      size="mini"
                      :tabindex="-1"
                    >
                      <span class="el-dropdown-link">
                        <i class="el-icon-arrow-down el-icon-more"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item">Delete</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </div>
                <div v-if="curCourseId == item.id" class="cc-panel_list-edit cc-panel_list-item">
                  <course-form
                    :formData="addCourseData"
                    @editSuccess="editCourseSuccess"
                    @cancel="cancel"
                  ></course-form>
                </div>
              </li>
              <li
                class="cc-panel_list-edit"
                v-show="addType == 'course'"
                id="addcourse"
                ref="addcourse"
              >
                <div class="cc-panel_list-item">
                  <course-form
                    :formData="addCourseData"
                    @saveSuccess="saveCourseSuccess"
                    @cancel="cancel"
                  ></course-form>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
        <el-button
          class="btn-arrow-right"
          style="left:266px"
          type="primary"
          size="mini"
          plain
          circle
          icon="el-icon-arrow-right"
        ></el-button>
        <!-- unit list -->
        <div class="cc-panel_style cc-panel_unit">
          <h3 class="rank" :class="{active: !hasPublishBool}">
            <span>Unit</span>
            <!-- <el-button
              class="fr add-btn"
              style="margin-left:8px"
              type="primary"
              size="mini"
              plain
              :disabled="!queryData.course_id"
              @click="previewAll('preview')"
            >···</el-button> -->
            <el-dropdown class="fr" :hide-on-click="false" size="mini">
              
            <span class="el-dropdown-link">
              <el-button
              class="fr add-btn"
              style="margin-left:8px"
              type="primary"
              size="mini"
              plain
              icon="el-icon-more"
              :disabled="hasPublishBool"
            ></el-button>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
                :disabled="hasPublishBool" 
                icon="el-icon-top">
                  <span @click="previewAll('publish')">Publish List</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            
            <el-button
              class="fr add-btn"
              style="margin-left:8px"
              type="primary"
              size="mini"
              plain
              icon="el-icon-plus"
              :disabled="!queryData.course_id"
              @click="addItem('unit')"
            ></el-button>
            <span
              class="fr"
              @click="setRank()"
              :class="canRank ? 'rank-icon':'el-icon-finished rank-finish'"
            ></span>
          </h3>
          <vue-scroll ref="unitVs">
            <ul
              class="cc-panel_list"
              :class="{'nocont-unit':unitList.length == 0 && addType == ''}"
              ref="unit"
              v-loading="unitLoading"
            >
              <div class="no-cont" v-show="unitList.length == 0 && addType == ''">
                <p>Unit List</p>
                <p>{{ noUnitTip }}</p>
              </div>
              <draggable
                v-if="unitList.length != 0"
                v-model="officlalUnit"
                v-bind="officlaDragOption"
                tag="div"
                group="officlaUnit"
              >
                <transition-group type="transition">
                  <li
                    v-for="(item,index) in officlalUnit"
                    :key="item.id"
                    :class="{'active':(queryData.unit_id == item.sheet_id || queryData.unit_id==item.assessment_id),
                  'greenIcon':item.mark_status == 1,'greenSIcon':item.mark_status == 2,'redIcon':item.mark_status == 3,'redSIcon':item.mark_status == 4}"
                  >
                    <div
                      v-show="curUnitId != item.id"
                      @click="showUnitDetail(item)"
                      :class="{'pl30':!canRank,'list-group-item':!canRank}"
                      class="cc-panel_list-item"
                    >
                      <span v-if="!canRank" class="el-icon-sort sorticon"></span>
                      <div v-if = "item.sheets && item.type == 1">
                        <p class="name" v-html="item.sheets.en_name" :title="item.sheets.en_name"></p>
                        <p class="content" v-html="item.sheets.content" :title="item.sheets.content"></p>
                      </div>
                      <div v-if = "item.assessments && item.type == 2">
                        <p class="name" v-html="item.assessments.name" :title="item.assessments.name"></p>
                        <p class="content" v-html="item.assessments.content" :title="item.assessments.content"></p>
                      </div>
                      <!-- <p class="name" v-html="item.en_name" :title="item.en_name"></p>
                      <p class="content" v-html="item.content" :title="item.content"></p> -->
                      <div class="cc-panel_list-icon">
                        <i class="el-icon-edit" @click.stop="editUnit(item),curUnitId = item.id"></i>
                        <el-dropdown :hide-on-click="false" size="mini" :tabindex="-1">
                          <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon-more"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item 
                            :disabled="item.mark_status == 5" 
                            v-if="item.mark_status == 1 || item.mark_status == 2 || item.mark_status == 5"
                            icon="el-icon-top">
                              <span @click="publish(item,'preview')">Preview</span>
                            </el-dropdown-item>
                            <el-dropdown-item 
                            v-if="item.mark_status == 3 || item.mark_status == 4 "
                            icon="el-icon-top">
                              <span @click="publish(item,'publish')">Publish</span>
                            </el-dropdown-item>
                            <el-dropdown-item
                            :disabled="item.mark_status == 1 || item.mark_status == 3" 
                            icon="el-icon-bottom">
                              <span @click="publish(item,'retract')">Retract</span>
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-delete">
                              <span @click="delUnit(item,index)">Delete</span>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                    <div v-if="curUnitId == item.id" class="cc-panel_list-item">
                      <unit-form
                        :formData="addUnitData"
                        @editUnitSuccess="editUnitSuccess"
                        @cancel="cancel"
                      ></unit-form>
                    </div>
                  </li>
                </transition-group>
              </draggable>
              <!-- <p class="test-unittit" v-if="unitList.length != 0">Test Unit</p>
              <draggable
                v-if="unitList.length != 0"
                v-model="testUnit"
                v-bind="officlaDragOption"
                tag="div"
                group="testUnit"
              >
                <transition-group type="transition">
                  <li
                    v-for="(item,index) in testUnit"
                    :key="item.id"
                    :class="{'active':queryData.unit_id == item.id}"
                  >
                    <div
                      v-show="curUnitId != item.id"
                      @click="showUnitDetail(item)"
                      :class="{'pl30':!canRank,'list-group-item':!canRank}"
                      class="cc-panel_list-item"
                    >
                      <span v-if="!canRank" class="el-icon-sort sorticon"></span>
                      <p class="name" v-html="item.en_name" :title="item.en_name"></p>
                      <p class="content" v-html="item.content" :title="item.content"></p>
                      <div class="cc-panel_list-icon">
                        <i class="el-icon-edit" @click.stop="editUnit(item),curUnitId = item.id"></i>
                        <el-dropdown :hide-on-click="false" size="mini" :tabindex="-1">
                          <span class="el-dropdown-link">
                            <i class="el-icon-arrow-down el-icon-more"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item icon="el-icon-upload2">
                              <span @click="publish(item,'publish')">Publish</span>
                            </el-dropdown-item>
                            <el-dropdown-item icon="el-icon-delete">
                              <span @click="delUnit(item,index)">Delete</span>
                            </el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </div>
                    <div v-if="curUnitId == item.id" class="cc-panel_list-item">
                      <unit-form
                        :formData="addUnitData"
                        @editUnitSuccess="editUnitSuccess"
                        @cancel="cancel"
                      ></unit-form>
                    </div>
                  </li>
                </transition-group>
              </draggable> -->
              <li class="cc-panel_list-edit" v-show="addType == 'unit'" id="addunit" ref="addunit">
                <div class="cc-panel_list-item">
                  <unit-form
                    :formData="addUnitData"
                    @saveUnitSuccess="saveUnitSuccess"
                    @cancel="cancel"
                  ></unit-form>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
        <el-button
          class="btn-arrow-right"
          style="left:538px"
          type="primary"
          size="mini"
          plain
          circle
          icon="el-icon-arrow-right"
        ></el-button>
        <div class="cc-panel_style cc-panel_cont" v-loading="unitDetailLoading" >
          <div v-if="unitDetail.type == 1">
            <h3>
              <span>Unit ID：{{ unitDetail.sheet_id || '-' }}</span>
              <el-button 
              v-if="unitDetail.mark_status == 1"
              class="edit-btn new"
              size="mini"
              :disabled="true" type="success">新内容</el-button>
              <el-button
                v-if="unitDetail.mark_status == 2"
                class="edit-btn new"
                type="primary"
                size="mini"
                :disabled="true"
              >有更新</el-button>
              <el-button 
                v-if=" unitDetail.mark_status == 3"
                class="edit-btn new"
                size="mini"
                :disabled="true"
                type="danger">新内容待发布</el-button>
              <el-button 
                v-if=" unitDetail.mark_status == 4"
                class="edit-btn new"
                size="mini"
                :disabled="true"
                type="danger">待发布</el-button>
              <el-button
                v-if="unitDetail.mark_status == 1 || unitDetail.mark_status == 2"
                class="fr edit-btn new"
                type="primary"
                :disabled="Object.keys(unitDetail).length == 0"
                plain
                size="mini"
                @click="publish(unitDetail,'preview')"
              >Preview</el-button>
              <el-button
                v-if="unitDetail.mark_status == 3 || unitDetail.mark_status == 4"
                class="fr edit-btn new"
                type="primary"
                :disabled="Object.keys(unitDetail).length == 0"
                plain
                size="mini"
                @click="publish(unitDetail,'publish')"
              >Publish</el-button>
              <el-button
                class="fr edit-btn"
                type="primary"
                :disabled="Object.keys(unitDetail).length == 0"
                plain
                size="mini"
                @click="goUnitConfig"
              >Edit</el-button>
            </h3>
            <vue-scroll>
              <div class="unit-detail" v-if="unitDetail.id && $route.query.unit_id">
                <el-row :gutter="10">
                  <el-col :span="10" style="border-right:1px solid #ededed">
                    <div class="unit-detail_info">
                      <div v-if="unitDetail.sheets">
                        <p class="enname">{{ unitDetail.sheets.en_name }}</p>
                        <p class="cnname">{{ unitDetail.sheets.cn_name }}</p>
                        <p class="cont" v-html="changeBr(unitDetail.sheets.content)"></p>
                      </div>
                      <img
                        v-if="unitDetail.attachments"
                        style="max-height:150px;max-width:100%;"
                        :src="unitDetail.attachments[0].url"
                        alt="unit img"
                      />
                    </div>
                    <div class="unit-detail_activity" style="padding:0 20px">
                      <p class="part-tit">Activity</p>
                      <el-table :data="activityList" :header-cell-style="rowClass" size="small">
                        <el-table-column label="Name" width="160" prop="name"></el-table-column>
                        <el-table-column label="Id" prop="id"></el-table-column>
                        <el-table-column label="Questions" prop="detail_total"></el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="unit-detail_script" style="padding:20px">
                      <p class="part-tit">Script</p>
                      <el-table :data="scriptDetail" :header-cell-style="rowClass" size="small">
                        <el-table-column label="No." type="index" :index="indexMethod"></el-table-column>
                        <el-table-column label="Type" prop="type_content" width="100"></el-table-column>
                        <el-table-column label="Description">
                          <template slot-scope="scope">
                            <div v-for="(item,index) in scope.row.details" :key="`detail-${index}`">
                              <p
                                v-if="scope.row.type == 1 || scope.row.type == 5"
                                class="detail-p"
                              >{{ item.desc }}</p>
                              <p v-if="scope.row.type == 6 && index == 0">{{ item.desc }}</p>
                              <img
                                v-if="scope.row.type == 2"
                                :src="item.desc"
                                style="max-width:100%;max-height:64px;cursor:pointer"
                                @click="videoDialog = true,previewVideo = '',previewImg = item.desc"
                              />
                              <vue-plyr v-if="scope.row.type == 3">
                                <audio :src="item.desc" controls style="width:90%;height:32px"></audio>
                              </vue-plyr>
                              <video
                                v-if="scope.row.type == 4"
                                :src="item.desc"
                                style="height:32px;cursor:pointer"
                                @click="showVideo(item.desc)"
                              ></video>
                              <p
                                class="detail-p"
                                v-if="scope.row.type == 7"
                              >[{{ scope.row.type_content }}] {{ item.desc }}</p>
                            </div>
                          </template>
                        </el-table-column>
                        <el-table-column label="Go-to" align="center" width="100">
                          <template slot-scope="scope">
                            <div
                              v-for="(detail,index) in scope.row.details"
                              :key="`goto-${index}`"
                              class="g-clearfix"
                            >
                              <p
                                v-for="(detailTo,detailToKey) in detail.to"
                                :key="`det${detailToKey}`"
                              >
                                <i class="gotoType" v-if="detailToKey == 1">T：</i>
                                <i class="gotoType" v-if="detailToKey == 2">F：</i>
                                <span class="gotoType" v-html="gotoData(detail,detailToKey)"></span>
                              </p>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </vue-scroll>
          </div>
          <div v-if="unitDetail.type == 2">
            <h3>
              <span>Assess Test ID：{{ unitDetail.assessment_id || '-' }}</span>
              <el-button 
              v-if="unitDetail.mark_status == 1"
              class="edit-btn new"
              size="mini"
              :disabled="true" type="success">新内容</el-button>
              <el-button
                v-if="unitDetail.mark_status == 2"
                class="edit-btn new"
                type="primary"
                size="mini"
                :disabled="true"
              >有更新</el-button>
              <el-button 
                v-if=" unitDetail.mark_status == 3"
                class="edit-btn new"
                size="mini"
                :disabled="true"
                type="danger">新内容待发布</el-button>
              <el-button 
                v-if=" unitDetail.mark_status == 4"
                class="edit-btn new"
                size="mini"
                :disabled="true"
                type="danger">待发布</el-button>
              <el-button
                v-if="unitDetail.mark_status == 1 || unitDetail.mark_status == 2"
                class="fr edit-btn new"
                type="primary"
                :disabled="Object.keys(unitDetail).length == 0"
                plain
                size="mini"
                @click="publish(unitDetail,'preview')"
              >Preview</el-button>
              <el-button
                v-if="unitDetail.mark_status == 3 || unitDetail.mark_status == 4"
                class="fr edit-btn new"
                type="primary"
                :disabled="Object.keys(unitDetail).length == 0"
                plain
                size="mini"
                @click="publish(unitDetail,'publish')"
              >Publish</el-button>
              <el-button
                class="fr edit-btn"
                type="primary"
                :disabled="Object.keys(unitDetail).length == 0"
                plain
                size="mini"
                @click="goAssessmentConfig"
              >Edit</el-button>
            </h3>
            <vue-scroll>
              <div class="unit-detail" v-if="unitDetail.id && $route.query.unit_id">
                <el-row :gutter="10">
                  <el-col :span="10">
                    <div class="unit-detail_info">
                      <div v-if="unitDetail.assessments">
                        <p class="assessment-title">Scope</p>
                        <p class="cont" v-html="changeBr(unitDetail.assessments.scope)"></p>
                        <p class="assessment-title">Description</p>
                        <p class="cont" v-html="changeBr(unitDetail.assessments.content)"></p>
                        <p class="assessment-title">Question Number</p>
                        <p class="cont">{{unitDetail.assessments.detail_total}}</p>
                      </div>
                      <img
                        v-if="unitDetail.attachments"
                        style="max-height:150px;max-width:100%;"
                        :src="unitDetail.attachments[0].url"
                        alt="unit img"
                      />
                    </div>
                  </el-col>
                </el-row>
              </div>
            </vue-scroll>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="videoDialog">
      <vue-plyr v-if="previewVideo != '' && videoDialog">
        <video :src="previewVideo" controls style="width:100%;"></video>
      </vue-plyr>
      <img v-if="previewImg != ''" :src="previewImg" style="width:100%;" />
    </el-dialog>
  </div>
</template>
<script>
import api from "@/api";
import draggable from "vuedraggable";
// import {mapGetters, mapActions } from 'vuex'
const courseForm = () =>
  import(
    /* webpackChunkName: 'adaptive' */ "@/components/form/course-form.vue"
  );
const unitForm = () =>
  import(/* webpackChunkName: 'adaptive' */ "@/components/form/unit-form.vue");

export default {
  name: "course",
  data() {
    return {
      levelSelect: "1",
      canEdit: false, // 默认不可编辑
      courseList: [], // course 列表
      curCourseId: "", // 当前点击的course id
      curCourseIndex: -1,
      curUnitIndex: -1,
      curUnitId: "", // 当前点击的unit id
      unitList: [],
      officlalUnit: [], // 已经发布的unit
      oldOfficlalUnit: [],
      oldIdArray: [],//保存原始数组ID
      testUnit: [], // 测试unit
      unitDetail: {},
      addType: "",
      queryData: {}, // url参数
      addCourseData: {
        id: "",
        name: "",
        content: ""
      },
      addUnitData: {
        id: "",
        en_name: "",
        content: "",
        course_id: "",
        type: "",
      },
      unitLoading: false,
      unitDetailLoading: false,
      noUnitTip: "Choose a course first",
      activityList: [],
      scriptDetail: [],
      scriptIds: [],
      canRank: true,
      previewVideo: "",
      previewImg: "",
      videoDialog: false,
      hasPublishBool: true,
    };
  },
  components: {
    courseForm,
    unitForm,
    draggable
  },
  computed: {
    officlaDragOption() {
      return {
        animation: 200,
        group: "description",
        disabled: this.canRank,
        ghostClass: "ghost"
      };
    }
  },
  watch: {
    $route(val) {
      this.queryData = val.query;
    }
  },
  async created() {
    this.queryData = this.$route.query;
    this.getCourse();
    if (this.queryData.course_id) {
      // 如果url存在courseid 则请求对应unit
      await this.getCourseUnit(this.queryData.course_id);
      if (this.queryData.unit_id && this.unitList.length != 0) {
        let curUnitData = {};
        this.unitList.forEach((el, index) => {
          if (el.id == this.queryData.unit_id) {
            curUnitData = el;
          }
        });
        await this.showUnitDetail(curUnitData);
      }
    }
  },
  methods: {
    /**
     * 预览列表&发布列表
    */
    previewAll(type){
      this.$http._post(api.publishList(this.queryData.course_id),{course_id:this.queryData.course_id}).then((res)=>{
        if(res.status == 200){
          this.hasPublishBool = true;
          this.$message({
            duration:1000,
            type: "success",
            message: "Publish list order success"
          });
          this.getCourse();
          this.getCourseUnit(this.queryData.course_id);
        }
      }).catch((err)=>{console.log(err)});
    },
    /**
     * 获取course list
     */
    async getCourse() {
      let { result, status, message } = await this.$http._get(api.courseList);
      if (status == 200) {
        this.courseList = result.courses; // 需要展示的course列表
        if (this.courseList.length) {
          this.courseList.forEach(val=>{
            if(val.id == this.$route.query.course_id){
              if(val.has_published == 0){
                this.hasPublishBool = false;
              } else {
                this.hasPublishBool = true;
              }
            }
          })
          // 如果有数据
          if (this.queryData.course_id) {
            this.$nextTick(() => {
              this.$refs["courseVs"].scrollIntoView(".active", 500);
            });
          } else {
            this.$router.push({
              query: {
                course_id: result.courses[0].id
              }
            });
            this.getCourseUnit(result.courses[0].id);
          }
        }
      } else {
        this.$message({
          duration:1000,
          type: "error",
          message: message
        });
      }
    },
    /**
     * 获取对应course下unit列表
     * @param {Number|String} id course id
     */
    async getCourseUnit(id) {
      this.unitLoading = true;
      this.courseList.forEach(val=>{
        if(val.id == this.$route.query.course_id){
          if(val.has_published == 0){
            this.hasPublishBool = false;
          } else {
            this.hasPublishBool = true;
          }
        }
      })
      // let { result, status, message } = await this.$http._get(api.unitList(id));
      this.$http._get(api.unitList(id)).then((res)=>{
        // console.log(res)
        if (res.status == 200) {
          this.unitLoading = false;
          let num = 0
          this.unitList = res.result.maps; // 所有unit列表
          if (this.unitList.length != 0) {
            let officlal = [],
              test = []; //unit分类
            this.unitList.forEach((el, index) => {
                //   if (el.sheets.is_test) {
                //   test.push(el);
                // } else {
                  officlal.push(el);
                // }
            });
            this.officlalUnit = officlal.sort(this.compare("seq")); // 按照seq排序后存入
            this.oldOfficlalUnit = JSON.parse(JSON.stringify(this.officlalUnit))
            this.oldIdArray = []
            this.oldOfficlalUnit.forEach((val)=>{
              this.oldIdArray.push(val.id);
            });
            // console.log(this.officlalUnit)
            // this.testUnit = test.sort(this.compare("seq"));
            if (this.queryData.unit_id) {
              this.$nextTick(() => {
                this.$refs["unitVs"].scrollIntoView(".active", 500);
              });
            }
          } else {
            this.noUnitTip = "no data, choose again";
          }
        } else {
          this.$message({
            duration:1000,
            type: "error",
            message: message
          });
        }
      })
      
    },
    /**
     * 点击course 展示 对应unit
     * @param {Number|String} id courseid
     */
    async showCourseUnit(id) {
      let curQuery = this.$route.query; // 获取当前url query
      this.addType = "";
      // 如果当前点击的id 不等于url上的id
      if (curQuery.course_id != id) {
        this.$router.push({
          query: {
            course_id: id
          }
        });
      }
      // if(this.courseList.length){
      //   this.courseList.forEach(val=>{
      //     if(val.has_published == 0){
      //       this.hasPublishBool = false;
      //     }
      //   })
      // }
      // 获取对应id的unit
      await this.getCourseUnit(id);
    },
    /**
     *  点击uint 显示unit 详情
     * @param data {Object} 当前unit详情数据
     */
    async showUnitDetail(data) {
      this.unitDetailLoading = true;
      let curQuery = this.$route.query;
      this.unitDetail = data;
      // console.log(data)
      
      if (data.type == 1 && curQuery.unit_id != data.sheet_id) {
        this.$router.push({
          query: {
            course_id: curQuery.course_id,
            unit_id: data.sheet_id
          }
        });
        await this.showUnitActivity({
          course_id: curQuery.course_id,
          cate_id: "0",
          sheet_id: data.sheet_id,
          has_location: 0
        });
        await this.showUnitScript(data.sheet_id);
      } else if(data.type == 2 && curQuery.unit_id != data.assessment_id) {
        this.$router.push({
          query: {
            course_id: curQuery.course_id,
            unit_id: data.assessment_id
          }
        });
        await this.showUnitActivity({
          course_id: curQuery.course_id,
          cate_id: "0",
          sheet_id: data.assessment_id,
          has_location: 0
        });
        await this.showUnitScript(data.assessment_id);
      }
      // console.log(data.id)
      this.unitDetailLoading = false;
    },

    /**
     *  新增,滚动条在底部
     */
    addItem(type = "course") {
      this.addType = type;
      this.curCourseId = "";
      this.addUnitData = {
        id: "",
        en_name: "",
        scope: "",
        content: "",
        type: "1",
        course_id: this.queryData.course_id,
      };
      this.addCourseData = {
        id: "",
        name: "",
        content: ""
      };
      this.$nextTick(() => {
        this.$refs[`${type}Vs`].scrollIntoView(`#add${type}`, 500);
      });
    },
    /**
     *  编辑课程
     */
    editCourse(item) {
      this.curCourseId = item.id;
      this.addCourseData = item;
      this.addType = ""; // 编辑情况下移除新增form
    },
    /**
     *  编辑unit
     */
    editUnit(item) {
      this.curUnitId = item.id;
      if(item.type == 1) {
        this.addUnitData = {
          id: item.sheet_id,
          en_name: item.sheets.en_name,
          content: item.sheets.content,
          course_id: this.queryData.course_id,
          type:'1',
          is_edit_bool: false
        };
      } else {
          this.addUnitData = {
            id: item.assessments.id,
            en_name: item.assessments.name,
            scope: item.assessments.scope,
            content: item.assessments.content,
            course_id: this.queryData.course_id,
            type: '2',
            map_id: item.id,
            is_edit_bool: false
          };
      }
    },
    /**
     *  保存课程
     */
    saveCourseSuccess(data) {
      if (data.id) {
        this.getCourse();
      }
      this.addType = "";
    },
    /**
     *  保存unit
     */
    async saveUnitSuccess(data) {
      if (data.id) {
        // let arr = [];
        // officlalUnit

        this.setRank(true, [{ id: data.id, seq: this.officlalUnit.length + 1 }],"add");
        // await this.getCourseUnit(this.queryData.course_id);
      }
      this.addType = "";
    },
    /**
     *  编辑课程
     */
    async editCourseSuccess(data) {
      // 编辑后重新组合数据
      if (data.id) {
        await this.getCourse();
      }
      this.curCourseId = "";
    },
    /**
     *  编辑unit
     */
    async editUnitSuccess(data) {
      // 编辑后重新组合数据
      if (data.id) {
        await this.getCourseUnit(this.queryData.course_id);
        if (data.id == this.queryData.unit_id) {
          let curUnitData = {};
          this.unitList.forEach((el, index) => {
            if (el.id == data.id) {
              curUnitData = el;
            }
          });
          await this.showUnitDetail(curUnitData);
        }
      }
      this.curUnitId = "";
    },
    /**
     *  删除课程
     */
    handleCommand(command) {
      this.$confirm(
        "Do you mean to delete this course? This change cannot be recovered.",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "error"
        }
      )
        .then(() => {
          this.$http._delete(api.delCourse(command.id)).then(res => {
            if (res.status == 200) {
              this.$message({
                duration:1000,
                type: "success",
                message: "delete success"
              });
              // 删除后重新请求list
              this.getCourse();
            }
          });
        })
        .catch(() => {});
    },
    /**
     * 最新发布、预览、撤回
     */
    async publish(data, type) {
        let Api = '',
            text = '',
            hint = '',
            content = ''
        if ( type == 'preview' ) { // 发布预览
          Api = api.publishPre(data.id);

          this.$http._post(Api,{ id: data.id }).then((res)=>{
              if(res.status == 200){
                  this.$message({
                    duration:1000,
                    type: "success",
                    message: "preview success"
                  });
                data.mark_status = res.result.mark_status
                this.unitDetail.mark_status = res.result.mark_status;
                this.getCourseUnit(this.queryData.course_id);
                this.showUnitDetail(data)
              }
            });
        } else {
          if (type == 'publish') { //发布正式
            Api = api.publishPub(data.id);
            text = 'Do you mean to publish this content to the students?';
            hint = 'Publish';
            content = 'Students will see this change right after you publish it.Note that it may change the order students are allowed to practice. So be careful when you publish.'
          } else { //撤回
            Api = api.publishRet(data.id);
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
            
            this.$http._post(Api,{ id: data.id }).then((res)=>{
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
                this.getCourseUnit(this.queryData.course_id);
                data.mark_status = res.result.mark_status
                this.unitDetail.mark_status = res.result.mark_status;
                this.showUnitDetail(data)
              }
            });
          });
        }
    },
    /**
     * 删除unit
     */
    delUnit(data, index) {
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
            // if(data.type == 1){
            //   this.$http._delete(api.delUnit(data.sheet_id)).then(res => {
            //     if (res.status == 200) {
            //       this.$message({
            //         type: "success",
            //         message: "delete success"
            //       });
            //         this.$delete(this.officlalUnit, index);
            //       if (this.testUnit.length != 0 || this.officlalUnit.length != 0) {
            //         this.setRank(true);
            //       }
            //       // 删除后重新请求list
            //       this.getCourseUnit(this.queryData.course_id);
            //     }
            //   });
            // } else {
            //   this.$http._post(api.courseDetachAssessment,{ course_sheet_id: data.id}).then(res => {
            //     if (res.status == 200) {
            //     }
            //   }).then(()=>{
            //   this.$http._delete(api.delUnit(data.assessment_id)).then(res => {
            //         if (res.status == 200) {
            //           this.$message({
            //             type: "success",
            //             message: "delete success"
            //           });
            //             this.$delete(this.officlalUnit, index);
            //           if (this.testUnit.length != 0 || this.officlalUnit.length != 0) {
            //             this.setRank(true);
            //           }
            //           // 删除后重新请求list
            //           this.getCourseUnit(this.queryData.course_id);
            //         }
            //       });
            //   })
            // }
            this.$http._delete(api.publishDel(data.id)).then(res => {
              if (res.status == 200) {
                  this.$message({
                    duration:1000,
                    type: "success",
                    message: "delete success"
                  });
                  this.$delete(this.officlalUnit, index);
                  if (this.officlalUnit.length != 0) {
                    this.setRank(true,"","delete");
                  }
                  this.getCourseUnit(this.queryData.course_id);
                }
            }).catch((err)=>{console.log(err)})
          
        })
        .catch(() => {});
    },

    /**
     * 显示unit下activity
     */
    async showUnitActivity(param) {
      let res = await this.$http._get(api.activityList, param);
      let activity = res.result.activites;
      this.activityList = activity.sort(this.compare("seq"));
    },
    /**
     * 获取unit下script
     */
    async showUnitScript(id) {
      let { result, message, status } = await this.$http._get(api.scriptList, {
        sheet_id: id
      });
      if (status == 200) {
        let scriptIds = [];
        result.scripts.forEach((el, index) => {
          scriptIds.push({
            seq: el.seq,
            id: el.id
          });
          el["details"].forEach((de, deIndex) => {
            de["to"] = JSON.parse(de.to);
            de["type"] = el.type;
            for (let i in de["to"]) {
              de["goto"] = de["to"][i];
              de["gotoType"] = i;
            }
          });
        });
        this.scriptIds = scriptIds;
        this.scriptDetail = result.scripts;
      }
    },
    gotoData(detail, key) {
      let seq = "--";
      this.scriptIds.forEach((el, index) => {
        if (el.id == detail["to"][key]) {
          seq = el.seq;
        }
      });
      return seq;
    },
    /**
     *  跳转到unit config
     */
    goUnitConfig() {
      // sessionStorage.setItem('unitConfigData',JSON.stringify(this.unitDetail));
      this.queryData.mark_status = this.unitDetail.mark_status
      this.queryData.map_id = this.unitDetail.id
      this.$router.push({
        path: "/adaptive/unitConfig",
        // query: this.queryData
        query:{
          unit_id: this.queryData.unit_id
        }
      });
    },
    /**
     *  跳转到unit config
     */
    goAssessmentConfig(){
      this.$router.push({
        path: "/adaptive/assessmentConfig",
        query: {
          activity_id:this.unitDetail.assessment_id,
        }
      });
    },
    /**
     *  取消
     */
    cancel() {
      this.addType = "";
      this.curCourseId = "";
      this.curUnitId = "";
    },
    /**
     * 升序排序
     */
    compare(property) {
      return function(a, b) {
        return a[property] - b[property];
      };
    },
    /**
     * unit 排序
     * @param {Number|String} opOrder 操作的unit order
     */
    async setRank(op, opOrder,type) {
      if (!opOrder && !op) {
        this.canRank = !this.canRank;
      }
      if (this.canRank || opOrder || op) {
        let order = [];
        if (opOrder) {
          order = opOrder;
        } else {
          let officlal = [],
            test = [];
            var oldIdUnit = [];
          await this.officlalUnit.forEach((el, index) => {
            officlal.push({ id: el.id, seq: index + 1 });
            oldIdUnit.push(el.id)
          });
          await this.testUnit.forEach((el, index) => {
            test.push({ id: el.id, seq: index + 1 });
          });
          order = officlal.concat(test);
        }
        if (order.length != 0) {
          let {
                result,
                status,
                message
              } = await this.$http._post(api.unitOrder, { orders: order });
            this.getCourseUnit(this.queryData.course_id);
          if(this.oldIdArray.length > 0 && oldIdUnit){
            if(this.arrayEquals(this.oldIdArray,oldIdUnit) == false){
              if(type == 'delete' || type == 'add')return;
              this.$http._post(api.publishHasList(this.$route.query.course_id),{course_id:this.$route.query.course_id}).then((res)=>{
                if(res.status == 200){
                  res.result.has_published == 0 ? this.hasPublishBool = false : this.hasPublishBool = true;
                }
              });
            } 
          } 
        }
      }
    },
    showVideo(scope) {
      this.previewVideo = scope;
      this.videoDialog = true;
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
     * 表格表头样式
     */
    rowClass({ row, rowIndex }) {
      return "background:#fafafa";
    },
    indexMethod(index) {
      return index + 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dropdown-menu--mini {
  margin-top: 0px;
}
.cc {
  &-select {
    margin-bottom: 24px;
  }
  &-panel {
    h3 {
      height: 36px;
      line-height: 36px;
      background: #ededef;
      padding: 0 12px;
      box-sizing: border-box;
      position: relative;
      &.active::after {
        content: "";
        position: absolute;
        left: -10px;
        top: -2px;
        width:0;
        height:0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 15px solid hsla(216, 82%, 51%, 0.541176470588235);
        transform: rotate(-45deg);
      }
      span {
        font-weight: bold;
      }
    }
    &_style {
      width: 240px;
      height: calc(100% - 96px);
      padding-bottom: 36px;
      overflow: hidden;
      position: absolute;
      border: 1px solid #e5e5e5;
      box-sizing: border-box;
      border-radius: 4px;
      .add-btn {
        padding: 6px;
        margin-top: 4px;
        text-align: center;
      }
    }
    .btn-arrow-right {
      padding: 6px;
      position: absolute;
      top: 50%;
      z-index: 9;
      transform: translate(0, -50%);
    }
    &_course {
      left: 24px;
    }
    &_unit {
      left: 296px;
      .test-unittit {
        height: 32px;
        line-height: 32px;
        background: #ededed;
        padding-left: 12px;
        font-size: 12px;
      }
      .sorticon {
        position: absolute;
        left: 6px;
        top: 50%;
        transform: translate(0, -50%);
      }
      .pl30 {
        padding-left: 30px;
      }
    }
    &_cont {
      left: 568px;
      width: calc(100% - 592px);
      //   overflow-y: auto
      //   min-width: 240px;
      //   max-width: calc(100% - 592px);
      .edit-btn {
        margin-top: 4px;
        &.new {
          margin-left: 10px;
        }
      }
      .detail-p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .unit-detail {
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        .part-tit {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 12px;
        }
        &_info {
          padding: 20px;
          box-sizing: border-box;
          .enname {
            font-size: 16px;
            font-weight: bold;
          }
          .cnname {
            color: #999;
            margin-bottom: 12px;
          }
          .cont {
            margin-bottom: 12px;
          }
        }
      }
    }
    &_list {
      height: 100%;
      overflow-y: auto;
      &-icon {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translate(0, -50%);
        i {
          display: none;
          margin-bottom: 12px;
          font-size: 16px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      &-item {
        padding: 16px;
        cursor: pointer;
        min-height: 78px;
        box-sizing: border-box;
      }
      li {
        border-bottom: 1px solid #ededed;
        position: relative;
        background: #fff;
        &:hover {
          background: rgba(29, 111, 233, 0.05);
          i {
            display: block;
          }
        }
        &.active {
          background: rgba(29, 111, 233, 0.05);
        }
        &.greenIcon::after{
          content: "";
          position: absolute;
          left: 3px;
          top: 5px;
          width: 11px;
          height: 11px;
          background: hsl(83, 97%, 36%);
          border-radius: 50%;
        }
        &.redIcon::after{
          content: "";
          position: absolute;
          left: 3px;
          top: 5px;
          width: 11px;
          height: 11px;
          background: hsl(353, 74%, 71%);
          border-radius: 50%;
        }
        &.greenSIcon::after{
          content: "";
          position: absolute;
          left: -10px;
          top: -2px;
          width:0;
          height:0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 15px solid hsla(216, 82%, 51%, 0.541176470588235);
          transform: rotate(-45deg);
        }
        &.redSIcon::after{
          content: "";
          position: absolute;
          left: -10px;
          top: -2px;
          width:0;
          height:0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-bottom: 15px solid hsl(353, 74%, 71%);
          transform: rotate(-45deg);
        }
        p {
          width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .no-cont {
        padding-top: 100px;
        p {
          text-align: center;
          font-weight: bold;
          &:last-child {
            color: #666;
            font-size: 12px;
          }
        }
      }
      .name {
        font-size: 16px;
        font-weight: bold;
      }
      .content {
        color: #666;
      }
      &.nocont-unit {
        background: url("../../../assets/unit-no-content.png") no-repeat top
          100px left 10px;
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
  }

  .rank {
    &-icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      background: url("../../../assets/rank-cion.png") no-repeat;
      background-size: 24px;
      cursor: pointer;
      margin-top: 4px;
    }
    &-finish {
      color: #4c91ff;
      font-size: 24px;
      cursor: pointer;
      margin-top: 6px;
    }
  }
  .gotoType {
    width: 24px;
    height: 28px;
    line-height: 28px;
    text-align: center;
  }
}

.assessment-title {
  font-size:20px;
  color: #000;
}
</style>