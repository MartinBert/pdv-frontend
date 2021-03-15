<template>
    <v-container>
        <v-simple-table style="background-color: transparent">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Depósito predeterminado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody v-for="item in items" :key="item.id">
                <tr>
                    <td>{{ item.nombre }}</td>
                    <td>
                        <span v-if="item.defaultDeposit == '1'">
                            <img src="/../../images/icons/success.svg" alt="success" width="30" height="30">
                        </span>
                        <span v-if="item.defaultDeposit !== '1'">
                            <v-btn class="primary" @click="selectDefaultDeposit(item)"
                            >Elegir predeterminado</v-btn
                            >
                        </span>
                    </td>
                    <td>
                        <Edit 
                            :itemId="item.id" 
                            v-on:editItem="editItem"
                        />
                        <Delete 
                            :itemId="item.id" 
                            v-on:deleteItem="deleteItem"
                        />
                    </td>
                </tr>
            </tbody>
        </v-simple-table>
    </v-container>
</template>
<script>
import Edit from '../Buttons/Edit';
import Delete from '../Buttons/Delete';
export default {
    props:{
        items: Array,
    },
    components:{
        Edit,
        Delete
    },
    methods:{
        editItem(itemId){
            this.$emit("editItem", itemId);
        },
        deleteItem(itemId){
            this.$emit("deleteItem", itemId);
        },
        selectDefaultDeposit(object){
            this.$emmit('selectDefaultDeposit', object);
        }
    }
}
</script>