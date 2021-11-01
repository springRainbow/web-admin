<template>
  <div class="atConfig">
    <view-header :title="`AssessTest ID：${curActivity.id}`">
      <template v-slot:back>
        <i class="el-icon-arrow-left fl back" @click="$router.go(-1)"></i>
        <el-button 
        v-if="form.mark_status == 1"
        class="edit-btn new"
        size="mini"
        disabled type="success">新内容</el-button>
        <el-button
          v-if="form.mark_status == 2"
          class="edit-btn new"
          type="primary"
          size="mini"
          disabled
        >有更新</el-button>
        <el-button 
          v-if=" form.mark_status == 3"
          class="edit-btn new"
          size="mini"
          disabled
          type="danger">新内容待发布</el-button>
        <el-button 
          v-if=" form.mark_status == 4"
          class="edit-btn new"
          size="mini"
          disabled
          type="danger">待发布</el-button>
      </template>
      <template v-slot:button>
        <div class="del-btn fr" style="margin-right:32px;">
          <el-button type="primary" v-if="form.mark_status == 1 || form.mark_status == 2 || form.mark_status == 5" size="small" :disabled="form.mark_status == 5"
            @click="publish(map_id,'preview')">Preview</el-button>
          <el-button type="primary"
            v-if="form.mark_status == 3 || form.mark_status == 4 "
            size="small" @click="publish(map_id,'publish')">Publish</el-button>
          <el-button type="danger" :disabled="form.mark_status == 1 || form.mark_status == 3"  size="small" @click="publish(map_id,'retract')">Retract</el-button>
          <el-button type="danger" size="small" @click="delUnit(map_id)">Delete</el-button>
        </div>
      </template>
    </view-header>
    <div class="main">
      <div class="atConfig-at">
        <div class="atConfig-btn fr">
          <el-button v-if="!canEdit" @click="canEdit = true" type="primary" size="small">Edit</el-button>
          <el-button v-if="canEdit" @click="saveActivity" type="primary" size="small">Save</el-button>
          <el-button v-if="canEdit" @click="cancelEdit" size="small">Cancel</el-button>
        </div>
        <el-form ref="form" :rules="formRules" style="width:60%" label-width="120px" :disabled="!canEdit">
          <!-- <el-form-item  label="Name" prop="name">
            <el-input v-model="form.name" placeholder="请输入Name"></el-input>
          </el-form-item> -->
          <!-- <el-form-item  label="Activity Type" prop="type_ids">
            <el-select multiple v-model="form.type_ids">
              <el-option v-for="(item,key) in types" :label="item" :key="'form' + key" :value="key"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="scope" prop="scope">
            <el-input v-model="form.scope" placeholder="请输入Scope"></el-input>
          </el-form-item>
          <el-form-item label="Description">
            <el-input style="width:300px" type="textarea" :autosize="{ minRows: 4}" v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="Nested in" prop="currentCourseid">
            <el-select v-model="form.currentCourseid">
              <el-option v-for="item in courseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="atConfig-ques">
        <ques-detail from="activity" :qmtype="qmtypes" :courseId = "form.currentCourseid"></ques-detail>
      </div>
    </div>
  </div>
