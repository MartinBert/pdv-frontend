<template>
    <a title="Imprimir"
        ><img
            src="/../../images/icons/add.svg"
            @click="add(object)"
            width="30"
            height="30"
        />
    </a>
</template>
<script>
export default {
    props:{
        object: Object
    },
    methods:{
        add(object){
            this.$emit('add', object);
        }
    }
}
</script>