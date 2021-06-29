
<template>
    <v-container class="d-flex" style="min-width: 100%;" >
        <v-tabs fixed-tabs background-color="primary" v-model="activeTab" dark v-for="(tab, index) in tabs" :key="index">
            <v-tab :to="tab.route">{{tab.title}}</v-tab>
        </v-tabs>
    </v-container>
</template>
<script>
    export default {
         data:()=>({
         activeTab: null,
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




