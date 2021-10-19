<template>
 <v-container style="min-width: 100%">
   <h1>Hola</h1>
    <v-col cols="12" v-if="loaded">
      <v-row class="mb-1">
        <v-col class="text-right" cols="5">
          <select class="select-ventas-import" v-model="modificator">
            <option value="">Modificar importe total</option>
            <option value="descuento">Descuento</option>
            <option value="recargo">Recargo</option>
          </select>
        </v-col>
        <v-col cols="3" v-if="modificator">
          <input
            class="totalInput"
            v-model="priceModificationPorcent"
            type="number"
          />
          <v-btn
            class="success ml-3"
            @click="applyModification(modificator, priceModificationPorcent)"
            >Aplicar<v-icon>mdi-check-bold</v-icon></v-btn
          >
        </v-col>
      </v-row>
      <br />
      <div class="horizontalSeparator"></div>
      <v-card style="min-width: 100%">
        <v-row>
          <v-col cols="9">
            <v-form v-on:submit.prevent="saveSale()">
              <v-row>
                <v-col cols="4">
                  <div class="verticalSeparator"></div>
                  <v-container style="color: rgb(63, 81, 181)">
                    <v-row>
                      <v-col class="text-right">
                        <label class="mr-3">TOTAL:</label>
                        <input
                          disabled
                          class="totalInput"
                          v-model="totalVenta"
                          type="text"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-right">
                        <label class="mr-3">ITEMS:</label>
                        <input
                          disabled
                          class="totalInput"
                          type="text"
                          v-model="totalItems"
                        />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-col>
              </v-row>
              <div class="horizontalSeparator"></div>
              <v-row>
                <v-col cols="12">
                  <v-simple-table style="background-color: transparent">
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Producto</th>
                          <th class="text-left">Codigo de barras</th>
                          <th class="text-left">Cantidad de unidades</th>
                          <th class="text-left">Precio unitario</th>
                          <th class="text-left">Precio total</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="p in products" :key="p.id">
                          <td
                            @click="applyIndividualPercent(p)"
                            style="cursor: pointer"
                          >
                            {{ p.nombre }}
                          </td>
                          <td>{{ p.codigoBarra }}</td>
                          <td>
                            <input
                              type="number"
                              @input="updateTotal(p.id)"
                              v-model="p.cantUnidades"
                            />
                          </td>
                          <td>${{ p.precioUnitario }}</td>
                          <td>
                            <div v-if="p.editable === false">
                              ${{ p.precioTotal }}
                            </div>
                            <div
                              class="d-flex align-center"
                              v-if="p.editable === true"
                            >
                              <p class="mt-4">$</p>
                              <input type="number" v-model="p.precioTotal" />
                            </div>
                          </td>

                          <td>
                            <button type="button">
                              <img
                                src="/../../images/icons/delete.svg"
                                @click="deleteLine(p.id)"
                                width="30"
                                height="30"
                              />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-right">
                  <v-btn type="submit" class="primary">Finalizar venta</v-btn>
                  <v-btn type="button" class="default ml-1" @click="clear()"
                    >Cancelar</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-col cols="1">
                <div class="verticalSeparator"></div>
              </v-col>
              <v-col cols="10">
                <Calculator class="mt-2" />
                <div style="text-align: center; padding: 1em 0">
                  <h3>
                    <a
                      style="text-decoration: none"
                      href="https://www.zeitverschiebung.net/es/city/3435910"
                      ><span style="color: gray">Hora actual en</span
                      ><br />Argentina</a
                    >
                  </h3>
                  <iframe
                    src="https://www.zeitverschiebung.net/clock-widget-iframe-v2?language=es&size=medium&timezone=America%2FArgentina%2FBuenos_Aires"
                    width="100%"
                    height="115"
                    frameborder="0"
                    seamless
                  ></iframe>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <ProductDialog
      v-on:productList="addProduct"
      v-on:resetListStatus="resetListOfDialog"
      :refreshListStatus="listennerOfListChange"
    />
    <SearchPresupuestoDialog v-on:selectPresupuesto="selectPresupuesto" :resetPresupuestSearch="resetPresupuestSearch"/>
    <v-dialog v-model="dialogIndividualPercent" width="600">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Modificar precio a renglón
        </v-card-title>
        <v-container class="text-center">
          <v-text-field
            placeholder="Porcentaje"
            type="number"
            v-model="individualPercent"
          ></v-text-field>
          <v-btn class="success ml-3" @click="applyToLine(individualPercent)"
            >Aplicar<v-icon>mdi-check-bold</v-icon></v-btn
          >
        </v-container>
      </v-card>
    </v-dialog>
    <Spinner v-if="!loaded" />
  </v-container>
</template>
<script>
export default {
    data() {
        
    },
}
</script>
<style>

</style>