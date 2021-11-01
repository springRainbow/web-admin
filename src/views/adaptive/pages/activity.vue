<template>
  <div class="activity">
    <view-header title="Activity List"></view-header>
    <div class="main">
      <div class="activity-select g-clearfix">
        <el-select class="filter-select level-select fl" v-model="levelSelect" disabled>
          <el-option value="1" label="Low B1"></el-option>
        </el-select>
        <!-- course unit 筛选 -->
        <el-cascader
          class="filter-select"
          v-model="courseUnits"
          :options="courseTree"
          :props="defaultData"
          @change="handleChange"
        ></el-cascader>
        <!-- type 筛选 -->
        <el-select multiple v-model="filter.activity_type_ids" class="filter-select" @change="filterType">
          <!-- <el-option label="All type" value="0"></el-option> -->
          <el-option v-for="(item,key) in types" :key="key" :label="item" :value="key"></el-option>
        </el-select>
        <!-- question_options 筛选 -->
        <el-select
          v-model="filter.question_option"
          class="filter-select"
          @change="filterQuestionOption"
        >
          <el-option v-for="(item,key) in question_options" :key="key" :label="item" :value="key"></el-option>
        </el-select>
        <!-- 添加 -->
        <!-- <el-dropdown trigger="hover" class="fr" @command="commandAddType">
          <el-button type="primary" class="el-dropdown-link">
            + New
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,key) in types" :key="key" :command="key">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
        <el-button @click="openDialog" type="primary" class="el-dropdown-link fr">
          + New
        </el-button>
        <!-- id 筛选 -->
        <el-input
          type="text"
          placeholder="ActivityID"
          class="filter-search"
          @change="handleIconSearch"
          v-model.trim="searchId"
        >
          <i class="el-icon-search el-input__icon" slot="suffix"></i>
        </el-input>
      </div>
      <el-table
        :data="list"
        :header-cell-style="rowClass"
        style="margin:32px 0;"
        v-loading="loading"
      >
        <el-table-column label="ActivityID" prop="id" width="120px"></el-table-column>
        <el-table-column label="Name" prop="name" width="120px"></el-table-column>
        <el-table-column label="Type" prop="type_content_list" width="200px">
          <template slot-scope="scope">
            <span class="type-span" v-for="val in scope.row.type_content_list" :key="val">{{val}}/</span>
          </template>
        </el-table-column>
        <el-table-column label="Belonging">
          <template slot-scope="scope">
            <div v-if="scope.row.location.length">
              <p
                class="list-belong"
                v-for="(location,index) in scope.row.location"
                :key="location.id"
              >
                {{ curLevel }}
                <span v-if="location.courses[0]">/{{ location.courses[0].name }}</span>
                <span v-if="location.en_name">/{{ location.en_name }}</span>
              </p>
            </div>
            <div v-else>{{ curLevel }}</div>
          </template>
        </el-table-column>
        <el-table-column label="Questions" prop="detail_total" width="120px"></el-table-column>
        <el-table-column label="Action" width="200px">
          <template slot-scope="scope">
            <div class="action-icon">
              <i class="el-icon-edit" @click="editActiviry(scope)"></i>
              <i class="el-icon-delete" @click="delActivity(scope)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin:20px 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filter.page"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="filter.limit"
        layout="prev, pager, next,sizes,total"
        :total="pageTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import api from "@/api";
