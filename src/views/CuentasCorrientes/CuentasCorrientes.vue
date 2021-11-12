<template>
  <div class="conteiner">

    <div class="conteiner__client">
      <div class="client__select">
        <h2 class="client__title">Cliente:</h2>
        <div class="client__selectInput">
          <v-autocomplete
                :items="clientes"
                v-model="object.cliente"
                @change="inputChange()"
                multiple
                item-text="razonSocial"
                label="Seleccione un cliente"
                :return-object="true"
                :rules="[(v) => !!v || 'Campo requerido...']"
          ></v-autocomplete>
        </div>
      </div>
      <div class="client__date">
          <h2 class="client__title">Fecha desde:</h2>
        <div class="client__dateSelect">
          <v-text-field
            style="width:70%"
            id="input1"
            name="input1"
            type="date"
            v-model="fechaDesde"
            label="Fecha desde"
            @input="filterObjects()"
          >
          </v-text-field>
        </div>
      </div>
    </div>

    <div class="conteiner__dataclient">
      <span class="nombre">
        <p class="dataclient__text"><strong>Nombre:</strong> {{nombre}}</p>
      </span>
      <span class="nombre">
        <p class="dataclient__text"><strong>Teléfono:</strong> {{telefono}}</p>
      </span>
      <span class="nombre">
        <p class="dataclient__text"><strong>Condición frente al IVA:</strong> {{condicionIva.nombre}}</p>
      </span>
      <span class="nombre">
        <p class="dataclient__text"><strong>CUIT:</strong> {{cuit}}</p>
      </span>
      <span class="nombre">
        <p class="dataclient__text"><strong>Dirección:</strong> {{direccion}}</p>
      </span>
      <span class="nombre">
        <p class="dataclient__text"><strong>Correo:</strong> {{email}}</p>
      </span>
      <span class="nombre">
        <p class="dataclient__text"><strong>Razón Social:</strong> {{razonSocial}}</p>
      </span>
    </div>

    <div class="conteiner__clientsales">
    <v-data-table
      :headers="headers"
      :items="ventas"
      class="elevation-6"
      hide-default-footer
    >
      <template v-slot:[`item.productos`]="{ item }">
        <Detail :objectsArray="item.productos" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.mediosPago`]="{ item }">
        <Detail :objectsArray="item.mediosPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.planesPago`]="{ item }">
        <Detail :objectsArray="item.planesPago" v-on:seeDetails="seeDetails" />
      </template>
      <template v-slot:[`item.acciones`]="{ item }">
        <Print :object="item" v-on:print="print" />
      </template>
    </v-data-table>
    <Pagination
        :page="filterParams.page"
        :totalPages="filterParams.totalPages"
        :totalVisible="7"
        v-on:changePage="filterObjects"
    />

    </div>


    <div class="conteiner__detalle">
      
    </div>
  </div>

</template>

<script>
import GenericService from "../../services/GenericService";
import Pagination from "../../components/Pagination";
import Detail from "../../components/Buttons/Detail";
import Print from "../../components/Buttons/Print";
export default {
  data:()=>({
    loguedUser: JSON.parse(localStorage.getItem("userData")),
    token: localStorage.getItem("token"),
    tenant: "",
    fechaDesde:"",
    nombre:"",
    condicionIva:"",
    cuit: "",
    direccion: "",
    email: "",
    razonSocial: "",
    telefono: "",
    object: {
      cliente:""
    },
    clientes: [],
    ventas:[],
    loaded: false,
    headers: [
      { text: "Fecha", value: "fechaEmision" },
      { text: "Compra", value: "productos", sortable: false },
      { text: "Pago",value: "mediosPago",sortable: false,},
      { text: "Monto Compra", value: "totalVenta", sortable: false },
      //aqui va el valor de lo que el cliente paga de su cuenta corriente
      { text: "Monto pago", value: "totalVenta" },
      { text: "Monto", value: "this.calculoMonto", sortable: false },
    ],
    calculoMonto:1500,
    filterParams: {
      blackReceiptFilter: "",
      sucursalId: "",
      barCode:"",
      numeroCbte:"",
      fechaEmision: "",
      comprobanteCerrado: "",
      numeroComprobante: "",
      totalVenta: "",
      facturaA: false,
      facturaB: false,
      facturaC: false,
      page: 1,
      size: 10,
      totalPages:0,
    },
  }),
  mounted(){
    this.tenant = this.$route.params.tenant;
    this.getObjects();

    
  },
      
  components: {
    Pagination,
    Detail,
    Print,
  },
  methods:{
    getObjects() {
      let sucursalId;
      if (this.loguedUser.perfil > 1) {
        sucursalId = this.loguedUser.sucursal.id;
      }

      const clientFilter = {
        sucursalId: sucursalId,
        personaSocialReason: "",
        personaName: "",
        personaCuit: "",
        personaDirection: "",
        personaContactName: "",
        page: 1,
        size: 100000,
      };

      GenericService(this.tenant, "clientes", this.token)
        .filter(clientFilter)
        .then((data) => {
          this.clientes = data.data.content;
        });

    },
    
    seeReports() {
      this.$store.commit("eventual/mutateEventualDialog");
    },

    seeDetails(objects) {
      this.$emit("seeDetails", objects);
    },
    
    print(object) {
      this.$emit("print", object);
    },
    
     filterObjects(page) {
      if (page) this.filterParams.page = page;
      GenericService(this.tenant,"ventas", this.token)
        .filter(this.filterParams)
        .then((data) => {
          //filtrar por remitos R
          this.ventas = data.data.content;
          this.filterParams.totalPages = data.data.totalPages;
          this.loaded = true;
          });  
    },

    inputChange(){
      console.log(this.object);
      //aca se tiene que validar que haya un solo cliente seleccionado
      if(this.object.cliente[0]){
      this.nombre = this.object.cliente[0].nombre;
      this.condicionIva= this.object.cliente[0].condicionIva;
      this.cuit= this.object.cliente[0].cuit;
      this.direccion= this.object.cliente[0].direccion;
      this.email= this.object.cliente[0].email;
      this.razonSocial= this.object.cliente[0].razonSocial;
      this.telefono= this.object.cliente[0].telefono;
      }else{
       this.nombre = "";
      this.condicionIva="";
      this.cuit= "";
      this.direccion= "";
      this.email=  "";
      this.razonSocial= "";
      this.telefono=  "";
        
      }
    this.filterObjects();

    }
  }
}
</script>

<style scooped>
.conteiner{
  width: 100%;
  min-height: 100%;
  background-color: whitesmoke;
  border: 1px solid rgb(139, 137, 137);
  display: flex;
  flex-direction: column;
}

  .conteiner__client{
    width: 100%;
    border-bottom: 1px solid rgb(139, 137, 137);
    padding: 10px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;

  }
      .client__select{
        width: 45%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
          .client__title{
            margin-right: 20px;
          }

      .client__date{
        width: 45%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }




  .conteiner__dataclient{
    width: 100%;
    min-height: 50px;
    border-bottom: 1px solid rgb(139, 137, 137);
    padding: 10px;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

      .dataclient__text{
        font-size: 1rem;
        font-weight: 400;
      }
  .conteiner__clientsales{
    width: 100%;
    min-height: 50px;
    border-bottom: 1px solid rgb(139, 137, 137);
    padding: 10px;
   
  }


















  .conteiner__detalle{
    width: 100%;
    min-height: 50px;
    border-bottom: 1px solid rgb(139, 137, 137);
    padding: 10px;
  
  }
</style>