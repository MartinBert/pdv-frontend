<template>
    <v-container style="background-color: transparent">
        <v-row>
            <v-col cols="5">
                <v-simple-table style="background-color: transparent" ref="tableOfProducts">
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th>Nombre</th>
                        <th>Atributos</th>
                        <th>Código de barras</th>
                        <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody v-for="object in objects" :key="object.id">
                        <tr>
                        <td>{{object.nombre}}</td>
                        <td>{{setAtributesValues(object.atributos)}}</td>
                        <td>{{object.codigoBarra}}</td>
                        <td>
                            <a title="Agregar"
                            v-if="!object.selected"
                            ><img
                                src="/../../images/icons/add.svg"
                                @click="addProductToTagsList(object)"
                                width="40"
                                height="40"
                            /></a>
                            <a title="Quitar"
                            v-if="object.selected"
                            ><img
                                src="/../../images/icons/success.svg"
                                @click="deleteLine(object)"
                                width="40"
                                height="40"
                            /></a>
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
                <Pagination 
                :page="page"
                :totalPages="totalPages"
                :totalVisible="totalVisible"
                v-on:changePage="changePage"
                />
            </v-col>
            <v-col cols="1" class="d-flex justify-center">
                <div class="verticalSeparator"></div>
            </v-col>
            <v-col cols="5">
                <v-row>
                    <v-col>
                        <h3>Seleccione el formato de impresión</h3>
                        <v-row>
                            <v-col cols="6">
                                <img 
                                src="/../../images/labels/labelWithoutPrice.png" 
                                alt="etiqueta de productos" 
                                @click="getTypeClass('labelWithoutPrice')" 
                                v-bind:class="labelFormats.labelWithoutPrice">
                            </v-col>
                            <v-col cols="6">
                                <img 
                                src="/../../images/labels/labelWithoutPrice.png" 
                                alt="etiqueta de productos" 
                                @click="getTypeClass('labelWithAttributes')" 
                                v-bind:class="labelFormats.labelWithAttributes">
                            </v-col>
                            <v-col cols="6">
                                <img 
                                src="/../../images/labels/labelWithoutPrice.png" 
                                alt="etiqueta de productos" 
                                @click="getTypeClass('labelWithPrice')" 
                                v-bind:class="labelFormats.labelWithPrice">
                            </v-col>
                            <v-col cols="6">
                                <img 
                                src="/../../images/labels/labelWithoutPrice.png" 
                                alt="etiqueta de productos" 
                                @click="getTypeClass('labelOnlyBarCode')"  
                                v-bind:class="labelFormats.labelOnlyBarCode">
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-simple-table style="background-color: transparent" height="250">
                            <template v-slot:default>
                            <thead>
                                <tr>
                                <th>Nombre</th>
                                <th>Atributos</th>
                                <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody v-for="object in $store.state.productos.products" :key="object.id">
                                <tr>
                                <td>{{object.nombre}}</td>
                                <td>{{setAtributesValues(object.atributos)}}</td>
                                <td>
                                    <v-text-field
                                    autocomplete="off"
                                    type="number"
                                    counter="3"
                                    maxlength="3"
                                    id="inputQuantity"
                                    @input="setQuantity(object, $event)"
                                    />
                                </td>
                                <td>
                                    <a title="Agregar"
                                    ><img
                                        src="/../../images/icons/ico_11.svg"
                                        @click="deleteLine(object)"
                                        width="40"
                                        height="40"
                                    /></a>
                                </td>
                                </tr>
                            </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end">
                <v-btn class="primary" @click="printLabels(labelList)">IMPRIMIR ETIQUETAS</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import ReportsService from '../services/ReportsService';
import Pagination from './Pagination';

