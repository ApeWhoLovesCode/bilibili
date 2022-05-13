<template>
  <div class="com-game-navbar">
    <div class="left">
      <span class="icon-wrap">
        <span class="iconfont icon-jinbi1"></span>
      </span>
      <span class="money">{{money}}</span>
      <span v-if="addMoney.num" class="add-money">{{addMoney.num}}</span>
    </div>
    <div class="center">
      <span class="level fff-color">{{level + 1}}</span> 
      <span class="fff-color" style="margin:0 4px;">/</span>
      <span class="level2 fff-color">∞</span> 
      波僵尸
    </div>
    <div class="right">
      <el-tooltip effect="dark" content="开始 / 暂停游戏" placement="bottom">
        <span class="icon-wrap icon-hover" @click="$emit('gamePause')">
          <span class="iconfont" :class="isPause ? 'icon-kaishi1' : 'icon-24gf-pause2'"></span>
        </span>
      </el-tooltip>
      <el-tooltip effect="dark" content="播放 / 关闭音乐" placement="bottom">
        <span class="icon-wrap icon-hover" @click="$emit('playBgAudio')">
          <span class="iconfont" :class="isPlayBgAudio ? 'icon-mn_shengyin_fill' : 'icon-mn_shengyinwu_fill'"></span>
        </span>
      </el-tooltip>
      <el-tooltip effect="dark" content="其他工具（待开发）" placement="bottom">
        <span class="icon-wrap icon-hover">
          <span class="iconfont icon-xuanxiangka_fuzhi"></span>
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'game-navbar',
  props: {
    money: {
      type: Number,
      default: 0,
    },
    addMoney: {
      type: Object,
      default: () => {}
    },
    level: {
      type: Number,
      default: 0
    },
    isPause: {
      type: Boolean,
      default: true
    },
    isPlayBgAudio: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
@fontColor: #5bb3e5;
.com-game-navbar {
  position: absolute;
  top: 0;
  left: 30px;
  right: 30px;
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #d2f5fa;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 0 20px;
  box-shadow: -7px 4px 14px #1781c2;
  user-select: none;
  .left {
    position: relative;
    .icon-wrap {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: linear-gradient(to left top, #fffc00, #fefdee);
      border-radius: 50px;
      border: 1px solid #d8b356;
      .iconfont {
        font-size: 16px;
        color: #c87a1a;
      }
    }
    .money {
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: @fontColor;
    }
    .add-money {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 13px;
      color: @fontColor;
      font-weight: bold;
      margin-left: 6px;
      opacity: 0;
      animation: add-money 0.6s ease;
    }
    @keyframes add-money {
      0% {
        right: -30px;
        opacity: 0;
      }
      50% {
        right: -35px;
        opacity: 1;
      }
      100% {
        right: -40px;
        opacity: 0;
      }
    }
  }
  .center {
    box-sizing: border-box;
    display: inline-block;
    width: 200px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: @fontColor;
    background: #1781c2;
    border-radius: 40px;
    border: 4px solid @fontColor;
    box-shadow: -7px 4px 14px #1781c2,
      inset 3px 4px 6px #082a74;
    .fff-color {
      color: #fff;
    }
    .level {
      font-size: 16px;
    }
    .level2 {
      font-size: 24px;
      line-height: 24px;
      margin-right: 8px;
    }
  } 
  .right {
    .icon-wrap {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50px;
      background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
      margin-right: 20px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        opacity: .85;
        box-shadow: 2px 2px 5px 1px #439ce9;
      }
      .iconfont {
        font-size: 16px;
        color: #fff;
      }
    }
  }
}
</style>