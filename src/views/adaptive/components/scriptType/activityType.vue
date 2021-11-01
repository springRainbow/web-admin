<template>
  <div class="activitytype">
    <div class="activitytype-bar">
      <span>ActivityID：</span>
      <el-input
        type="text"
        style="width:160px;"
        @change="searchActivity"
        v-model.trim="activityid"
        placeholder="search"
        size="small"
      ></el-input>
    </div>
    <div class="activity-cont" v-loading="loading">
      <p class="nocont" v-if="tipsText != ''">{{ tipsText }}</p>
      <div v-if="tipsText == ''" class="cont">
        <p>
          <span class="tit">Name：</span>
          {{ curActivity.name }}
          <el-button
            type="primary"
            size="small"
            class="fr"
            @click="goActivityConfig(curActivity.id)"
          >Edit</el-button>
        </p>
        <p>
          <span class="tit">Type：</span>
          <span v-for="val in curActivity.type_content_list">{{val}} / </span>
        </p>

        <p>
          <span class="fl tit">Nested in：</span>
          <em v-for="(item,index) in curActivity.location" :key="'ac' + item.id">
            <div style="padding-left:102px;">
              {{ item.courses[0].name }}
              <i v-if="item.en_name">/</i>
              {{ item.en_name }}
            </div>
          </em>
        </p>
        <p>
          <span class="tit">Description：</span>
          {{curActivity.content}}
        </p>
      </div>
    </div>
    <div class="goto g-clearfix" v-if="tipsText == ''">
      <div v-for="(item,key) in formData.to[0]" class="fl">
        <em v-if="key == '1'">
          True (Correct)：
          <span style="margin-right:4px;">Go to</span>
        </em>
        <em v-if="key == '2'" style="margin-left:32px;">
          False (Incorrect)：
          <span style="margin-right:4px;">Go to</span>
        </em>
        <el-select v-model="formData.to[0][key]" size="small" @change="changeGoto" style="width:120px">
          <el-option label="No.--" :value="-1"></el-option>
          <el-option
            v-for="(to,index) in ids"
            :key="`to${index}`"
            :label="`No.${to.seq}`"
            :value="to.id"
            v-if="editScriptData.length == 0 || to.id != editScriptData[0]['script_id']"
          ></el-option>
        </el-select>
      </div>
      <!-- <el-select
        size="small"
        v-model="formData.to[0]['1']"
        style="width:120px"
        @change="changeGoto"
      >
        <el-option label="No.--" :value="-1"></el-option>
        <el-option
          v-for="(to,index) in ids"
          :key="`to${index}`"
          :label="`No.${to.seq}`"
          :value="to.id"
          v-if="editScriptData.length == 0 || to.id != editScriptData[0]['script_id']"
        ></el-option>
      </el-select>
      <em style="margin-left:42px;">False (Incorrect)：</em>
      <span style="margin-right:4px;">Go to</span>
      <el-select
        size="small"
        v-model="formData.to[0]['2']"
        style="width:120px"
        @change="changeGoto"
      >
        <el-option label="No.--" :value="-1"></el-option>
        <el-option
          v-for="(to,index) in ids"
          :key="`to${index}`"
          :label="`No.${to.seq}`"
          :value="to.id"
          v-if="editScriptData.length == 0 || to.id != editScriptData[1]['script_id']"
        ></el-option>
      </el-select>-->
    </div>
  </div>
</template>
<script>
import api from "@/api";
export default {
  name: "activityType",
  data() {
    return {
      formData: {
        activity_id: 0,
        to: [{ "1": -1, "2": -1 }]
      },
      activityid: "",
      tipsText: "Search ActivityID or Create New Activity",
      curActivity: {},
      loading: false
    };
  },
  watch: {
    activityid(val) {
      this.tipsText = "Search ActivityID or Create New Activity";
    }
  },
  props: {
    // 编辑传入
    editScriptData: {
      type: Array,
      required: false
    },
    // 所有script id
    ids: {
      type: Array,
      required: true
    }
  },
  created() {
    if (this.editScriptData.length) {
      this.formData.to = [];
      this.activityid = this.editScriptData[0]["activity_id"];
      this.formData.activity_id = this.activityid;
      this.$set(this.formData.to,0,this.editScriptData[0].to)
      this.searchActivity();
    }
  },
  methods: {
    /**
     * 搜索activity id
     */
    async searchActivity() {
      this.loading = true;
      let curQuery = this.$route.query;
      let { result, status, message } = await this.$http._get(
        api.activityList,
        {
          course_id: curQuery.course_id,
          sheet_id: curQuery.unit_id,
          cate_id: "0",
          activity_id: this.activityid,
          mode: 1
        }
      );
      if (status == 200) {
        this.loading = false;
        if (result.count == 0) {
          this.tipsText =
            "Oops, Nothing. Something wrong with the ID, please check again.";
        } else {
          this.tipsText = "";
          let orgingList = result.activites.list[0];
          let sheets = result.activites.sheets; // location sheet映射关系
          let sheet_activites = []; // 存入对应关系的id
          this.curLevel = result.activites.level;
          orgingList["location"] = [];
          orgingList.sheet_activites.forEach((el, index) => {
            sheets.forEach((sheet, sheetIndex) => {
              if (el.sheet_id == sheet.id) {
                orgingList["location"].push(sheet);
              }
            });
          });
          this.curActivity = orgingList;
          this.formData.activity_id = this.curActivity.id;
          this.$emit("returnData", this.formData);
        }
      }
    },
    changeGoto(val) {
      // console.log(this.formData);
      this.$emit("returnData", this.formData);
    },
    /**
     * 跳转到activity config
     */
    goActivityConfig(id) {
      this.$router.push({
        name: "activityConfig",
        query: {
          activity_id: id
        }
      });
    }
  }
};
</script>
<style lang="scss" scpoed>
.activitytype {
  &-bar {
    padding: 12px;
    border-bottom: 1px solid #ededed;
    background: #fafafa;
  }
  .nocont {
    text-align: center;
    height: 100px;
    line-height: 100px;
    color: #666;
    background: #fafafa;
  }
  .cont {
    padding: 20px;
    background: #fafafa;
    p {
      margin-bottom: 12px;
      .tit {
        display: inline-block;
        font-weight: bold;
        width: 100px;
      }
    }
  }
  .goto {
    margin-top: 24px;
    em {
      font-weight: bold;
    }
  }
}
</style>