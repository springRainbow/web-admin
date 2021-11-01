<template>
    <el-form ref="unitForm" :rules="formRules" :model="formData">
        <el-form-item>
            <el-select :disabled="formData.id != ''" placeholder="Unit" v-model="formData.type">
                <el-option label="unit" value="1"></el-option>
                <el-option label="AssessTest" value="2"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item v-if="formData.type == 1" prop="en_name">
            <el-input type="text" placeholder="UnitName" v-model="formData.en_name"></el-input>
        </el-form-item>
        <el-form-item v-if="formData.type == 2" prop="scope">
          <el-input type="text" placeholder="Scope" v-model="formData.scope"></el-input>
      </el-form-item>
        <el-form-item>
            <el-input type="textarea" placeholder="Description（Optional）" v-model="formData.content"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="mini" @click="saveUnit('unitForm')">Save</el-button>
            <el-button size="mini" @click.stop="cancel">Cancel</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import api from '@/api';
export default {
    name:'unitForm',
     props:{
       formData:{
           type:Object,
       }
    },
    data(){
        return {
            formRules:{
                en_name:[{ required:true,message:'must',trigger: 'blur' }],
                type:[{required:true,message:'must',trigger: 'blur'}]
            }
        }
    },
    methods: {
        saveUnit(scope){
            this.$refs[scope].validate((valid)=>{
                if(valid){
                    if(this.formData.type == '1'){
                                this.$http._post(api.saveUnit,this.formData).then(res=>{
                            if(res.status == 200){
                                if(this.formData.id){
                                    this.$message({
                                        duration:1000,
                                        type:'success',
                                        message:'编辑成功'
                                    });
                                    if(res.result.is_edit_mark == 1){
                                        // 记录更新编辑
                                        this.$http._post(api.publishEdit(res.result.map_id),{id:res.result.map_id}).then((res)=>{
                                            
                                            this.formData.is_edit_bool = true;
                                            this.$emit('editUnitSuccess',this.formData);
                                            
                                        })
                                    } else {
                                        this.$emit('editUnitSuccess',this.formData);
                                    }
                                    
                                }else{
                                    this.$message({
                                        duration:1000,
                                        type:'success',
                                        message:'save success'
                                    })
                                    // 保存新增后的id
                                    let newId = res.result.map_id;
                                    // 添加到列表数据
                                    this.formData.id = newId;
                                    this.$emit('saveUnitSuccess',this.formData);
                                }
                            }
                        })
                    } else {
                        this.$http._post(api.saveActivity,{
                            id: this.formData.id,
                            mode:this.formData.type,
                            name: "Assess Test",
                            scope: this.formData.scope,
                            content: this.formData.content
                        }).then(res=>{
                            if(res.status == 200){
                                if(this.formData.id){
                                    this.$message({
                                        duration:1000,
                                        type:'success',
                                        message:'编辑成功'
                                    });
                                    if(res.result.is_edit_mark == 1){
                                        // 记录更新编辑
                                        this.$http._post(api.publishEdit(this.formData.map_id),{id:this.formData.map_id}).then((res)=>{
                                            // console.log(res)
                                            this.formData.is_edit_bool = true;
                                            this.$emit('editUnitSuccess',this.formData);
                                        })
                                    }
                                    
                                }else{
                                    this.$message({
                                        duration:1000,
                                        type:'success',
                                        message:'save success'
                                    })
                                    this.$http._post(api.courseBindAssessment,{
                                        course_id: this.$route.query.course_id,
                                        assessment_id: res.result.success
                                    }).then((res)=>{
                                        // 保存新增后的id
                                        let newId = res.result.success;
                                        // 添加到列表数据
                                        this.formData.id = newId;
                                        this.$emit('saveUnitSuccess',this.formData);
                                    })
                                }
                            }
                        })
                    }
                
                }
            })
        },
        cancel(){
            this.$emit('cancel');
        }
    },
}
</script>