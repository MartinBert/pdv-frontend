<template>
    <v-container>
        <v-simple-table style="background-color: transparent">
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header.$index">{{ header }}</th>
                    <th v-if="isNotEmpty(actions)">Acciones</th>
                </tr>
            </thead>
            <tbody v-for="item in items" :key="item.id">
                <tr>
                    <td v-for="value in values" :key="value.$index">{{ item[value] }}</td>
                    <td v-if="isNotEmpty(actions)">
                        <span v-if="containValue('editar')">
                            <Editar 
                                :itemId="item.id" 
                                v-on:editItem="editItem"
                            />
                        </span>
                        <span v-if="containValue('eliminar')">
                            <Eliminar 
                                :itemId="item.id" 
                                v-on:deleteItem="deleteItem"
                            />
                        </span>
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </v-container>
</template>
<script>
import Editar from './Buttons/Editar';
import Eliminar from './Buttons/Eliminar';
export default {
    props:{
        headers: Array,
        items: Array,
        values: Array,
        actions: Array
    },
    components:{
        Editar,
        Eliminar
    },
    methods:{
        isNotEmpty(array){
            return (array.length > 0) ? true : false;
        },
        containValue(value){
            const result = this.actions.filter(el => el === value);
            return (this.isNotEmpty(result)) ? true : false;
        },
        editItem(itemId){
            this.$emit("editItem", itemId);
        },
        deleteItem(itemId){
            this.$emit("deleteItem", itemId);
        }
    }
}
</script>
