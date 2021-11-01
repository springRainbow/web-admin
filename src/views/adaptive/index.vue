<template>
    <div class="adaptive">
        <router-view></router-view>
    </div>
</template>
<script>
import api from '@/api';
export default {
    name:'adaptive',
    data() {
        return {      
        }
    }
}
</script>
<style lang="scss">
.adaptive{
    .main{
        padding: 24px;
        position: absolute;
        width: 100%;
        height: calc(100% - 56px);
        box-sizing: border-box;
    }
}
</style>
