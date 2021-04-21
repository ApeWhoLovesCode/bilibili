<template>
  <div class="toplist">
    <header class="t-header">
      <span class="t-h-name">排行榜</span>
      <span class="more">
        <a href="#">
          更多
          <i class="iconfont icon-arrow-right"></i>
        </a>
      </span>
    </header>
    <div v-for="(item, index) in animation" :key="index" class="toplist-item">
      <i class="t-i-number">{{ index + 1 }}</i>
      <a href="#">
        <div class="t-i-tilte">
          <span>{{ item.title }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopList",
  props: {
    animation: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.toplist {
  width: 100%;
  padding: 0 10px 0 20px;
}
.t-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.t-h-name {
  font-size: 18px;
}
.more {
  padding: 2px 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.toplist-item {
  justify-content: space-around;
  width: 100%;
  padding: 8px;
}

.t-i-number {
  display: inline-block;
  width: 10%;
  height: 20px;
  margin-right: 5%;
  font-size: 14px;
  color: #999;
  text-align: center;
}

.t-i-tilte {
  display: inline-block;
  width: 85%;
  font-size: 14px;
  /* 垂直对齐  父级要变*/
  vertical-align: middle;
}
.t-i-tilte span {
  /* 两行显示 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  color: #4d4d4d;
}
</style>