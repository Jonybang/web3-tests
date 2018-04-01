<template>
  <div id="app">
    <notifications :duration="7000" position="top right"></notifications>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script src="./App.js"></script>

<style lang="scss">
  #app {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    #game {
      flex-grow: 1;
    }
  }
</style>
