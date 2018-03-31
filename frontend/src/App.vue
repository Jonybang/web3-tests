<template>
  <div id="app">
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
