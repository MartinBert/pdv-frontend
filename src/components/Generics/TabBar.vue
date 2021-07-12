<template>
    <v-tabs fixed-tabs background-color="indigo" dark>
        <v-tab v-for="tab in tabs"   :key="tab.id" :to="{ path: '/' + tenant + tab.route }" :class="(tab.id === activeTab) ? 'class_active' : null">
            {{tab.title}}
        </v-tab>
    </v-tabs>
</template>
<script>
export default {
    props:{
        tabs: Array,
        activeTab: Number
    },
    data: () => ({
        tenant: ''
    }),
    mounted(){
        this.tenant = this.$route.params.tenant;
    }
};
</script>
<style>
.class_active{
    background-color: #3f51b5;
    border-bottom: 2px solid white;
}
.v-tabs-slider-wrapper{
    display: none;
}
</style>