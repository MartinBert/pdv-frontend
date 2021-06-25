<template>
    <v-container class="d-flex" style="min-width: 100%;">
        <v-tabs fixed-tabs background-color="primary" dark v-for="(tab, index) in tabs" :key="index">
            <v-tab :to="tab.route">{{tab.title}}</v-tab>
        </v-tabs>
    </v-container>
</template>
<script>
    export default {
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



