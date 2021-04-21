<template>
  <div class="card-list">
    <!-- 楼层标题 -->
    <header class="storey-title">
      <div class="s-t-left">
        <i class="iconfont icon-icon_bilibili-circle"></i>
        <div>{{ getName() }}</div>
      </div>
      <div class="s-t-right">
        <div class="btn-change">
          <i class="iconfont icon-icon_bilibili"></i>
          换一换
        </div>
        <div class="more">
          <a href="#">
            更多
            <i class="iconfont icon-arrow-right"></i>
          </a>
        </div>
      </div>
    </header>
    <!-- 楼层内容 -->
    <div class="storey-content">
      <div class="s-c-item" v-for="(item, i) in animationItem" :key="i">
        <!-- 图片 -->
        <div class="item-pic">
          <img :src="item.pic" alt="" />
          <div class="count">
            <i class="iconfont icon-bofangliang1"></i>
            <!-- {{ item.stat.view }} -->
            {{ tenThousand(item.stat.view) }}
            <i class="iconfont icon-jinbi"></i>
            {{ tenThousand(item.stat.coin) }}
          </div>
        </div>
        <!-- 标题 -->
        <div class="item-title">
          <a href="#">{{ item.title }}</a>
        </div>
        <!-- up主 -->
        <div class="item-up">
          <a href="#">
            <i class="iconfont icon-icon_bilibili-circle"></i>
            {{ item.owner.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardList",
  props: {
    animationItem: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  mouthed() {
    this.getName();
  },
  computed: {
    // 计算数量过万就转换
    tenThousand() {
      // 计算属性是一个属性不是一个方法, 使用函数返回
      return function (count) {
        if (count >= 100000000) {
          return (count / 100000000).toFixed(1) + "亿";
        }
        return count >= 10000 ? (count / 10000).toFixed(1) + "万" : count;
      };
    },
  },
  methods: {
    // 获取标题名字
    getName() {
      // 如果 this.animationItem 里面有 tname 这个属性就 return ture取反(false)
      // every() 如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
      if (this.animationItem.every((item) => !("tname" in item))) {
        return;
      }
      return this.animationItem[0].tname;
    },
  },
};
</script>

<style scoped>
.card-list {
  width: 100%;
}
/* 楼层标题区域 */
.storey-title {
  padding: 10px;
  display: flex;
  justify-content: space-between;
}
.s-t-left {
  display: flex;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
}
.s-t-left i {
  font-size: 28px;
  color: #7b78eb;
  margin-right: 8px;
}
.s-t-right {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  width: 15%;
  font-size: 12px;
}
.s-t-right .btn-change {
  flex: 1;
  margin-right: 5px;
  padding: 2px 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  cursor: pointer;
}
.s-t-right .more {
  padding: 2px 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* 楼层内容区域 */
.storey-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.s-c-item {
  width: 19%;
  margin-bottom: 10px;
}
.item-pic {
  position: relative;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}
.item-pic img {
  width: 100%;
}
.item-pic .count {
  position: absolute;
  left: 0;
  bottom: 2px;
  font-size: 12px;
  padding: 3px 5px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%;
}
.item-title {
  margin-top: 5px;
  margin-bottom: 10px;
  font-size: 14px;
  /* 两行显示 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: #4d4d4d;
}
.item-up {
  padding-left: 5px;
}
.item-up a {
  font-size: 12px;
  color: #999;
}
</style>