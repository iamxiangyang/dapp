<template>
 <div class="wrap">
  <div class='verticalDiv'></div>
 </div>
</template>
<script type="text/javascript">
export default {
}
</script>

<style type="text/css" scoped>
.wrap {
width: 32px;
height: 46px;
border-radius: 16px;
border: 3px solid white;
}
.verticalDiv {
width: 4px;
height: 8px;
border-radius: 2px;
background-color: white;
position: absolute;
margin-left: 11px;
margin-top: 40px;
animation: verticalMove 1s infinite;
}

@keyframes verticalMove{
 0% {margin-top: 8px;opacity: 0}
 100% {margin-top: 22px;opacity: 1}
}

</style>