export default {
    name: 'LabelPrinting',
    props: {
        objects: Array,
        page: Number,
        totalVisible: Number,
        totalPages: Number,
        tenant: String,
        token: String
    },
    data: () => ({
        labelList: [],
        labelFormats: {
            labelWithoutPrice: 'label_image_not_selected',
            labelWithAttributes: 'label_image_not_selected',
            labelWithPrice: 'label_image_not_selected',
            labelOnlyBarCode: 'label_image_not_selected'
        }
    }),
    components:{
        Pagination
    },
    methods:{
        changePage(page){
            this.$emit('changePage', page);
        },
        addProductToTagsList(object){
           this.$store.commit('productos/addProductsToList', object);
           this.$emit('checkProduct', object);
           this.$refs.tableOfProducts.$forceUpdate();
        },
        deleteLine(object){
            this.$store.commit('productos/removeProductsToList', object.id);
            this.labelList = this.labelList.filter(el => el.codigoBarra !== object.codigoBarra);
            this.$emit('checkProduct', object);
            this.$refs.tableOfProducts.$forceUpdate();
        },
        setQuantity(object, $event){
            if($event !== ''){
                if($event < 0) $event = 0; 
                if($event.length > 3) $event = $event.slice(0, 3);
                this.labelList = this.labelList.filter(el => el.codigoBarra !== object.codigoBarra);
                const labelList = Array(parseInt($event)).fill({nombre: object.nombre, codigoBarra: object.codigoBarra});
                labelList.forEach(el => {
                    this.labelList.push(el);
                });
            }else{
                return;
            }
        },
        printLabels(labelList){
            ReportsService(this.tenant, "productos", this.token)
            .labels(labelList)
            .then((res) => {
                let file = new Blob([res["data"]], {
                type: "application/pdf",
                });
                let fileURL = URL.createObjectURL(file);
                window.open(fileURL, "_blank");
            });
        },
        setAtributesValues(atributes){
        let str = atributes.reduce((acc, element) => {
            if(element.valor){
            return acc + element.valor + ",";
            }else{
            return acc + element.valorNumerico.toString() + ",";
            }
        }, "");

        return str;
        },
        getTypeClass(typeLabelFormat){
            const selected = 'label_image_selected';
            const notSelected = 'label_image_not_selected';

            switch (typeLabelFormat) {
                case 'labelWithoutPrice':
                        if(this.labelFormats.labelWithoutPrice === selected){
                            this.labelFormats.labelWithoutPrice = notSelected;
                        }else{
                            this.labelFormats.labelWithAttributes = notSelected;
                            this.labelFormats.labelWithPrice = notSelected;
                            this.labelFormats.labelOnlyBarCode = notSelected;
                            this.labelFormats.labelWithoutPrice = selected;
                        }
                    break;

                case 'labelWithAttributes':
                        if(this.labelFormats.labelWithAttributes === selected){
                            this.labelFormats.labelWithAttributes = notSelected;
                        }else{
                            this.labelFormats.labelWithoutPrice = notSelected;
                            this.labelFormats.labelWithPrice = notSelected;
                            this.labelFormats.labelOnlyBarCode = notSelected;
                            this.labelFormats.labelWithAttributes = selected;
                        }
                    break;

                case 'labelWithPrice':
                        if(this.labelFormats.labelWithPrice === selected){
                            this.labelFormats.labelWithPrice = notSelected;
                        }else{
                            this.labelFormats.labelWithoutPrice = notSelected;
                            this.labelFormats.labelWithAttributes = notSelected;
                            this.labelFormats.labelOnlyBarCode = notSelected;
                            this.labelFormats.labelWithPrice = selected;
                        }
                    break;
            
                default:
                        if(this.labelFormats.labelOnlyBarCode === selected){
                            this.labelFormats.labelOnlyBarCode = notSelected;
                        }else{
                            this.labelFormats.labelWithoutPrice = notSelected;
                            this.labelFormats.labelWithAttributes = notSelected;
                            this.labelFormats.labelWithPrice = notSelected;
                            this.labelFormats.labelOnlyBarCode = selected;
                        }
                    break;
            }
        }
    }
}
</script>