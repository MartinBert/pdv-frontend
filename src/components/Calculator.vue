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
          <div class="clear" @click="currentSyntaxClear()">CE</div>
        </v-col>
        <v-col class="sr">
          <div class="clear" @click="partialClear()">«</div>
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
              <div class="black" @click="addExpression('.')">.</div>
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
      let searchOperators = /(.|\+|-|\/|\*|=)/;

      let matchNumbers = searchNumbers.exec(e);
      let matchOperators = searchOperators.exec(e);

      if (matchNumbers) {
        this.currentSyntax += e.toString();
      }else if(matchOperators[0] == '+' || matchOperators[0] == '-' || matchOperators[0] == '/' || matchOperators[0] == '*'){
        if(this.historicSyntax && this.currentSyntax){
          let previosSimbol = this.historicSyntax.slice(this.historicSyntax.length - 1, this.historicSyntax.length);
          this.historicSyntax = `${this.historicSyntax} ${this.currentSyntax} ${e}`;
          this.processCalculation(this.currentSyntax, previosSimbol);
          this.currentSyntax = "";
        }else if(this.historicSyntax && !this.currentSyntax){
          this.historicSyntax = this.historicSyntax.slice(0, this.historicSyntax.length - 1);
          this.historicSyntax = this.historicSyntax + e;
        }else if(this.result == 0 && !this.historicSyntax && !this.currentSyntax){
          this.result = 0;
          this.currentSyntax = "";
          this.historicSyntax = "";
        }else if(this.result != 0 && !this.historicSyntax && !this.currentSyntax){
          this.historicSyntax = `${this.result} ${e}`;
        }else{
          this.historicSyntax = `${this.historicSyntax} ${this.currentSyntax} ${e}`;
          this.result = this.currentSyntax;
          this.currentSyntax = "";
        }
      }else if(matchOperators[0] == '.'){
        if(!this.historicSyntax && !this.currentSyntax){
          this.currentSyntax = "";
          this.historicSyntax = "";
        }else if(!this.currentSyntax && this.historicSyntax){
          this.currentSyntax = "";
        }else{
          this.currentSyntax = this.currentSyntax + e;
        }
      }else{
        if(this.historicSyntax){
          let previosSimbol = this.historicSyntax.slice(this.historicSyntax.length - 1, this.historicSyntax.length);
          this.processCalculation(this.currentSyntax, previosSimbol);
          this.currentSyntax = "";
          this.historicSyntax = "";
        }else if(!this.historicSyntax && !this.currentSyntax){
          this.currentSyntax = "";
          this.historicSyntax = "";
        }else{
          this.result = parseFloat(this.currentSyntax).toFixed(2);
          this.currentSyntax = "";
        }
      }
    },

    processCalculation(e, previosSimbol){
      switch (previosSimbol) {
        case '+':
            this.result = parseFloat(this.result) + parseFloat(e);
            this.result = this.result.toFixed(2)
          break;

        case '-':
            this.result = parseFloat(this.result) - parseFloat(e);
            this.result = this.result.toFixed(2)
          break;

        case '/':
            this.result = parseFloat(this.result) / parseFloat(e);
            this.result = this.result.toFixed(2)
          break;

        default:
            this.result = parseFloat(this.result) * parseFloat(e);
            this.result = this.result.toFixed(2)
          break;
      }
    },

    clear() {
      this.currentSyntax = "";
      this.historicSyntax = "";
      this.result = 0;
    },

    currentSyntaxClear() {
      this.currentSyntax = "";
    },

    partialClear(){
      this.currentSyntax = this.currentSyntax.slice(0, this.currentSyntax.length - 1);
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

