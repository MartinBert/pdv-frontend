<template>
    <v-container>
        <v-simple-table style="background-color: transparent">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Detalles</th>
                </tr>
            </thead>
            <tbody v-for="item in items" :key="item.id">
                <tr>
                    <td>{{ item.fecha }}</td>
                    <td>{{ item.descripcion }}</td>
                    <td>
                        <Detail 
                            :object="item" 
                            v-on:seeDetails="seeDetails"
                        />
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </v-container>
</template>
<script>
import Detail from '../Buttons/Detail';
export default {
    props:{
        items: Array,
    },
    components:{
        Detail
    },
    methods:{
        seeDetails(object){
            this.$emit('seeDetails', object);
        }
    }
}
</script>