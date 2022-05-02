<template>
  <div id="protect-horse">
    <div class="back" @click="$router.push('/')">回到首页</div>
    <div id="audio-wrap">
      <audio ref="audioBgRef" :src="audioList['pvz-morning']" loop></audio>
      <audio ref="audioLevelRef" :src="audioList['pvz-comein']"></audio>
      <audio ref="audioSkillRef" :src="audioList[audioSkill]"></audio>
      <audio ref="audioEndRef" :src="audioList[audioEnd]"></audio>
    </div>
    <div class="game-wrap">
      <div class="title">{{title}}</div>
      <div class="canvas-wrap" @click="hiddenTowerOperation">
        <!-- 游戏顶部信息展示区域 -->
        <div class="top-wrap">
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
              <span class="icon-wrap icon-hover" @click="gamePause()">
                <span class="iconfont" :class="isPause ? 'icon-kaishi1' : 'icon-24gf-pause2'"></span>
              </span>
            </el-tooltip>
            <el-tooltip effect="dark" content="播放 / 关闭音乐" placement="bottom">
              <span class="icon-wrap icon-hover" @click="playBgAudio()">
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
        <!-- 游戏底部技能区 -->
        <div class="skill-wrap">
          <span v-for="(item, index) in skillList" :key="index">
            <el-tooltip effect="dark" :content="item.name" placement="top">
              <span class="skill-item">
                <span class="skill iconfont" :class="item.icon" @click="handleSkill(item, index)"></span>
                <!-- <span class="skill-disable iconfont icon-disablecase"></span> -->
                <span v-show="item.curTime" class="skill-disable skill-time">{{item.curTime / 1000}}</span>
              </span>
            </el-tooltip>
          </span>
        </div>
        <!-- 游戏区域 -->
        <canvas ref="canvasRef" id="mycanvas" width="1050" height="600" @click="getMouse($event)"></canvas>
        <!-- 塔防的容器 -->
        <!-- 上面和左边内边距是 50px -->
        <div v-show="building.isShow" class="building-wrap" :style="buildingStyle">
          <img src="./assets/img/add.png" alt="" class="add-icon">
          <div class="tower-wrap" :class="buildingClass">
            <div class="tower" :class="money < item.money ? 'tower-no-money' : ''" v-for="(item, index) in towerList" :key="index" @click="buildTower(index)">
              <img :src="item.img" alt="" class="tower-icon">
              <div class="info">￥{{item.money}}</div>
            </div>
          </div>
        </div>
        <!-- 塔防的攻击范围 -->
        <div v-show="buildingScope.isShow" class="building-scope" :style="buildingScopeStyle">
          <span class="sale-wrap" @click="saleTower(buildingScope.towerIndex)">
            <span class="iconfont icon-ashbin"></span>
            <span class="sale-num">{{tower[buildingScope.towerIndex] && tower[buildingScope.towerIndex].saleMoney}}</span>
          </span>
        </div>
        <!-- 终点 -->
        <div class="terminal">
          <div class="hp">{{hp}}</div>
          <img class="terminal-icon" src="./assets/img/horse1.png" alt="">
          <img v-show="proMoney.isShow" class="money-icon" src="./assets/img/Sun.gif" alt="" @click="proMoneyClick">
        </div>
        <!-- 游戏结束遮罩层 -->
        <div v-if="isGameOver" class="gameover-wrap mask">
          <div class="info">你为了保护大司马抵御了{{level}}波僵尸</div>
        </div>
        <!-- 游戏开始遮罩层 -->
        <div v-if="isGameBeginMask" class="game-begin mask">
          <div class="info">
            <Loading v-if="!loadingDone" />
            <div v-else class="begin-wrap">
              <span class="icon-wrap" @click="beginGame">
                <span class="iconfont" :class="isPause ? 'icon-kaishi1' : 'icon-24gf-pause2'"></span>
              </span>
              <span class="begin-text">开始游戏</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 必要优化-待完成
 * 1.子弹提前预判敌人位置
 */
import Loading from './components/loading.vue'
import SuperGif from './utils/libgif'
import { limitRange } from './utils/tools'
import levelEnemyArr from './dataSource/levelEnemyArr'
import towerData from './dataSource/towerData'
import enemyData from './dataSource/enemyData'
import audioData from './dataSource/audioData'
import skillData from './dataSource/skillData'

