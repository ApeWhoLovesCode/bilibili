<template>
  <div class="navbar_main">
    <!-- 导航栏左边部分 -->
    <div class="nav_left">
      <ul>
        <li class="nav_left_item">
          <a href="#/home">
            <i class="iconfont icon-bilibili home_logo"></i>
          </a>
        </li>
        <li class="nav_left_item">番剧</li>
        <li class="nav_left_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="游戏中心里面有好多东西"
          >
            <a slot="reference">游戏中心</a>
          </el-popover>
        </li>
        <li class="nav_left_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="直播直播直播直播"
          >
            <a slot="reference">直播</a>
          </el-popover>
        </li>
        <li class="nav_left_item">会员购</li>
        <li class="nav_left_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="漫画漫画漫画漫画"
          >
            <a slot="reference">漫画</a>
          </el-popover>
        </li>
        <li class="nav_left_item">赛事</li>
        <li class="nav_left_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="APP APP APP"
          >
            <a slot="reference">
              <i class="iconfont icon-bilibili-fill app_logo"></i>
              下载App
            </a>
          </el-popover>
        </li>
      </ul>
    </div>

    <!-- 导航栏中间区域 -->
    <div class="nav_center">
      <div class="nav_center_search" v-show="searchVisible" ref="NavSearch">
        <el-input
          class="search_inp"
          placeholder="请输入内容"
          v-model="searchInput"
          clearable
        >
        </el-input>
        <el-button class="search_btn" type="info" plain>
          <i class="iconfont icon-sousuo search_logo"></i>
        </el-button>
      </div>
    </div>

    <!-- 导航栏右边区域 -->
    <div class="nav_right">
      <ul>
        <!-- 头像 -->
        <li class="nav_right_item">
          <el-avatar
            size="medium"
            src="https://i0.hdslb.com/bfs/face/9e684120bdf30f9c7130de8b3f3b004e589f46ef.jpg@96w_96h_1c.webp"
          ></el-avatar>
        </li>
        <li class="nav_right_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="RNG VS FPX"
          >
            <a slot="reference">大会员</a>
          </el-popover>
        </li>
        <li class="nav_right_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="RNG VS FPX"
          >
            <a slot="reference">消息</a>
          </el-popover>
        </li>
        <li class="nav_right_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="RNG VS FPX"
          >
            <a slot="reference">动态</a>
          </el-popover>
        </li>
        <li class="nav_right_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="RNG VS FPX"
          >
            <a slot="reference">收藏</a>
          </el-popover>
        </li>
        <li class="nav_right_item">
          <el-popover
            placement="bottom-start"
            title="标题"
            width="200"
            trigger="hover"
            content="RNG VS FPX"
          >
            <a slot="reference">历史</a>
          </el-popover>
        </li>
        <li class="nav_right_item">创作中心</li>
        <li class="nav_right_item">
          <el-button type="danger">投稿</el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索区域的显示与隐藏
      searchVisible: true,
      searchInput: "",
      // 屏幕的宽度
      screenWidth: document.body.clientWidth,
    };
  },
  created() {
    // 开始创建dom时先判断一下 搜索区域是否显示
    if (this.screenWidth <= 1200) {
      this.searchVisible = false;
    }
  },
  mounted() {
    const that = this;
    // 在页面mounted时，挂载window.onresize方法
    // 监听窗口变化
    window.onresize = () => {
      return (() => {
        that.screenWidth = document.body.clientWidth;
      })();
    };
  },
  watch: {
    screenWidth(val) {
      // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
      if (!this.timer) {
        this.screenWidth = val;
        this.timer = true;
        const that = this;
        setTimeout(function () {
          if (that.screenWidth <= 1200) {
            that.searchVisible = false;
          } else {
            that.searchVisible = true;
          }
          that.timer = false;
        }, 400);
      }
    },
  },
  methods: {},
};
</script>

<style scoped>
* {
  color: #fff;
}
.navbar_main {
  display: flex;
  height: 56px;
  /* justify-content: space-between; */
  align-items: center;
}
/* nav左边部分 */
.nav_left {
  width: 434px;
  height: 100%;
}

.nav_left ul {
  display: flex;
  padding: 0;
  margin-top: 16px;
  justify-content: space-around;
}

.nav_left_item {
  cursor: pointer;
  font-size: 14px;
  color: #fff;
}

.home_logo {
  color: #fff;
}
.app_logo {
  font-size: 16px;
}

/* nav中间部分 */
.nav_center {
  flex: 1;
  margin: 0 50px;
}
.nav_center_search {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 2vw;
}
.search_inp {
  flex: 1;
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.search_btn {
  width: 48px;
  height: 40px;
  margin: 0;
  padding: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.search_logo {
  font-size: 24px;
  font-weight: 600;
  color: #2999d9;
}

/* nav右边部分 */
.nav_right {
  height: 100%;
  width: 454px;
}

.nav_right ul {
  display: flex;
  margin: 0;
  margin-top: 8px;
  padding: 0;
  justify-content: space-around;
  align-items: center;
}

.nav_right_item {
  cursor: pointer;
  font-size: 14px;
  color: #fff;
}
</style>