<template>
    <v-container>
      <div class="loader"></div>
    </v-container>
</template>
<script>
export default {
    name: 'Spinner'
}
</script>
<style>
.loader {
  animation:spin 1s infinite linear;
  border:solid 1vmin transparent;
  border-radius:50%;
  border-right-color:rgb(2, 3, 61);
  border-top-color:rgb(2, 3, 61);
  box-sizing:border-box;
  height:10vmin;
  left:calc(50%);
  position:absolute;
  top:auto;
  width:10vmin;
  z-index:1;
}
.loader::before{
  animation:spin 2s infinite linear;
    border:solid 1vmin transparent;
    border-radius:50%;
    border-right-color:rgb(12, 13, 117);
    border-top-color:rgb(12, 13, 117);
    box-sizing:border-box;
    content:"";
    height:6vmin;
    left:1vmin;
    position:absolute;
    top:1vmin;
    width:6vmin;
}
.loader::after{
  animation:spin 3s infinite linear;
    border:solid 1vmin transparent;
    border-radius:50%;
    border-right-color:#364ab8;
    border-top-color:#364ab8;
    box-sizing:border-box;
    content:"";
    height:2vmin;
    left:3vmin;
    position:absolute;
    top:3vmin;
    width:2vmin;
}

@keyframes spin {
  100% {
    transform:rotate(360deg);
  }
}
</style>