</template>
<script>
  import api from "@/api";
  const quesDetail = () => import("../detail/quesDetail");
  export default {
    name: "activityConfig",
    data() {
      return {
        curActivity: {},
        types: {},
        qmtypes: {},
        canEdit: false, // 可编辑状态
        curLevel: "",
        showDetail: false,
        form: {
          id: "",
          type_ids: [],
          content: "",
          name: "",
          mode: "",
          scope: "",
          currentCourseid: 999,
          mark_status: ""
        },
        formRules: {
          name: [{ required: true, message: "must", trigger: "blur" }]
        },
        courseList: [],//course 列表
        oldCourseId: "", //原始的courseID
        map_id: "",//与course绑定关系的ID
        queryData: ''
      };
    },
    created() {
      this.getActivity(this.$route.query.activity_id);
      this.getActivityType();
      this.getQuestionQm();
      this.getCourse();
    },
    components: {
      quesDetail
    },
    methods: {
      /**
       * 通过id获取 对应activity
       */
      async getActivity(activity_id) {
        try {
          let { result } = await this.$http._get(api.activityListDetail(activity_id));
          let orgingList = result.activities;

          this.curLevel = result.activities.level;

          this.curActivity = orgingList;
          this.curActivity.type_ids == null ? this.form.type_ids = [] : this.form.type_ids = this.curActivity.type_ids;
          this.form.content = this.curActivity.content;
          this.form.id = this.curActivity.id;
          this.form.name = this.curActivity.name;
          this.form.mode = this.curActivity.mode;
          this.form.scope = this.curActivity.scope;
          this.form.currentCourseid = this.oldCourseId = this.curActivity.activity_course.course_id;
          this.form.mark_status = this.curActivity.activity_course.mark_status;
          this.map_id = this.curActivity.activity_course.id;
          
        } catch (error) { console.log(error) }
      },
      /**
       * 获取course list
       */
      async getCourse() {
        let { result, status, message } = await this.$http._get(api.courseList);
        if (status == 200) {
          this.courseList = result.courses; // 需要展示的course列表
        } else {
          this.$message({
            duration:1000,
            type: "error",
            message: message
          });
        }
      },
      /**
       * 获取question type跳转题库连接
       */
      async getQuestionQm() {
        let { result, status, message } = await this.$http._get(
          api.getQuestionQm,
          { link: 1 }
        );
        if (status == 200) {
          this.qmtypes = result.types;
        } else {
          this.$message({
            duration:1000,
            type: "error",
            message: message
          });
        }
      },
      /**
       * 获取activity type
       */
      async getActivityType() {
        let { result } = await this.$http._get(api.activityTypeList);
        this.types = result.types;
      },
      /**
       * activity 保存
       */
      async saveActivity() {
        await this.$http._post(api.saveActivity, this.form).then((res)=>{
          if(res.result.is_edit_mark == 1){
                // 记录更新编辑
                this.$http._post(api.publishEdit(this.map_id),{id:this.map_id}).then((res)=>{
                  this.form.mark_status = res.result.mark_status
                  // this.queryData = JSON.parse(JSON.stringify(this.$route.query));
                  // this.queryData.mark_status = res.result.mark_status;
                  // this.$router.push({
                  //   query:this.queryData
                  // })
                })
            } 
        });
        this.canEdit = false;
        // 记录当前assessment改变状态 是否可发布列表
          
        if (this.oldCourseId == this.form.currentCourseid) return;
        this.$http._post(api.publishHasList(this.oldCourseId),{course_id:this.oldCourseId}).then((res)=>{
            if(res.status == 200){
              
            }
          });
        this.$http._post(api.publishHasList(this.form.currentCourseid),{course_id:this.form.currentCourseid}).then((res)=>{
            if(res.status == 200){
              
            }
          });
        this.$http._post(api.courseDetachAssessment, { course_sheet_id: this.map_id }).then(res => { if (res.status == 200) { } }).then(() => {
          this.$http._post(api.courseBindAssessment, {
            course_id: this.form.currentCourseid,
            assessment_id: this.$route.query.activity_id
          }).then((res) => {
            this.getActivity(this.$route.query.activity_id)
          })
        });
      },
      /**
       * 启动编辑
       */
      editActivity() {
        this.canEdit = true;
      },
      /**
       * 删除activity
       */
      deleteActivity() {
        this.$confirm(
          "Do you mean to delete this activity? This change cannot be recovered.",
          "Warning",
          {
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            type: "error"
          }
        )
          .then(() => {
            this.$http
              ._delete(api.delActivity(this.$route.query.activity_id))
              .then(res => { if (res.status == 200) { } }).
              then(() => {
                this.$http._post(api.courseDetachAssessment, { course_sheet_id: this.map_id }).then(res => {
                  if (res.status == 200) {
                    this.$message({
                      duration:1000,
                      type: "success",
                      message: "delete success"
                    });
                    this.$router.push({
                      name: "activity"
                    });
                  }
                });
              })
          })
          .catch(() => { });
      },
      /**
       * 取消
       */
      cancelEdit() {
        this.canEdit = false;
        this.getActivity(this.$route.query.activity_id);
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
                  // this.queryData = JSON.parse(JSON.stringify(this.$route.query));
                  this.form.mark_status = res.result.mark_status;
                  // this.queryData.mark_status = res.result.mark_status;
                  // console.log(this.queryData)
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
                this.form.mark_status = res.result.mark_status;
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
     * 删除unit
     */
    delUnit(data) {
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
                      name: "course"
                    });
                  }
            }).catch((err)=>{console.log(err)})
          
        })
        .catch(() => {});
      },
    }
  };
</script>
<style lang="scss" scoped>
  .atConfig {
    .back {
      font-size: 24px;
      margin-top: 16px;
      margin-left: 12px;
      cursor: pointer;

      &:hover {
        color: #4c91ff;
      }
    }

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
        background: #fafafa;

        h3 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .info {
          margin-bottom: 12px;

          span {
            width: 120px;
          }

          .location {
            padding-left: 120px;
            margin-bottom: 32px;

            &-span {
              display: block;
              width: 100%;
            }
          }
        }
      }

      .single-question {
        background: #fafafa;
        padding: 20px 32px 100px;
        box-sizing: border-box;
        margin-bottom: 100px;
      }
    }
  }

  .edit-btn {
    margin-left: 10px;
  }
</style>