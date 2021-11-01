<template>
    <div>
        <span style="margin-top:12px;">Add：</span>
        <el-input v-show="addType == 'search'" class="unitconfig-part_add" @focus="hasSearchActivity = false" type="text" placeholder="ActivityID" v-model.trim="searchActivityId"><i class="el-icon-search el-input__icon unitconfig-part_icon" slot="suffix" @click="handleIconSearch"> </i></el-input>
        <el-select v-show="addType == 'choseType'" class="unitconfig-part_add" v-model="choseType" @change="searchActivityType" @visible-change="visibleChange">
            <el-option v-for="(item,key) in types" :key="key" :label="item" :value="key"></el-option>
        </el-select>
        <el-button v-if="addType == 'choseType'" :disabled="!hasSearchActivity" @click="handleIconCheck" type="success" icon="el-icon-check" circle></el-button>
        <el-button v-if="addType == 'choseType'" @click="addType = 'search'" icon="el-icon-close" circle></el-button>
        <el-button v-if="addType == 'search'" @click="addType = 'choseType'">New</el-button>
        <span class="err-tips" v-show="!hasSearchActivity">未查询到相关数据</span>
    </div>
</template>
<script>
export default {
    name:'addActivity',
    data(){
        return {

        }
    }
}
</script>