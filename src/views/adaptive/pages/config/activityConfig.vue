<template>
  <div class="atConfig">
    <view-header :title="`Activity ID：${form.id}`">
      <template v-slot:back>
        <i class="el-icon-arrow-left fl back" @click="$router.go(-1)"></i>
      </template>
      <template v-slot:button>
        <div class="del-btn fr" style="margin-right:32px;">
          <el-button type="danger" size="small" @click="deleteActivity">Delete Activity</el-button>
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
        <el-form
          ref="form"
          :rules="formRules"
          style="width:60%"
          label-width="120px"
          :disabled="!canEdit"
          :model="form"
        >
        <el-form-item label="Name" prop="name">
          <el-input
              v-model="form.name"
              placeholder="请输入Name"
            ></el-input>
        </el-form-item>
          <el-form-item label="Activity Type" prop="type_ids" width="200">
            <el-select @change="filterType" multiple v-model="form.type_ids">
              <el-option v-for="(item,key) in types" :key="'form' + key" :value="key" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Description">
            <el-input
              style="width:300px"
              type="textarea"
              :autosize="{ minRows: 4}"
              v-model="form.content"
            ></el-input>
          </el-form-item>
          <el-form-item label="Nested in">
            <div v-if="curActivity.list ">
              <div v-if= "curActivity.list[0].sheet_activites.length">
                <a
                  style="display:block"
                  v-for="(item,index) in curActivity.location"
                  :key="'table' + item.id"
                  class="atConfig-at_location"
                  :href="`./unitconfig?unit_id=${item.id}`"
                >
                  {{ curLevel }}
                  <i v-if="item.courses[0]">/</i>
                  {{ item.courses[0].name }}
                  <i v-if="item.en_name">/</i>
                  {{ item.en_name }}
                </a>
              </div>
              
            </div>
            <div v-else>{{ curLevel }}</div>
          </el-form-item>
        </el-form>
      </div>
      <div class="atConfig-ques">
        <ques-detail from="activity" @scrollAdd="scrollAdd" ref="mychild" :qmtype="qmtypes"></ques-detail>
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
        mode:""
      },
      formRules: {
        name: [{required: true, message: 'must', trigger: 'blur' }]
      },
    };
  },
  created() {
    this.getActivity(this.$route.query.activity_id);
    this.getActivityType();
    this.getQuestionQm();
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
        let { result } = await this.$http._get(api.activityList, {
          activity_id: activity_id,
          has_location: 1
        });
        // let { result } = await this.$http._get(api.activityList+'/'+activity_id);
        if(result.activites.list[0].type_ids != null){
          result.activites.list[0].type_ids.forEach((val)=>{
            val = val.toString()
            this.form.type_ids.push(val)
          })
        }
        let orgingList = result.activites;
        let sheets = result.activites.sheets; // location sheet映射关系
        let sheet_activites = []; // 存入对应关系的i
        // if(result.activites.level){this.curLevel = result.activites.level};
        result.activites.level ? this.curLevel = result.activites.level : this.curLevel = "";
        if(orgingList.list[0].sheet_activites) {
          orgingList["location"] = [];
          orgingList.list[0].sheet_activites.forEach((el, index) => {
            sheets.forEach((sheet, sheetIndex) => {
              if (el.sheet_id == sheet.id) {
                orgingList["location"].push(sheet);
              }
            });
          });
        }
        this.curActivity = orgingList;
        // this.curActivity.type_ids == null ? this.form.type_ids = []: this.form.type_ids = this.curActivity.type_ids;
        this.form.content = this.curActivity.list[0].content;
        this.form.id = this.curActivity.list[0].id;
        this.form.name = this.curActivity.list[0].name;
        this.form.mode = this.curActivity.list[0].mode;
        
        
      } catch (error) {}
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
    // loadMore(){
    //   setTimeout(() => {
    //      this.$refs.mychild.innerLoadMore();
    //   }, 500);
    // },
    scrollAdd(){

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
      this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$http._post(api.saveActivity, this.form);
            this.canEdit = false;
          }
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
            .then(res => {
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
        .catch(() => {});
    },
    /**
     * 取消
     */
    cancelEdit() {
      this.canEdit = false;
      this.getActivity(this.$route.query.activity_id);
    },
    /**
     * type 筛选
     */
     filterType(val) {
      console.log(val)
      // // let newVal = JSON.stringify(val)
      // this.filter.activity_type_ids = val;
      // this.filter.page = 1;
      // this.getActivityList();
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
</style>