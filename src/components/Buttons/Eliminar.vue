<template>
    <a title="Eliminar"
        ><img
            src="/../../images/icons/delete.svg"
            @click="deleteItem(itemId)"
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
        deleteItem(itemId){
            this.$emit('deleteItem', itemId);
        }
    }
}
</script>