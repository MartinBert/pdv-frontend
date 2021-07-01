
<template>
    <v-container class="d-flex" style="min-width: 100%;">
        <v-tabs fixed-tabs background-color="primary"  dark v-for="(tab ) in tabs" :key="tab.id" class="tabs">
            <v-tab :to="tab.route">{{tab.title}}</v-tab>
        </v-tabs>
    </v-container>
</template>
<script>
    export default {
         data:()=>({
        }),
        props: {
            tabs: Array
        },
        methods:{
            setActiveTab(id){
                this.$emit("activeTab", id)
            }
        }
    }
   
</script>
<style lang="scss">
  
</style>




