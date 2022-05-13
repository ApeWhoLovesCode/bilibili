<template>
  <div class="com-skill">
    <!-- 游戏底部技能区 -->
    <div class="skill-wrap">
      <span v-for="(item, index) in skillList" :key="index">
        <el-tooltip effect="dark" placement="top">
          <div slot="content" style="text-align: center">
            <div>{{item.name}}</div>
            <div>金额：{{item.money}}</div>
          </div>
          <span class="skill-item">
            <span class="skill iconfont" :class="item.icon" @click="$emit('handleSkill', index)"></span>
            <!-- <span class="skill-disable iconfont icon-disablecase"></span> -->
            <span v-show="item.curTime" class="skill-disable skill-time">{{item.curTime / 1000}}</span>
          </span>
        </el-tooltip>
      </span>
    </div>
    <!-- 技能: 肉弹冲击 -->
    <div v-if="skillList[0].isShow" class="skill-boom"></div>
    <!-- 技能: 肉弹冲击 -->
    <img v-if="skillList[1].isShow" class="skill-rush" src="../assets/img/meat-rush.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'skill',
  props: {
    skillList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang='less' scoped>
.com-skill {
  .skill-wrap {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    height: 48px;
    background: #d2f5fa;
    box-shadow: 3px -2px 14px 2px #0e80c7;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 0 20px;
    user-select: none;
    .skill-item {
      position: relative;
      margin-right: 15px;
      border-radius: 8px;
      display: inline-block;
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
      &:hover {
        background: rgba(216, 216, 216, 0.4);
      }
      .skill {
        font-size: 32px;
        color: #5bb3e5;
        &:hover {
          color: #157ab5;
        }
      }
      .skill-disable {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        font-size: 32px;
        color: rgba(85, 174, 247, 0.5);
        background: rgba(216, 216, 216, 0.3);
        border-radius: 50%;
      }
      .skill-time {
        color: #888;
        font-weight: bold;
      }
    }
  }
  .skill-boom {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    background: url(../assets/img/boom.png) no-repeat;
    background-size: 4000px 100%;
    background-position: 0 0;
    animation: skill-boom 1.5s steps(10) forwards;
  }
  @keyframes skill-boom {
    0% {
      background-position: 0 0;
    }
    90% {
      background-position: -4000px 0;
    }
    100% {
      background-position: -4000px 0;
      display: none;
    }
  }
  .skill-rush {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    animation: skill-rush 2s linear forwards;
  }
  @keyframes skill-rush {
    0% {
      left: 0;
    }
    25% {
      left: 50%;
    }
    75% {
      left: 55%;
    }
    100% {
      left: 150%;
    }
  }
}
</style>