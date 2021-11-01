<template>
  <div class="question">
    <view-header title="Question List"></view-header>
    <div class="main">
      <el-select class="filter-select level-select fl" v-model="levelSelect" disabled>
        <el-option value="1" label="Low B1"></el-option>
      </el-select>
      <el-cascader
        class="filter-select"
        v-model="courseUnits"
        :options="courseTree"
        :props="defaultData"
        @change="handleChange"
      ></el-cascader>
      <el-select class="filter-select" v-model="filter.topic_type" @change="filter.page = 1">
        <el-option label="All type" value="0"></el-option>
        <el-option
          v-for="(t,key,index) in types"
          :key="'type' + index"
          :label="t.type_content"
          :value="key"
        ></el-option>
      </el-select>
      <el-dropdown class="fr" trigger="hover">
        <el-button type="primary">
          + New
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item,index,key) in types" :key="'dropdown'+ key">
            <a
              :href="item.qm_link"
              target="_blank"
              style="display:block;width:100%;"
            >{{ item.type_content }}</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-input
        class="filter-select fr"
        style="width:200px"
        type="text"
        placeholder="QuestionID"
        @change="handleIconSearch"
        v-model.trim="blurQuestionId"
      >
        <i class="el-icon-search el-input__icon" slot="suffix"></i>
      </el-input>
        <ques-detail style="margin:32px 0;" from="question" :filter="filter"></ques-detail>
    </div>
  </div>
</template>
<script>
import api from "@/api";
const quesDetail = () => import("./detail/quesDetail");
export default {
  name: "question",
  data() {
    return {
      types: {}, // 题目类型
      levelSelect: "1",
      courseTree: [],
      tableData: [],
      allQuestionData: [], // 所有数据
      defaultData: {
        value: "id",
        label: "name",
        children: "cates",
        expandTrigger: "hover"
      },
      courseUnits: [0, 0],
      filter: {
        topic_type: "0",
        question_id: "",
        cate_id: "0",
        sheet_id: "0",
        course_id: "0",
        page: 1,
        limit: 10
      },
      pageTotal: 0,
      singleQuestion: {},
      showDetail: false, // 是否展示详情
      blurQuestionId:'',
    };
  },
  components: {
    quesDetail
  },
  created() {
    this.getCourseTree();
    this.getQuestionQm();
  },
  methods: {
    /**
     * 获取question type跳转题库连接
     */
    async getQuestionQm() {
      let { result, status, message } = await this.$http._get(
        api.getQuestionQm,
        { link: 1 }
      );
      if (status == 200) {
        this.types = result.types;
      } else {
        this.$message({
          duration:1000,
          type: "error",
          message: message
        });
      }
    },
    /**
     * 获取级联筛选
     * course下的unit
     */
    async getCourseTree() {
      let { result, status, message } = await this.$http._get(
        api.getCourseTree
      );
      if (status == 200) {
        if (result.courses.length) {
          result.courses[0]["cates"] = [];
          result.courses[0]["cates"].push({ id: 0, name: "All units" });
          this.courseTree = result.courses;
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
     * 级联菜单筛选
     */
    handleChange(val) {
      this.filter.course_id = val[0];
      this.filter.sheet_id = val[1];
       this.filter.page = 1;
    },
    /**
     * 通过id进行筛选
     */
    handleIconSearch() {
      this.filter.question_id = this.blurQuestionId;
      this.filter.page = 1;
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
      
    },
    /**
     * 选择页数
     */
    handleCurrentChange(val) {
      this.filter.page = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.question {
  .level-select {
    width: 96px;
  }
  .filter-select {
    margin-right: 20px;
  }
  &_cont {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
}
</style>