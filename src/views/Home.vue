<template>
    <v-container class="home-content">
        <v-row>
            <v-col cols="6" class="d-felx justify-center" style="margin-top: 5%">
                <div class="img-div">
                    <img src="/../images/home/logo_prysoft.png" />
                </div>
                <div class="img-div">
                    <img src="/../images/home/prysoft-gestion.png" >
                </div>
                <div class="img-div">
                    <a href="https://www.facebook.com/prysoftarg" target="_blank"><img src="/../images/home/face.png"></a>
                    <a href="https://www.instagram.com/prysoft" target="_blank"><img src="/../images/home/insta.png"></a>
                </div>
                <div class="img-div">
                    <a href="https://api.whatsapp.com/send?phone=5493482273235" target="_blank">
                        <img src="/../images/home/whatsapp.png" />
                    </a>
                </div>
                <div class="web-content">
                    <div class="web-div1">
                        <img src="/../images/home/linea_01.png" >
                    </div>
                    <div class="web-div2">
                        <img src="/../images/home/web.png" >
                    </div>
                </div>
            </v-col>
            <v-col cols="6" class="d-felx justify-center">
                <div class="img-div">
                    <img src="/../images/home/bienvenidos.png" class="fluid-img" style="width: 70%; margin-top: 10%">
                </div>
                <div class="img-div">
                    <img src="/../images/home/conjunto_01.png" class="fluid-img">
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<style>
.home-content{
    background-image: url("/../images/home/fondo_2.png");
    background-size: cover;
}
.img-div{
    justify-content: center;
    text-align: center;
}
.web-content{
    position: relative;
}
.web-div1{
    position: absolute;
}
.web-div2{
    margin-left: 50px;
}
.fluid-img{
    margin: auto;
    width: 100%;
}
</style>