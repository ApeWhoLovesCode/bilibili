<template>
  <div id="app">
    <!-- 加了keep-alive 就不会销毁 会被缓存下来 -->
    <!-- <keep-alive> -->
    <!-- 路由占位符 -->
    <router-view></router-view>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
};
</script>

<style>
</style>
