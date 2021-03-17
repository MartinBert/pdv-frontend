<template>
    <a title="Imprimir"
        ><img
            src="/../../images/icons/printer.svg"
            @click="print()"
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
        print(){
            this.$emit('print', this.object);
        }
    }
}
</script>