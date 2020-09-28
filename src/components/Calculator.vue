<template>
  <v-row>
    <v-col class="calculadora">
      <v-row>
        <v-col class="syntax ml-3 mr-3">
          <input class="historicSyntax" v-model="historicSyntax" type="text">
          <input class="currentSyntax" v-model="currentSyntax" type="text">
          <input class="result" v-model="result" type="text">
        </v-col>
      </v-row>
      <v-row>
        <v-col class="sr">
          <div class="clear" @click="clear()">C</div>
        </v-col>
        <v-col class="sr">
          <div class="clear" @click="partialClear()">CE</div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(1)">1</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(4)">4</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(7)">7</div>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(2)">2</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(5)">5</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(8)">8</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(0)">0</div>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(3)">3</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(6)">6</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="button" @click="addExpression(9)">9</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="black" @click="addExpression(',')">,</div>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-row>
            <v-col class="sr">
              <div class="black" @click="addExpression('+')">+</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="black" @click="addExpression('-')">-</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="black" @click="addExpression('/')">/</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="sr">
              <div class="black" @click="addExpression('*')">x</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="sr">
          <div class="black" @click="addExpression('=')">=</div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "Calculator",
  data() {
    return {
      result: 0,
      historicSyntax: "",
      currentSyntax: "",
    };
  },

  methods: {
    addExpression(e) {
      let searchNumbers = /[0-9]/;
      let searchOperators = /(,|\+|-|\/|\*|=)/;

      let matchNumbers = searchNumbers.exec(e);
      let matchOperators = searchOperators.exec(e);

      if (matchNumbers) {
        this.currentSyntax += e.toString();
        console.log("----------------1");
      }else if(matchOperators[0] == '+' || matchOperators[0] == '-' || matchOperators[0] == '/' || matchOperators[0] == '*'){
        if(this.historicSyntax == ""){
          this.historicSyntax = `${this.historicSyntax} ${this.currentSyntax} ${e}`;
          this.result = this.currentSyntax;
          this.currentSyntax = "";
        }else{
          let previosSimbol = this.historicSyntax.substring(this.historicSyntax.length-1, this.historicSyntax.length-2);
          this.historicSyntax = `${this.historicSyntax} ${this.currentSyntax} ${e}`;
          this.processCalculation(this.currentSyntax, matchOperators[0], previosSimbol);
          this.currentSyntax = "";
        }
        console.log("----------------2");
      }else if(matchOperators[0] == ','){
        console.log("----------------3");
        this.currentSyntax = this.currentSyntax + e;
      }else{
        console.log("----------------4");
        console.log(e);
      }
    },

    clear() {
      this.currentSyntax = "";
      this.historicSyntax = "";
      this.result = 0;
    },

    partialClear() {
      this.currentSyntax = "";
    },

    processCalculation(e, simbol, previosSimbol){

      switch (previosSimbol) {
        case '+':
            this.result = this.result + e;
          break;

        case '-':
            this.result = this.currentSyntax;

          break;

        case '/':
          this.historicSyntax = this.historicSyntax + " " + this.currentSyntax;
          this.currentSyntax = "";
          this.currentSyntax = e.toString();
          break;

        default:
          this.currentSyntax = e.toString();
          break;
      }
    }
  },
};
</script>
<style>
.calculadora {
  margin: 0px 0px 0px 0px;
  font-family: Century Gothic, CenturyGothic, AppleGothic, sans-serif;
  background-color: #e2e2e2;
  border: solid 1px;
  text-align: center;
  border-radius: 10px 10px 10px 10px;
}

.sr {
  width: 100%;
  height: 100%;
}

.sr .button {
  cursor: pointer;
  border: solid 1px black;
  border-radius: 5px 5px 5px 5px;
  background-color: #48c;
  color: #fff;
  font-size: 30px;
}

.sr .black {
  cursor: pointer;
  border: solid 1px;
  border-radius: 5px 5px 5px 5px;
  color: #fff;
  font-size: 30px;
}

.sr .clear {
  background-color: red;
  cursor: pointer;
  border: solid 1px black;
  border-radius: 5px 5px 5px 5px;
  color: #fff;
  font-size: 30px;
}

.syntax {
  position: relative;
  background-color: white;
  border: solid 1px black;
  border-radius: 10px 10px 10px 10px;
}

.syntax .historicSyntax{
  text-align: right;
  width: 100%;
}

.syntax .currentSyntax{
  text-align: right;
  width: 100%;
}

.syntax .result{
  width: 100%;
  font-size: 30px;
}

</style>