import { async } from "q";
export default {
  name: "activity",
  data() {
    return {
      list: [], // activity 列表数据
      types: {}, // type 数据
      question_options: {},
      sheets: [],
      curLevel: "",
      levelSelect: "1",
      searchId:'',
      filter: {
        // 筛选数据
        mode: 1,
        course_id: "0", // course id
        sheet_id: "0", // unit id
        activity_type_ids: [], // activity的type类型
        // activity_type: "0", // activity的type类型
        question_option: "0", // 题目数量选项值
        activity_id: "", // id
        cate_id: "0", // all units  1 offical 2test
        page: 1,
        limit: 10,
        has_location: 1
      },
      defaultData: {
        value: "id",
        label: "name",
        children: "cates",
        expandTrigger: "hover"
      },
      courseTree: [],
      courseUnits: [0, 0],
      loading: true,
      pageTotal: 0
    };
  },
  created() {
    this.getActivityList();
    this.getActivityType();
    this.getCourseTree();
  },
  methods: {
    /**
     * 获取activity列表
     */
    async getActivityList() {
      let { result, status, message } = await this.$http._get(
        api.activityList,
        this.filter
      );
      if (status == 200) {
        this.loading = false;
        let orgingList = result.activites.list;
        let sheets = result.activites.sheets; // location sheet映射关系
        let sheet_activites = []; // 存入对应关系的id
        this.curLevel = result.activites.level;
        this.question_options = result.question_options;
        this.pageTotal = result.count;
        orgingList.forEach((el, index) => {
          sheet_activites.push(el.sheet_activites);
        });
        sheet_activites.forEach((el, index) => {
          orgingList[index]["location"] = [];
          el.forEach((s, i) => {
            sheets.forEach((sheet, sheetIndex) => {
              if (s.sheet_id == sheet.id) {
                orgingList[index]["location"].push(sheet);
              }
            });
          });
        });
        this.list = orgingList;
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
      // result.types["0"] = "All Type";
      this.types = result.types;
    },
    /**
     * 编辑activity
     * @param {Object} scope 列表中的数据
     */
    editActiviry(scope) {
      this.$router.push({
        name: "activityConfig",
        query: {
          activity_id: scope.row.id
        }
      });
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
     * 级联菜单选择
     */
    handleChange(val) {
      this.filter.course_id = val[0];
      this.filter.sheet_id = val[1];
      this.filter.page = 1;
      this.getActivityList();
    },
    /**
     * type 筛选
     */
    filterType(val) {
      // console.log(val)
      // let newVal = JSON.stringify(val)
      this.filter.activity_type_ids = val;
      this.filter.page = 1;
      this.getActivityList();
    },
    /**
     * question_option筛选
     */
    filterQuestionOption(val) {
      this.filter.question_option = val;
      this.filter.page = 1;
      this.getActivityList();
    },
    /**
     * 搜索id
     */
    handleIconSearch() {
      this.filter.page = 1;
      this.filter.activity_id = this.searchId;
      this.getActivityList();
    },
    /**
     * 修改每页展示条数
     */
    handleSizeChange(val) {
      this.filter.limit = val;
      this.getActivityList();
    },
    /**
     * 选择页数
     */
    handleCurrentChange(val) {
      this.filter.page = val;
      this.getActivityList();
    },
    /**
     * 添加
     */
    openDialog() {
        this.$prompt('New Activity', {
          confirmButtonText: 'Add',
          cancelButtonText: 'Cancel',
          inputPattern:  /\S/,
          inputErrorMessage: '内容不能为空',
          inputPlaceholder:'Activity Name'
        }).then(({ value }) => {
          // this.$message({
            // duration:1000,
          //   type: 'success',
          //   message: '你的邮箱是: ' + value
          // });
           this.commandAddType(value)
        }).catch(() => {});
      },
    /**
     * 删除activity
     */
    async delActivity(scope) {
      this.$confirm(
        "Do you mean to delete this activity? This change cannot be recovered.",
        "Warning",
        {
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          type: "error"
        }
      )
        .then(async () => {
          let { result, status, message } = await this.$http._delete(
            api.delActivity(scope.row.id)
          );
          if (status == 200) {
            this.getActivityList();
            this.$message({
              duration:1000,
              type: "success",
              message: "delete success"
            });
          } else {
            this.$message({
              duration:1000,
              type: "error",
              message: message
            });
          }
        })
        .catch(() => {});
    },
    /**
     * 通过type添加 activity
     */
    async commandAddType(c) {
      let { result, status, message } = await this.$http._post(
        api.saveActivity,
        { mode: 1,
        name: c }
      );
      if (status == 200) {
        this.$message({
          duration:1000,
          type: "success",
          message: "add success"
        });
        this.getActivityList();
      }
    },
    /**
     * 表格表头样式
     */
    rowClass({ row, rowIndex }) {
      return "background:#fafafa";
    }
  }
};
</script>
<style lang="scss" scoped>
.activity {
  .level-select {
    width: 96px;
  }
  .filter-select {
    margin-right: 20px;
  }
  .filter-search {
    width: 200px;
    float: right;
    margin-right: 20px;
  }
  .block {
    display: block;
  }
  .list-belong {
    span {
      display: inline-block;
      margin: 0 8px;
    }
  }
  .action-icon {
    i {
      font-size: 16px;
      margin-right: 24px;
      cursor: pointer;
      &:hover {
        color: #4c91ff;
      }
    }
  }
}
</style>