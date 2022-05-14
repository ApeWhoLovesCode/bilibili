<template>
  <div id='protect-horse-index'>
    <div class="back" @click="$router.push('/')">回到首页</div>
    <ProtectTheHorse v-if="isProtectTheHorse" :mapLevel="mapLevel" />
    <LevelSelect :mapLevel="mapLevel" @switchMapLevel="switchMapLevel" />
  </div>
</template>

<script>
import ProtectTheHorse from './protectTheHorse'
import LevelSelect from './components/levelSelect'
export default {
  name: 'protect-horse-index',
  components: {
    ProtectTheHorse,
    LevelSelect,
  },
  props: {},
  data() {
    return {
      // 当前选择的关卡
      mapLevel: 1,
      isProtectTheHorse: false,
    };
  },
  created() {
    this.mapLevel = +this.$route.params.id
    this.isProtectTheHorse = true
  },
  methods: {
    /** 切换地图 */
    switchMapLevel(index) {
      this.mapLevel = index
      this.$router.push(`/protectTheHorse/${index}`)
      this.isProtectTheHorse = false
      this.$nextTick(() => {this.isProtectTheHorse = true})
      // 地图数据更新
      // 格子信息清空
      // 在场敌人和塔防清空
      // 金钱和关卡清空
    },
  }
}
</script>
<style lang='less'>
@size: 50px; 
@fontColor: #5bb3e5;
#protect-horse-index {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .back {
    position: fixed;
    top: 20px;
    left: 20px;
    color: #fff;
    background: rgba(255, 255, 255, .3);
    padding: 4px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    user-select: none;
    &:hover {
      opacity: .8;
    }
  }
  
}
</style>