export default {
  name: 'protect-horse',
  components: {
    Loading,
  },
  data() {
    return {
      title: '保卫大司马',
      // 浏览器大小变化
      resizeTimer: null,
      // canvas 对象
      canvas: {},
      // canvas 画布距离浏览器左边和顶部的距离
      canvasInfo: {left: 0, top: 0},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      // 是否加载完成
      loadingDone: false,
      isGameBeginMask: true,
      // 游戏结束
      isGameOver: false,
      // 设置游戏的暂停
      isPause: true,
      // 等级
      level: 0,
      // 生命值
      hp: 10,
      // 金钱
      money: 5000,
      // 增加的金钱
      addMoney: {num: '', timer: null, time: 1000},
      // 生产的金钱
      proMoney: {isShow: false, timer: null, interval: 10000, money: 25},
      // 敌人生成间隔时间
      intervalTime: 800, 
      // 存放上一次和本次生成的敌人时间戳，用于暂停判断还有多久产生敌人
      timeDiff: {curTime: 0, stopTime: 0},
      // 生成敌人的定时器
      makeEnemyTimer: null,
      // 暂停后的生成敌人的定时器
      pauseMakeEnemyTimer: null,
      // 当前等级需要的敌人索引
      levelEnemy: [],
      // 已上场的敌人数量
      createdEnemyNum: 0,
      // 场上的敌人数组  
      enemy: [],
      // 偏移量y 是用来计算敌人与地板底部的距离 (两个地板(50*2)-敌人(h(75)+y(10))) = 10
      offset: {y: 10},
      // 敌人资源
      enemySource: enemyData,
      // 最小刻度
      minScale: 2,
      // 所有静态图片资源
      imgObj: {
        floorTile: require("./assets/img/floor-tile.png")
      },
      // 加载完成的静态图片
      imgOnloadObj: null,
      // 格子数量信息 arr: [[ 0:初始值(可以放塔)，1:地板，2:有阻挡物，10(有塔防：10塔防一，11塔防二...) ]]
      gridInfo: { x_num: 21, y_num: 12, size: 50, arr: [[]] },
      // 地板：大小 数量
      floorTile: {size: 50, num: 83},
      // 移动轨迹 [{x坐标, y坐标, x_y(方向): 1:左 2:下 3:右 4:上}]
      movePath: [],
      // 塔防
      building: { left: 0, top: 0, isShow: false },
      // 塔防攻击范围
      buildingScope: {left: 0, top: 0, r: 0, isShow: false, towerIndex: 0},
      // 塔防数据 
      towerList: towerData,
      // 塔防加载完成图片
      towerOnloadImg: null,
      // 塔防子弹加载完成图片
      towerBulletOnloadImg: null,
      // 场上的防御塔数组 {x, y, shootFn(防抖的射击函数), targetIndexList(攻击的目标):[], bulletArr(子弹数组)[x,y(子弹当前位置),addX,addY(往目标方向增加的值),xy(当前距离),x_y(目标距离),e_i(目标索引)], ...this.towerList[i], onload-img, onload-bulletImg
      tower: [],
      // 是否播放背景音乐
      isPlayBgAudio: false,
      // 所有音乐数据
      audioList: audioData,
      // 终点音乐
      audioEnd: '',
      // 当前技能音乐
      audioSkill: '',
      // 底部技能栏
      skillList: skillData,
    }
  },
  computed: {
    /** 塔防容器的样式 */
    buildingStyle() {
      const {left, top} = this.building
      const size = this.gridInfo.size
      return {left: left + size + 'px', top: top + size + 'px'}
    },
    /** 塔防容器的类目 */
    buildingClass() {
      const {left, top} = this.building
      const {x_num, y_num, size} = this.gridInfo
      const _x_num = Math.round(left / size), _y_num = Math.round(top / size)
      let className = ''
      if(_y_num >= y_num - 3) {
        className += 'tower-wrap-bottom '
      }
      // 点击在左右两边的情况
      if(_x_num <= 1 || _x_num >= x_num - 2) {
        className += 'tower-wrap-row '
        if(_y_num >= 2) className += 'tower-wrap-row-top '
        if(_x_num <= 1) className += 'tower-wrap-left'
        else className += 'tower-wrap-right'
      }
      return className
    },
    /** 攻击范围的样式 */ 
    buildingScopeStyle() {
      const padding = 50
      const size = this.gridInfo.size / 2
      const {left, top, r} = this.buildingScope
      return {left: left + padding + size + 'px', top: top + padding + size + 'px', width: r * 2 + 'px', height: r * 2 + 'px'}
    },
  },
  watch: {
    // 监听增加的钱
    money(newVal, oldVal) {
      this.addMoney.num = ''
      clearTimeout(this.addMoney.timer)
      this.addMoney.timer = null
      this.$nextTick(() => {
        const val = newVal - oldVal
        this.addMoney.num = (val >= 0 ? '+' : '') + val
        this.addMoney.timer = setTimeout(() => {
          this.addMoney.num = ''
        }, this.addMoney.time);
      })
    },
    // 游戏结束判断
    hp(val) {
      if(!val) {
        this.isGameOver = true
        this.isPause = true
      }
    },
    // 暂停的判断
    isPause: {
      // immediate: true,
      handler(val) {
        if (val) {
          // 暂停还是有时间差的 bug
          clearTimeout(this.pauseMakeEnemyTimer)
          clearInterval(this.makeEnemyTimer)
          clearInterval(this.proMoney.timer)
          this.timeDiff.stopTime = Date.now()
          this.removeEnemySkillTimer()
        } else {
          this.makeEnemy()
          this.startAnimation();
          this.startMoneyTimer()
          this.startEnemySkill()
        }
      }
    },
    // 监听等级变化生成对应敌人
    level: {
      immediate: true,
      handler(val) {
        setTimeout(() => {
          this.createdEnemyNum = 0
          if(val < levelEnemyArr.length) {
            if(val && (val / 10) % 1 === 0) {
              clearInterval(this.proMoney.timer)
              this.startMoneyTimer()
              this.playAudio('ma-pvz', 'End')
            }
            this.levelEnemy = levelEnemyArr[val]
          } else {
            const list = [0]
            for(let i = 0; i < val; i++) {
              list.push(11)
            }
            this.levelEnemy = list
          }
          if(val) {
            this.money += this.proMoney.money * (this.level + 1)
            this.makeEnemy()
            this.$refs.audioLevelRef.play()
          }
        }, val ? 500 : 0);
      },
    },
    enemy: {
      deep: true,
      handler(enemyList) {
        // 敌人已经清空
        if(!enemyList.length && this.hp) {
          this.timeDiff.curTime = 0
          this.timeDiff.stopTime = 0
          this.level++
        }
        const tower = this.tower
        for(let t_i in tower) {
          const eIndexlist = this.enterAttackScopeList(enemyList, tower[t_i])
          // 进入攻击范围，开始射击 
          if(eIndexlist.length) {
            tower[t_i].shootFun(eIndexlist.splice(0, tower[t_i].targetNum), t_i)
          }
        }
      }
    },
  },
  mounted() {
    this.init();
    this.getCanvasMargin()
    // 监听浏览器窗口大小变化
    window.addEventListener("resize", this.getCanvasMargin);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getCanvasMargin)
  },
  methods: {
    async init() {
      this.canvas = this.$refs.canvasRef;
      this.ctx = this.canvas.getContext("2d");
      this.initAllGrid()
      this.initMovePath()
      this.onKeyDown()
      await this.allGifToStaticImg()
      // 加载图片
      this.imgOnloadObj = await this.loadImage(this.imgObj);
      this.towerOnloadImg = await this.loadImage(this.towerList, 'img');
      this.towerBulletOnloadImg = await this.loadImage(this.towerList, 'bulletImg');
      // this.makeEnemy(true)
      this.startAnimation()
    },
    /** 点击获取鼠标位置 操作塔防 */
    getMouse(e) {
      e.stopPropagation()
      const size = this.gridInfo.size
      const _x = e.x - this.canvasInfo.left, _y = e.y - this.canvasInfo.top
      // 当前点击的格子的索引值
      const col = Math.floor(_y / size), row = Math.floor(_x / size)
      const gridVal = this.gridInfo.arr[col][row]
      const left = row * size, top = col * size
      // 已经有地板或者有建筑了
      if(gridVal >= 10) {
        this.handlerTower(left, top)
      }
      if(gridVal) {
        return
      }
      this.building.isShow = true
      this.building.left = left
      this.building.top = top
    },
    /** 点击建造塔防 */
    buildTower(index) {
      const { rate, money, name, audioKey } = this.towerList[index]
      if(this.money < money) return
      this.money -= money
      const {left: x, top: y} = this.building
      const size = this.gridInfo.size
      // 将该塔防数据放入场上塔防数组中
      // 射击的防抖函数
      const shootFun = this.$lodash.throttle((eIndexlist, t_i) => {
        this.shootBullet(eIndexlist, t_i)
      }, rate, { leading: true, trailing: false })
      // 处理多个相同塔防的id值
      const id = this.tower.reduce((pre, cur) => cur.name === name ? ++pre : pre, 0)
      const tower = {x, y, id: audioKey + id, shootFun, targetIndexList: [], bulletArr: [], ...this.towerList[index], img: this.towerOnloadImg[index], bulletImg: this.towerBulletOnloadImg[index]}
      this.tower.push(tower)
      // 用于标记是哪个塔防 10 + index
      this.gridInfo.arr[y / size][x / size] = 10 + index
      this.drawTower(tower)
      this.createAudio(audioKey, id)
    },
    /** 售卖防御塔 */
    saleTower(index) {
      const size = this.gridInfo.size
      const {x, y, saleMoney, id} = this.tower[index]
      this.ctx.clearRect(x, y, size, size);
      this.gridInfo.arr[y / size][x / size] = 0
      this.money += saleMoney
      this.removeAudio(id)
      this.tower.splice(index, 1)
    },
    /** 点击背景 隐藏塔防 */
    hiddenTowerOperation() {
      if(this.building.isShow) this.building.isShow = false
      if(this.buildingScope.isShow) this.buildingScope.isShow = false
    },
    /** 处理塔防 */
    handlerTower(x, y) {
      // 当前点击的是哪个塔防
      const towerIndex = this.tower.findIndex(item => item.x === x && item.y === y)
      const {x:left, y:top, r} = this.tower[towerIndex]
      // 展示攻击范围
      this.buildingScope = {isShow: true, left, top, r, towerIndex}
      // this.drawAttackScope(tower)
    },
    /** 发射子弹  enemy:敌人索引数组，t_i:塔索引 */
    shootBullet(eIndexlist, t_i) {
      // 添加攻击目标的索引
      this.tower[t_i].targetIndexList = eIndexlist
      for(const e_i of eIndexlist) {
        if(!this.enemy[e_i]) break
        const {x, y, w, h} = this.enemy[e_i]
        // 敌人中心坐标
        const _x = x + w / 2, _y = y + h / 2
        const {x: t_x, y: t_y, speed } = this.tower[t_i]
        const size_2 = this.gridInfo.size / 2
        // 子弹初始坐标
        const begin = {x: t_x + size_2, y: t_y + size_2}
        // 两坐标间的差值
        const diff = {x: _x - begin.x, y: _y - begin.y}
        // 子弹和敌人的距离
        const distance = this.powAndSqrt(diff.x, diff.y)
        const addX = speed * diff.x / distance, addY = speed * diff.y / distance
        const bullet = {x: begin.x, y: begin.y, addX, addY, xy: 0, x_y: distance, e_i}
        this.tower[t_i].bulletArr.push(bullet)
      }
    },
    /** 开启动画绘画 */
    startAnimation() {
      const that = this;
      (function go() {
        that.startDraw();
        if (!that.isPause) {
          // 时间间隔为 1000/60 每秒 60 帧
          requestAnimationFrame(go);
        }
      })();
    },
    /** 开始绘画 */
    startDraw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawFloorTile()
      this.drawTower()
      this.drawAndMoveBullet()
      // 循环静态图片画敌人
      for(let index = 0; index < this.enemy.length; index++) {
        const item = this.enemy[index]
        const res = this.moveEnemy(index)
        // 当敌人已经到达终点，后面就不执行了
        if(res) break
        this.drawEnemy(index)
        if(item.imgIndex === item.imgList.length - 1) this.enemy[index].imgIndex = 0
        else this.enemy[index].imgIndex++
      }
    },
    /** 画地板 */
    drawFloorTile() {
      const size = this.gridInfo.size
      for(let f of this.movePath) {
        this.ctx.drawImage(this.imgOnloadObj.floorTile, f.x, f.y, size, size)
      }
    },
    /** 画塔防 */
    drawTower(item) {
      const size = this.gridInfo.size
      if(item) {
        this.ctx.drawImage(item.img, item.x, item.y, size, size)
      } else {
        for(const t of this.tower) {
          this.ctx.drawImage(t.img, t.x, t.y, size, size)
        }
      }
    },
    /** 画并处理子弹 */
    drawAndMoveBullet() {
      for(const t of this.tower) {
        for(const b_i in t.bulletArr) {
          const {w, h} = t.bSize
          const {x, y, addX, addY, x_y} = t.bulletArr[b_i]
          this.ctx.drawImage(t.bulletImg, x - w / 2, y - h / 2, w, h)
          t.bulletArr[b_i].x += addX
          t.bulletArr[b_i].y += addY
          t.bulletArr[b_i].xy += t.speed
          // 子弹击中敌人
          if(t.bulletArr[b_i].xy >= x_y) {
            const {e_i} = t.bulletArr[b_i]
            // 清除子弹
            t.bulletArr.splice(b_i, 1)
            // 敌人扣血
            if(this.enemy[e_i]) {
              this.enemy[e_i].hp.cur -= t.damage
              // 消灭敌人
              if(this.enemy[e_i].hp.cur <= 0) {
                this.money += this.enemy[e_i].reward
                this.removeEnemy([e_i])
                t.targetIndexList.splice(t.targetIndexList.findIndex(item => item === +e_i), 1)
                if(t.name === '茄子') {
                  // this.playAudio('qizi-wujie', 'Tower')
                  this.playDomAudio(t.id)
                }
              } else {
                // 判断减速
                if(t.slow) {
                  this.slowEnemy(e_i, t.slow)
                }
              }
            }

          }
        }
      }
    },
    /** 减速敌人 */
    slowEnemy(e_i, t_slow) {
      const { speed: e_speed } = this.enemy[e_i]
      if(this.enemy[e_i].curSpeed === e_speed) {
        this.enemy[e_i].curSpeed = e_speed / t_slow.num
      }
      if(this.enemy[e_i].durationTimer) {
        clearTimeout(this.enemy[e_i].durationTimer)
        this.enemy[e_i].durationTimer = setTimeout(() => {
          if(this.enemy[e_i]) {
            this.enemy[e_i].curSpeed = this.enemy[e_i].speed
          }
        }, t_slow.time)
      } else {
        this.$set(this.enemy[e_i], "durationTimer", 
          setTimeout(() => {
            this.enemy[e_i].curSpeed = this.enemy[e_i].speed
          }, t_slow.time)
        )
      }
    },
    /** 画敌人 */
    drawEnemy(index) {
      if(!this.enemy[index]) return
      const { x, y, w, h, imgList, imgIndex, hp, curSpeed, speed } = this.enemy[index]
      // this.ctx.translate(200, 0);
      // this.ctx.scale(-1, 1)
      this.ctx.drawImage(imgList[imgIndex], x, y, w, h) 
      // 绘画减速效果
      if(curSpeed !== speed) {
        // this.ctx.fillRect(x + w / 2, y, w / 2, h / 2)
        this.ctx.beginPath();
        this.ctx.arc(x + w / 2, y + h / 2, w / 5, 0, 2 * Math.PI, false)
        this.ctx.fillStyle = 'rgba(2, 38, 241, 0.3)'
        this.ctx.fill()
        this.ctx.strokeStyle = '#022ef1'
        this.ctx.stroke()
      }
      if(hp.cur === hp.sum) return
      // 绘画生命值
      const w_2 = w - hp.size
      this.ctx.fillStyle = '#0066a1'
      this.ctx.fillRect(x, y - hp.size, w_2, hp.size)
      this.ctx.fillStyle = '#49ca00'
      this.ctx.fillRect(x, y - hp.size,  w_2 * hp.cur / hp.sum, hp.size)
      // 画边框
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "#cff1d3"; //边框颜色
      this.ctx.rect(x, y - hp.size, w_2, hp.size);  //透明无填充
      this.ctx.stroke();
    },
    /** 敌人移动 */
    moveEnemy(index) {
      const { w, h, curSpeed, speed, curFloorI } = this.enemy[index]
      // 敌人到达终点
      if(curFloorI === this.floorTile.num - 1) {
        this.removeEnemy([index])
        this.hp -= 1
        this.playAudio('ma-nansou', 'End')
        return true
      }
      const size = this.gridInfo.size
      // 将格子坐标同步到敌人的坐标
      const { x, y, x_y } = this.movePath[curFloorI]
      // 敌人需要站在地板中间区域
      const _y = y - (size - (size * 2 - h - this.offset.y))
      const _x = x - (w - size)
      switch (x_y) {
        case 1: this.enemy[index].x -= curSpeed; break;
        case 2: this.enemy[index].y -= curSpeed; break;
        case 3: this.enemy[index].x += curSpeed; break;
        case 4: this.enemy[index].y += curSpeed; break;
      }
      const { x: eX, y: eY } = this.enemy[index]
      // if(this.enemy[index].name === '舞王小兵') {
      //   console.log(eX, eY);
      // }
      // 敌人到达下一个格子
      if((eX >= _x &&  eX <= _x + speed) && (eY >= _y &&  eY <= _y + speed)) {
        this.enemy[index].curFloorI++
      }
    },
    /** 按间隔时间生成敌人 */
    makeEnemy() {
      // 当前关卡敌人已经全部上场
      if(this.createdEnemyNum === this.levelEnemy.length) return
      // 暂停回来，间隔时间修改
      const time = this.intervalTime - (this.timeDiff.stopTime - this.timeDiff.curTime)
      this.pauseMakeEnemyTimer = setTimeout(() => {
        this.setEnemy()
        this.makeEnemyTimer = setInterval(() => {
          if(this.createdEnemyNum === this.levelEnemy.length || this.isPause) {
            clearInterval(this.makeEnemyTimer)
          } else {
            this.setEnemy()
          }
        }, this.intervalTime)
      }, time)
    },
    /** 生成敌人 */
    setEnemy() {
      this.timeDiff.curTime = Date.now()
      const enemyItem = this.$lodash.cloneDeep(this.enemySource[this.levelEnemy[this.createdEnemyNum]])
      const {audioKey, name} = enemyItem
      const id = this.enemy.reduce((pre, cur) => cur.name === name ? ++pre : pre, 0)
      enemyItem.id = audioKey + id
      this.enemy.push(enemyItem)
      this.createdEnemyNum++
      this.handleEnemySkill(enemyItem.name, enemyItem.id)
      this.createAudio(audioKey, id)
    },
    /** 暂停后重新开始技能 */
    startEnemySkill() {
      for(const e of this.enemy) {
        this.handleEnemySkill(e.name, e.id)
      }
    },
    /** 处理敌人技能 */
    handleEnemySkill(enemyName, e_id) {
      const e_i = this.enemy.findIndex(e => e.id === e_id)
      if(!this.enemy[e_i].skill) return
      // 舞王僵尸的技能
      if(enemyName === '舞王') {
        const {time, curTime, stopTime} = this.enemy[e_i].skill
        const intervalTime = time - (stopTime - curTime)
        this.enemy[e_i].skill.curTime = Date.now()
        this.enemy[e_i].skill.pauseTimer = setTimeout(() => {
          this.setEnemySkill(enemyName, e_id)
          const newE_i = this.enemy.findIndex(e => e.id === e_id)
          this.enemy[newE_i].skill.timer = setInterval(() => {
            this.setEnemySkill(enemyName, e_id)
          }, time);
        }, intervalTime);
        this.$once("hook:beforeDestroy", () => {
          this.removeEnemySkillTimer(e_i)
        })
      }
    },
    /** 设置敌人技能 */
    setEnemySkill(enemyName, e_id) {
      const e_i = this.enemy.findIndex(e => e.id === e_id)
      if(!this.enemy[e_i].skill) return
      this.enemy[e_i].skill.curTime = Date.now()
      const {curFloorI: _curFloorI, id} = this.enemy[e_i]
      // 舞王僵尸技能
      if(enemyName === '舞王') {
        const total = this.floorTile.num - 1
        for(let i = 0; i < 4; i++) {
          const newEnemy = this.$lodash.cloneDeep(this.enemySource[12])
          switch (i) {
            case 0: newEnemy.curFloorI = limitRange(_curFloorI - 2, 1, total); break;
            case 1: newEnemy.curFloorI = limitRange(_curFloorI - 1, 1, total); break;
            case 2: newEnemy.curFloorI = limitRange(_curFloorI + 1, 1, total); break;
            case 3: newEnemy.curFloorI = limitRange(_curFloorI + 2, 1, total); break;
          }
          const size = this.gridInfo.size
          const { curFloorI, w, h } = newEnemy
          const { x, y } = this.movePath[curFloorI - 1]
          newEnemy.x = x - (w - size)
          newEnemy.y = y - (size - (size * 2 - h - this.offset.y))
          this.enemy.push(newEnemy)
        }
        this.playDomAudio(id)
      }
    },
    /** 消灭敌人 */
    removeEnemy(e_iList) {
      e_iList.sort((a, b) => b - a)
      if(!e_iList.length) return
      for(let e_i in e_iList) {
        // 清除减速持续时间定时器
        if(this.enemy[e_i].durationTimer) {
          clearTimeout(this.enemy[e_i].durationTimer)
        }
        this.removeEnemySkillTimer(e_i)
        this.removeAudio(this.enemy[e_i].id)
        this.enemy.splice(e_i, 1)
      }
    },
    /** 清除敌人技能定时器 */
    removeEnemySkillTimer(e_i) {
      // 单个敌人被消灭时
      if(e_i !== undefined) {
        if(this.enemy[e_i] && this.enemy[e_i].skill) {
          clearTimeout(this.enemy[e_i].skill.pauseTimer)
          clearInterval(this.enemy[e_i].skill.timer)
        }
      } else {
        // 点击暂停时
        this.enemy.forEach(item => {
          if(item.skill) {
            clearInterval(item.skill.timer)
            clearTimeout(item.skill.pauseTimer)
            item.skill.timer = null
            item.skill.stopTime = Date.now()
          }
        })
      }
    },
    /** 发动技能 */
    handleSkill(skill, index) {
      const { name, damage, cd, audioKey } = skill
      if(name === '燃烧') {
        const e_iList = []
        for(const e_i in this.enemy) {
          this.enemy[e_i].hp.cur -= damage
           if(this.enemy[e_i].hp.cur <= 0) {
            this.money += this.enemy[e_i].reward
            e_iList.push(e_i)
            // 遍历清除防御塔里的该攻击目标
            for(const t of this.tower) {
              t.targetIndexList.splice(t.targetIndexList.findIndex(item => item === +e_i), 1)
            }
          }
        }
        this.playAudio(audioKey, 'Skill')
        this.removeEnemy(e_iList)
      }
      this.skillList[index].curTime = cd 
      this.skillList[index].timer = setInterval(() => {
        this.skillList[index].curTime -= 1000
        if(this.skillList[index].curTime <= 0) clearInterval(this.skillList[index].timer)
      }, 1000)
      this.$once("hook:beforeDestroy", () => {
        if(this.skillList[index]) clearInterval(this.skillList[index].timer)
      })
    },
    /** 初始化所有格子 */
    initAllGrid() {
      const { x_num, y_num } = this.gridInfo
      const arr = []
      for(let i = 0; i < x_num; i++) {
        arr.push([])
        for(let j = 0; j < y_num; j++) {
          arr[i][j] = 0
        }
      }
      this.gridInfo.arr = arr
    },
    /** 画攻击范围 */
    drawAttackScope(tower) {
      if(!tower) return
      const size_2 = this.gridInfo.size / 2
      const {r, x, y} = tower
      // arc (x, y, 半径, 0, 0到 2 * Math.PI 弧度, ture(逆时针))
      // this.ctx.beginPath()
      this.ctx.arc(x + size_2, y + size_2, r, 0, 2 * Math.PI, false)
      this.ctx.lineWidth = 2
      this.ctx.strokeStyle = '#282c34'
      this.ctx.stroke()
    },
    /** 初始化行动轨迹 */
    initMovePath() {
      const size = this.gridInfo.size
      // 刚开始就右移了，所有该初始格不会算上去
      const movePathItem = {x: 0, y: 50, x_y: 3}
      const movePath = []
      // 控制x y轴的方向 1:左 2:下 3:右 4:上
      let x_y = 3
      for(let i = 0; i < this.floorTile.num; i++) {
        switch (i) {
          // 上 
          case 3: case 15: case 21: case 39: case 58: case 68: {
            x_y = 4; break;
          }
          // 右
          case 5: case 10: case 23: case 34: case 77: {
            x_y = 3; break;
          } 
          // 下
          case 8: case 29: case 51: case 62: case 74: case 79: {
            x_y = 2; break;
          } 
          // 左
          case 18: case 48: case 53: case 60: case 64: case 70: case 81: {
            x_y = 1; break;
          } 
        }
        if(x_y % 2) movePathItem.x += x_y === 3 ? size : -size
        else movePathItem.y += x_y === 4 ? size : -size
        movePathItem.x_y = x_y
        movePath.push(JSON.parse(JSON.stringify(movePathItem)))
        this.gridInfo.arr[movePathItem.y/size][movePathItem.x/size] = 1
      }
      this.movePath = movePath
    },
    /** 开启创建金钱定时器 */
    startMoneyTimer() {
      this.proMoney.timer = setInterval(() => {
        if(!this.proMoney.isShow) {
          this.proMoney.isShow = true
          this.playAudio('ma-qifei', 'End')
        }
      }, this.proMoney.interval);
      this.$once('hook:beforeDestroy', () => {
        if(this.proMoney.timer) clearInterval(this.proMoney.timer)
      })
    },
    /** 点击了生产出来的金钱 */
    proMoneyClick() {
      this.proMoney.isShow = false
      this.money += this.proMoney.money
    },
    /** 获取canvas与浏览器 左边 / 顶部 的距离 */
    getCanvasMargin() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.canvasInfo.left = this.$refs.canvasRef.getBoundingClientRect().left;
        this.canvasInfo.top = this.$refs.canvasRef.getBoundingClientRect().top;
      }, 50);
    },
    /** 返回进入攻击范围的值的数组 */
    enterAttackScopeList(enemyList, tower) {
      const list = enemyList.reduce((pre, enemy, index) => {
        if(this.checkValInCircle(enemy, tower)) {
          pre.push({curIndex: enemy.curIndex, index})
        }
        return pre
      }, [])
      list.sort((a, b) => b.curIndex - a.curIndex)
      return list.map(item => item.index)
    },
    /** 判断值是否在圆内 */
    checkValInCircle(enemy, tower) {
      const {x, y, w, h} = enemy
      const angleList = [
        this.calculateDistance(tower, x, y),
        this.calculateDistance(tower, x + w, y),
        this.calculateDistance(tower, x + w, y + h),
        this.calculateDistance(tower, x , y + h),
      ]
      return angleList.some(item => item <= tower.r)
    },
    /** 计算点到圆心的距离之间的距离 */
    calculateDistance(tower, x, y) {
      const {x: _x, y: _y} = tower
      const size_2 = this.gridInfo.size / 2
      return this.powAndSqrt(_x + size_2 - x, _y + size_2 - y)
    },
    /** 两值平方相加并开方 求斜边 */
    powAndSqrt(val1, val2) {
      return Math.sqrt(Math.pow(val1, 2) + Math.pow(val2, 2))
    },
    /** 生成音频播放器 */
    createAudio(audioKey, id) {
      if(!this.audioList[audioKey]) return
      // var audio = new Audio()
      const audioWrap = document.querySelector('#audio-wrap')
      const audio = document.createElement('audio') //生成一个audio元素 
      audio.src = this.audioList[audioKey]  //音乐的路径
      audio.id = audioKey + id
      audioWrap.appendChild(audio)  //把它添加到页面中
    },
    /** 清除音频播放器 */
    removeAudio(id) {
      // 删除该 video dom 节点
      const videoDom = document.querySelector(`#${id}`)
      if(videoDom) {
        videoDom.remove()
      }
    },
    /** 播放背景音乐 */
    playBgAudio() {
      this.isPlayBgAudio = !this.isPlayBgAudio
      if(this.isPlayBgAudio) {
        this.$refs.audioBgRef.volume = 0.65
        this.$refs.audioBgRef.play()
      }
      else this.$refs.audioBgRef.pause()
    },
    /** 播放音乐 */
    playAudio(audioKey, key) {
      const audio_key = `audio${key}`
      if(this[audio_key] === undefined) return
      if(this[audio_key] !== audioKey) {
        this[audio_key] = audioKey
      }
      this.$nextTick(()=>{
        // 调节音量
        this.$refs[`${audio_key}Ref`].volume = 0.9
        this.$refs[`${audio_key}Ref`].play()
      })
    },
    /** 播放创建出来的dom(防御塔和僵尸)的音乐 */
    playDomAudio(id) {
      console.log('id: ', id);
      const audioWrap = document.querySelector('#audio-wrap')
      const audioDom = audioWrap.querySelector(`#${id}`)
      audioDom.play()
    },
    /** 单张gif转静态图片 */
    gifToStaticImg(index) {
      return new Promise((resolve, reject) => {
        const {type, imgSource} = this.enemySource[index]
        if(type !== 'gif') {
          const newImg = new Image();
          newImg.src = imgSource
          this.enemySource[index].imgList = [newImg]
          resolve()
        }
        const gifImg = document.createElement('img');
        gifImg.src = imgSource
        // gifImg.style.transform = 'rotate(90deg)';
        // 创建gif实例
        const rub = new SuperGif({ gif: gifImg } );
        rub.load(() => {
          const imgList = [];
          for (let i = 1; i <= rub.get_length(); i++) {
            // 遍历gif实例的每一帧
            rub.move_to(i);
            const imgUrl = rub.get_canvas()
            imgList.push(imgUrl)
          }
          this.enemySource[index].imgList = imgList
          resolve()
        });
      })
    },
    /** 等待所有的gif图生成静态图片 */
    async allGifToStaticImg() {
      return Promise.all(this.enemySource.map((item, index) => this.gifToStaticImg(index))).then(res => {
        this.loadingDone = true
      })
    },
    /** 加载图片 imgUrl: 图片数组, objKey: 在数组中的key值  */
    loadImage(imgUrl, objKey) {
      return new Promise((resolve, reject) => {
        const imgObj = {}; // 保存图片资源
        let tempImg, imgLength = 0, loaded = 0;
        for (let key in imgUrl) {
          imgLength++; // 初始化要加载图片的总数
          tempImg = new Image();
          tempImg.src = !objKey ? imgUrl[key] : imgUrl[key][objKey];
          imgObj[key] = tempImg;
          tempImg.onload = function () {
            loaded++; // 统计已经加载完毕的图像
            // 所有的图片都加载完毕
            if (loaded >= imgLength) {
              resolve(imgObj)
            }
          };
        }
      })
    },
    /** 监听用户的键盘事件 */
    onKeyDown() {
      document.onkeydown = (e) => {
        if(this.isGameBeginMask) return
        switch (e.code) {
          case "Space":{
            this.gamePause()
            break;
          } 
        }
      };
    },
    /** 开始游戏 */
    beginGame() {
      this.$refs.audioLevelRef.play()
      // this.playBgAudio()
      this.isGameBeginMask = false
      this.isPause = false
      this.$message({type: 'success', message: '点击右上方按钮或按空格键开始 / 暂停游戏', duration: 2500, showClose: true})
    },
    /** 游戏暂停 */
    gamePause() {
      if(!this.isGameOver) {
        this.isPause = !this.isPause;
      }
    }
  }
}
</script>

