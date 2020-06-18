<template>
  <div>
    <v-card>
      <v-row height="500px">
        <v-col cols="12" align="center" justify="center">
          <v-row>
            <v-col cols="12" align="right">
              <v-card-text class="subtitle">{{expresionSyntax}}</v-card-text>
              <v-card-text class="title">{{calculatorSyntax}}</v-card-text>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="ma-2">
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('C')">C</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('CE')">CE</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('%')">%</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('/')">/</v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-2">
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(1)">1</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(2)">2</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(3)">3</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('*')">*</v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-2">
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(4)">4</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(5)">5</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(6)">6</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('-')">-</v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-2">
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(7)">7</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(8)">8</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber(9)">9</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('+')">+</v-btn>
            </v-col>
          </v-row>
          <v-row class="ma-2">
            <v-col cols="6">
              <v-btn class="secondary" width="100%" @click="addNumber(0)">0</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addNumber('.')">.</v-btn>
            </v-col>
            <v-col cols="3">
              <v-btn class="secondary" width="100%" @click="addExpresion('=')">=</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "Calculator",
  data: () => (
      {
    expresionSyntax: "",
    calculatorSyntax: "",
    calculatorResults: "",
    previousSimbol: "",
    store: null,
    simbol: ""
  }),

  mounted(){
      window.onkeypress = event => {
        this.getSimbolCalculator(event.key);
        if (Number.isInteger(parseFloat(event.key)) || event.key == ".") {
          this.calculatorSyntax += event.key;
        } else if (
          this.expresionSyntax == "" &&
          this.calculatorSyntax != "" &&
          event.key != "Enter"
        ) {
          this.getStoreValues();
        } else if (this.expresionSyntax != "" && this.calculatorSyntax != "") {
          this.calculateValues(this.simbol, this.previousSimbol);
        }
      };
      window.onkeyup = event => {
        if (event.key == "Delete") {
          this.calculatorSyntax = "";
          this.expresionSyntax = "";
        } else if (event.key == "Backspace") {
          this.calculatorSyntax = this.calculatorSyntax.substr(
            0,
            this.calculatorSyntax.length - 1
          );
        }
      };
  },

  methods: {

    getSimbolCalculator(e) {
      this.simbol = e;
    },

    getStoreValues() {
      this.previousSimbol = this.simbol;
      if (this.expresionSyntax == "") {
        this.store = this.calculatorSyntax;
        this.expresionSyntax = this.store + " " + this.simbol;
        this.calculatorSyntax = "";
      } else {
        this.store = this.calculatorSyntax;
        this.expresionSyntax = this.store + " " + this.simbol;
        this.calculatorSyntax = "";
      }
    },

    calculateValues(simbol, previousSimbol) {
      if (simbol == "Enter") {    
        if (previousSimbol == "+") {
          this.calculatorSyntax = (
            parseFloat(this.store) + parseFloat(this.calculatorSyntax)
          ).toFixed(2);
          this.expresionSyntax = this.calculatorSyntax;
          this.previousSimbol = simbol;
        } else if (this.previousSimbol == "-") {
          this.calculatorSyntax = (
            parseFloat(this.store) - parseFloat(this.calculatorSyntax)
          ).toFixed(2);
          this.expresionSyntax = this.calculatorSyntax;
          this.previousSimbol = simbol;
        } else if (this.previousSimbol == "/") {
          this.calculatorSyntax = (
            parseFloat(this.store) / parseFloat(this.calculatorSyntax)
          ).toFixed(2);
          this.expresionSyntax = this.calculatorSyntax;
          this.previousSimbol = simbol;
        } else if (this.previousSimbol == "*") {
          this.calculatorSyntax = (
            parseFloat(this.store) * parseFloat(this.calculatorSyntax)
          ).toFixed(2);
          this.expresionSyntax = this.calculatorSyntax;
          this.previousSimbol = simbol;
        } else if (this.previousSimbol == "%") {
          this.calculatorSyntax = (
            (parseFloat(this.store) * parseFloat(this.calculatorSyntax)) /
            100
          ).toFixed(2);
          this.expresionSyntax = this.calculatorSyntax;
          this.previousSimbol = simbol;
        }
        console.log("1");
      } else {
        if (previousSimbol == "Enter"){
          this.store = this.calculatorSyntax;
          if(this.simbol == "+"){
            this.expresionSyntax = this.store + " " + simbol;
            this. calculatorSyntax = "";
            this.previousSimbol = this.simbol;
          }
          if(this.simbol == "-"){
            this.expresionSyntax = this.store + " " + simbol;
            this. calculatorSyntax = "";
            this.previousSimbol = this.simbol;
          } 
          if(this.simbol == "*"){
            this.expresionSyntax = this.store + " " + simbol;
            this. calculatorSyntax = "";
            this.previousSimbol = this.simbol;
          } 
          if(this.simbol == "/"){
            this.expresionSyntax = this.store + " " + simbol;
            this. calculatorSyntax = "";
            this.previousSimbol = this.simbol;
          } 
          if(this.simbol == "%"){
            this.expresionSyntax = this.store + " " + simbol;
            this. calculatorSyntax = "";
            this.previousSimbol = this.simbol;
          }
          console.log("2"); 
        } else {
          if (this.previousSimbol == "+") {
            this.calculatorSyntax = (
              parseFloat(this.store) + parseFloat(this.calculatorSyntax)
            ).toFixed(2);
            this.getStoreValues();
          } else if (this.previousSimbol == "-") {
            this.calculatorSyntax = (
              parseFloat(this.store) - parseFloat(this.calculatorSyntax)
            ).toFixed(2);
            this.getStoreValues();
          } else if (this.previousSimbol == "/") {
            this.calculatorSyntax = (
              parseFloat(this.store) / parseFloat(this.calculatorSyntax)
            ).toFixed(2);
            this.getStoreValues();
          } else if (this.previousSimbol == "*") {
            this.calculatorSyntax = (
              parseFloat(this.store) * parseFloat(this.calculatorSyntax)
            ).toFixed(2);
            this.getStoreValues();
          } else if (this.previousSimbol == "%") {
            this.calculatorSyntax = (
              (parseFloat(this.store) * parseFloat(this.calculatorSyntax)) /
              100
            ).toFixed(2);
            this.getStoreValues();
          }
          console.log("3");
        }
      }
    }
  }


};
</script>

