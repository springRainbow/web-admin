<template>
    <div class="view-header">
        <slot name="back"></slot>
        <h3 class="fl">
            {{ title}}
            <slot name="tag"></slot>
        </h3>
        <slot name="button"></slot>
    </div>
</template>
<script>
export default {
    name:'viewHeader',
    props:{
        title:{
            type:String,
            required:false
        }
    },
}
</script>
<style lang="scss" scoped>
    .view-header{
        background: #fff;
        height: 56px;
        line-height: 56px;
        border-bottom: 1px solid #e5e5e5;
        box-sizing: border-box;
        h3{
            font-size: 20px;
            font-weight: bold;
            margin-left: 20px;
        }
    }
</style>