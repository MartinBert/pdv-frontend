<template>
    <a title="Imprimir"
        ><img
            src="/../../images/icons/printer.svg"
            @click="print(object)"
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
        print(object){
            this.$emit('print', object);
        }
    }
}
</script>