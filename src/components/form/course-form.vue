<template>
     <el-form ref="courseForm" :rules="formRules" :model="formData">
        <el-form-item prop="name">
            <el-input type="text" placeholder="CourseName" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item prop="content">
            <el-input type="textarea" placeholder="Description（Optional）" v-model="formData.content"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="mini" @click="saveCourse('courseForm')">Save</el-button>
            <el-button size="mini" @click.stop="cancel">Cancel</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import api from '@/api';
export default {
    name:'courseForm',
    props:{
       formData:{
           type:Object,
       }
    },
    data(){
        return {
            formRules:{
                name:[{ required:true,message:'must',trigger: 'blur' }],
                // content:[{ required:true,message:'must',trigger: 'blur' }]
            }
        }
    },
    watch:{
        'formData'(val){
            this.formData = val
        },
    },
    methods:{
        saveCourse(scope){
            this.$refs[scope].validate((valid)=>{
                if(valid){
                    // if(this.formData.content == ''){
                    //     this.$delete(this.formData,'content');
                    // }
                     this.$http._post(api.saveCourse,this.formData).then(res=>{
                        if(res.status == 200){
                            if(this.formData.id){ // data中有id为编辑
                                 this.$message({
                                    duration:1000,
                                    type:'success',
                                    message:'编辑成功'
                                });
                                this.$emit('editSuccess',this.formData);   
                            }else{
                                this.$message({
                                    duration:1000,
                                    type:'success',
                                    message:'添加成功'
                                })
                                // 保存新增后的id
                                let newId = res.result.success;
                                // 添加到列表数据
                                this.formData.id = newId;
                                this.$emit('saveSuccess',this.formData);
                            }
                        }else{
                            this.$message({
                                duration:1000,
                                type:'warning',
                                message:res.message
                            })
                        }
                    })
                }
            })
        },
        cancel(){
            this.$emit('cancel');
        }
    }
}
</script>