<style lang="less" scoped>
@size: 50px; 
@fontColor: #5bb3e5;
#protect-horse {
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
    &:hover {
      opacity: .8;
    }
  }
  .game-wrap {
    position: relative;
    display: inline-block;
    // width: 1230px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #eee;
    border-radius: 8px;
    .title {
      position: absolute;
      top: -45px;
      left: 0;
      right: 0;
      font-size: 24px;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
      color: #eee;
      text-align: center;
    }
    .canvas-wrap {
      position: relative;
      padding: 50px 50px 50px;
      background-image: radial-gradient(circle 500px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%);
      border-radius: 4px;
      overflow: hidden;
      .top-wrap {
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
            color: @fontColor;
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
      .building-wrap {
        position: absolute;
        user-select: none;
        .add-icon {
          width: @size;
          height: @size;
        }
        .tower-wrap {
          position: absolute;
          top: calc(@size + 8px);
          left: calc(50% - (@size * 2 + 25px));
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(4, @size);
          grid-template-rows: repeat(2, @size);
          background: rgba(255, 255, 255, .4);
          border-radius: 16px;
          padding: 10px;
          z-index: 99;
          .tower {
            position: relative;
            width: @size;
            height: @size;
            border-radius: 8px;
            border: 2px solid #fff;
            margin-bottom: 10px;
            box-sizing: border-box;
            .tower-icon {
              width: 100%;
              height: 100%;
            }
            .info {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              text-align: center;
              font-size: 14px;
              color: #fff;
              background: rgba(0, 0, 0, .35);
            }
          }
          .tower-no-money {
            opacity: .3;
          }
        }
        .tower-wrap-row {
          grid-template-rows: repeat(4, @size);
          grid-template-columns: repeat(2, @size);
          grid-auto-flow: column;
          width: auto;
          .tower {
            margin-bottom: 0;
            margin-right: 10px;
          }
        }
        .tower-wrap-row-top {
          top: calc(50% - (@size * 2 + 25px));
        }
        .tower-wrap-left {
          left: calc(@size + 8px);
        }
        .tower-wrap-right {
          right: calc(@size + 8px);
          left: auto;
        }
        .tower-wrap-bottom {
          bottom: calc(@size + 8px);
          top: auto;
        }
      }
      .building-scope {
        position: absolute;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        border: 2px solid #3b9bdf;
        border-radius: 50%;
        background: rgba(255, 255, 255, .25);
        .sale-wrap {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          align-items: center;
          // background: rgba(255, 255, 255, 0.4);
          background: #3b9bdf;
          color: #fff;
          border-radius: 8px;
          padding: 0 5px;
          cursor: pointer;
          &:hover {
            opacity: .75;
          }
          .iconfont {
            font-size: 20px;
          }
          .sale-num {
            font-size: 14px;
          }
        }
      }
      .terminal {
        position: absolute;
        left: 40px;
        top: 45%;
        transform: translateY(-50%);
        user-select: none;
        .hp {
          color: #f24410;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }
        .terminal-icon {
          width: 150px;
        }
        .money-icon {
          position: absolute;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
        }
      }
      .gameover-wrap {
        .info {
          color: #fff;
        }
      }
      .game-begin {
        .info {
          .begin-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .icon-wrap {
              display: inline-block;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 150px;
              height: 150px;
              border-radius: 50%;
              background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
              cursor: pointer;
              user-select: none;
              &:hover {
                opacity: .95;
                box-shadow: 0 0 16px 4px #3393e7;
              }
              .iconfont {
                color: #fff;
                font-size: 80px;
                animation: pulse 2s linear infinite;
              }
              @keyframes pulse {
                70% {
                  transform: scale(1.2);
                  opacity: 0.4;
                }
                100% {
                  transform: scale(1.2);
                  opacity: 0;
                }
              }
            }
            .begin-text {
              font-size: 36px;
              color: #fff;
              font-weight: bold;
              margin-top: 16px;
              letter-spacing: 8px;
              margin-left: 8px;
            }
          }
        }
      }
      .mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
