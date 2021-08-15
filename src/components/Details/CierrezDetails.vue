<template>
  <v-dialog v-model="$store.state.details.dialog" width="900px">
    <v-card color="var(--main-bg-color)">
      <v-card-title> Detalles de cierre z </v-card-title>
      <v-card-text>
        <h3>Comprobantes del cierre</h3>
        <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Tipo de comprobante</th>
                <th>Número</th>
                <th>Medio de pago</th>
                <th>Plan de pago</th>
                <th>Monto total facturado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="invoice in $store.state.details.objects" :key="invoice.id">
                <td>{{ invoice.nombreDocumento }}</td>
                <td>{{ invoice.numeroCbte }}</td>
                <td>{{ invoice.mediosPago[0].nombre }}</td>
                <td>{{ invoice.planesPago[0].nombre }}</td>
                <td>{{ invoice.totalVenta }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <h3 class="mt-5">Detalle de medios de pago</h3>
         <v-simple-table style="background-color: transparent">
          <template v-slot:default>
            <thead>
              <tr>
                <th>Medio de pago</th>
                <th>Total de pagos</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">
                <td>{{ paymentMethod.nombre }}</td>
                <td>{{ paymentMethod.totalIsUsed }}</td>
                <td>{{ paymentMethod.total }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { roundTwoDecimals } from '../../helpers/mathHelper';
export default {
    computed: {
        paymentMethods(){
            const invoices = this.$store.state.details.objects;
            const paymentMethodsInInvoice = invoices.map(el => el.mediosPago[0]);
            const paymentMethodNames = [...new Set(paymentMethodsInInvoice.map(item => item.nombre))];
            let paymentMethodDetails = [];
            paymentMethodNames.forEach(paymentMethodName => {
                const obj = {
                  nombre: paymentMethodName,
                  totalIsUsed: 0,
                  total: 0
                }
                paymentMethodDetails.push(obj);
            })
            paymentMethodDetails.forEach(paymentMethod => {
                invoices.forEach(invoice => {
                    if(paymentMethod.nombre === invoice.mediosPago[0].nombre){
                        paymentMethod.totalIsUsed += 1
                        paymentMethod.total += parseFloat(invoice.totalVenta)
                    } 
                })
            });
            paymentMethodDetails.forEach(el => {
              el.total = roundTwoDecimals(el.total);
            })
            return paymentMethodDetails;
        }
    }
}
</script>

