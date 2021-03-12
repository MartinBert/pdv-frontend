<template>
    <a title="Editar"
        ><img
            src="/../../images/icons/edit.svg"
            @click="editItem(itemId)"
            width="30"
            height="30"
        />
    </a>
</template>
<script>
export default {
    props:{
        itemId: Number
    },
    methods:{
        editItem(itemId){
            this.$emit('editItem', itemId);
        }
    }
}
</script>