<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { stayLogin } from '@/api/config'
import { mapActions } from 'vuex'

let timer = 0
export default {
  name: 'App',
  methods: {
    ...mapActions([
      'getUserMenuList'
    ])
  },
  mounted () {
    timer = setInterval(stayLogin, 1000 * 60)
  },
  beforeDestroy () {
    clearInterval(timer)
  }
}
</script>

<style lang="less">
  .size {
    width: 100%;
    height: 100%;
  }

  html, body {
    .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    .size;
  }
</style>
