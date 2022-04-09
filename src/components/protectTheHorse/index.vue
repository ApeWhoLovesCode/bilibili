<template>
  <div id="protect-horse">
    <div class="game-wrap">
      <div class="title">{{title}}</div>
      <div class="canvas-wrap" @click="bgClick">
        <!-- 游戏区域 -->
        <canvas ref="canvasRef" id="mycanvas" width="1050" height="600" @click="getMouse($event)"></canvas>
        <!-- 建筑物的容器 -->
        <!-- 上面和左边内边距是 50px -->
        <div v-if="building.isShow" class="building-wrap" :style="{left: building.left + floorTile.size + 'px', top: building.top + floorTile.size + 'px'}">
          <img src="./assets/img/add.png" alt="" class="add-icon">
          <div class="tower-wrap" >
            <div class="tower" v-for="(item, index) in towerList" @click="buildTower(index)">
              <img :src="item.img" alt="" class="tower-icon">
              <div class="info">￥{{item.money}}</div>
            </div>
          </div>
        </div>
        <!-- 终点 -->
        <div class="terminal">
          <div class="hp">{{hp}}</div>
          <img class="terminal-icon" src="./assets/img/horse.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SuperGif from './utils/libgif'
export default {
  name: 'protect-horse',
  data() {
    return {
      title: 'game',
      // 浏览器大小变化
      resizeTimer: null,
      // canvas 对象
      canvas: {},
      // canvas 画布距离浏览器左边和顶部的距离
      canvasInfo: {left: 0, top: 0},
      // 得到 canvas 的 2d 上下文
      ctx: {},
      // 设置游戏的暂停
      isPause: true,
      // 等级
      level: 0,
      // 生命值
      hp: 10,
      // 敌人生成间隔时间
      intervalTime: 300, 
      // 存放上一次和本次生成的敌人时间戳，用于暂停判断还有多久产生敌人
      timeDiff: {curTime: 0, stopTime: 0},
      // 生成敌人的定时器
      makeEnemyTimer: null,
      // 暂停后的生成敌人的定时器
      pauseMakeEnemyTimer: null,
      // 当前等级需要的敌人索引
      levelEnemy: [],
      // 场上的敌人数组  
      enemy: [],
      // 偏移量y 是用来计算敌人与地板底部的距离 (两个地板(50*2)-敌人(h(75)+y(15))) = 10
      offset: {y: 10},
      // 敌人资源 curFloorI: 当前所在格的索引, 速度有: 1，2，3，4，6，8，12，24
      // ∵ offset.y = 10; ∴ h + y = 90
      enemySource: [
        {x: 0, y: 15, w: 75, h: 75, curFloorI: 0, speed: 9, type: 'zombies_0', imgSource: require("./assets/img/zombies/zombies_0_move.gif"), imgList: [], imgIndex: 0},
        {x: 0, y: 15, w: 75, h: 75, curFloorI: 0, speed: 3, type: 'zombies_1', imgSource: require("./assets/img/zombies/zombies_1_move.gif"), imgList: [], imgIndex: 0},
        {x: 0, y: 15, w: 75, h: 75, curFloorI: 0, speed: 3, type: 'zombies_2', imgSource: require("./assets/img/zombies/zombies_2_move.gif"), imgList: [], imgIndex: 0},
        {x: 0, y: 15, w: 75, h: 75, curFloorI: 0, speed: 3, type: 'zombies_3', imgSource: require("./assets/img/zombies/zombies_3_move.gif"), imgList: [], imgIndex: 0},
        {x: 0, y: 15, w: 75, h: 75, curFloorI: 0, speed: 3, type: 'zombies_4', imgSource: require("./assets/img/zombies/zombies_4_move.gif"), imgList: [], imgIndex: 0},
        {x: 0, y: 5, w: 85, h: 85, curFloorI: 0, speed: 3, type: 'zombies_5', imgSource: require("./assets/img/zombies/zombies_5_move.gif"), imgList: [], imgIndex: 0},
      ],
      // 最小刻度
      minScale: 2,
      // 所有静态图片资源
      imgObj: {
        floorTile: require("./assets/img/floor-tile.png")
      },
      // 加载完成的静态图片
      imgOnloadObj: null,
      // 格子数量信息 arr: [[ 0:初始值(可以放塔)，1:地板，2:有建筑，3:有阻挡物 ]]
      gridInfo: { x_num: 21, y_num: 12, size: 50, arr: [[]] },
      // 地板：大小 数量
      floorTile: {size: 50, num: 83},
      // 移动轨迹 [{x坐标, y坐标, x_y(方向): 1:左 2:下 3:右 4:上}]
      movePath: [],
      // 建筑物
      building: { left: 0, top: 0, isShow: false },
      // 塔防数据
      towerList: [
        {money: 110, img: require("./assets/img/plant/qiezi.png")},
        {money: 110, img: require("./assets/img/plant/pea_icon.gif")},
        {money: 110, img: require("./assets/img/plant/pea_2_icon.gif")},
        {money: 110, img: require("./assets/img/plant/pea_snow_icon.gif")},
        {money: 110, img: require("./assets/img/plant/pea_3_icon.gif")},
      ],
      towerOnloadImg: null,
      // 场上的防御塔数组
      tower: []
    }
  },
  watch: {
    timeDiff: {
      deep: true,
      handler(val) {
        // 
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
          this.timeDiff.stopTime = Date.now()
          // 
        } else {
          this.makeEnemy()
          this.startAnimation();
        }
      }
    },
    // 监听等级变化生成对应敌人
    level: {
      immediate: true,
      handler(val) {
        switch (val) {
          case 0: {
            const list = [0]
            for(let i = 0; i < 8; i++) {
              list.push(1)
            }
            list.push(5)
            this.levelEnemy = list
            break;
          }
          case 1: {
            const list = [0]
            for(let i = 0; i < 4; i++) {
              list.push(2)
            }
            for(let i = 0; i < 5; i++) {
              list.push(3)
            }
            this.levelEnemy = list
            break;
          }
          case 2: {
            const list = [0]
            for(let i = 0; i < 5; i++) {
              list.push(4)
            }
            for(let i = 0; i < 5; i++) {
              list.push(5)
            }
            this.levelEnemy = list
            break;
          }
        }
      },
    }
  },
  mounted() {
    this.init();
    this.getCanvasMargin()
    // 监听浏览器窗口大小变化
    window.addEventListener("resize", this.getCanvasMargin);
  },
  destroyed() {
    window.removeEventListener('resize', this.getCanvasMargin)
  },
  methods: {
    async init() {
      this.canvas = this.$refs.canvasRef;
      this.ctx = this.canvas.getContext("2d");
      this.initAllGrid()
      this.initBuilding()
      this.initMovePath()
      this.onKeyDown()
      await this.allGifToStaticImg()
      // 加载图片
      this.imgOnloadObj = await this.loadImage(this.imgObj);
      this.towerOnloadImg = await this.loadImage(this.towerList, true);
      this.makeEnemy(true)
      this.startAnimation()
    },
    /** 点击获取鼠标位置 选中建筑区 */
    getMouse(e) {
      e.stopPropagation()
      // window.event.pageX
      const size = this.floorTile.size
      const _x = e.x - this.canvasInfo.left, _y = e.y - this.canvasInfo.top
      const col = Math.floor(_y / size), row = Math.floor(_x / size)
      
      // 已经有地板或者有建筑了
      if(this.gridInfo.arr[col][row]) {
        return
      }
      this.building.isShow = true
      this.building.left = row * size
      this.building.top = col * size
    },
    /** 点击建造塔防 */
    buildTower(index) {
      const {left: x, top: y} = this.building
      const size = this.gridInfo.size
      const tower = {x, y, img: this.towerOnloadImg[index]}
      this.tower.push(tower)
      this.gridInfo.arr[y / size][x / size] = 2
      this.drawTower(tower)
    },
    /** 点击背景 隐藏建筑物 */
    bgClick() {
      if(this.building.isShow) this.building.isShow = false
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
      const size = this.floorTile.size
      for(let f of this.movePath) {
        this.ctx.drawImage(this.imgOnloadObj.floorTile, f.x, f.y, size, size)
      }
    },
    /** 画塔防 */
    drawTower(item) {
      const size = this.floorTile.size
      if(item) {
        this.ctx.drawImage(item.img, item.x, item.y, size, size)
      } else {
        for(const t of this.tower) {
          this.ctx.drawImage(t.img, t.x, t.y, size, size)
        }
      }
    },
    /** 画敌人 */
    drawEnemy(index) {
      if(!this.enemy[index]) return
      const { x, y, w, h, imgList, imgIndex } = this.enemy[index]
      // this.ctx.translate(200, 0);
      // this.ctx.scale(-1, 1)
      // 
      this.ctx.drawImage(imgList[imgIndex], x, y, w, h) 
    },
    /** 敌人移动 */
    moveEnemy(index) {
      const { w, h, speed, curFloorI } = this.enemy[index]
      // 敌人到达终点
      if(curFloorI === this.floorTile.num - 1) {
        this.enemy.splice(index, 1)
        // 最后一只怪物消失了
        if(index === 0 && this.enemy.length === 1) {
          this.level++
          this.parse = true
          this.makeEnemy()
        }
        return true
      }
      const size = this.floorTile.size
      // 将格子坐标同步到敌人的坐标
      const { x, y, x_y } = this.movePath[curFloorI]
      // const _y = y - (size - this.offset.y)
      const _y = y - (size - (size * 2 - h - this.offset.y))
      // 敌人需要站在地板中间区域
      const _x = x - (w - size)
      switch (x_y) {
        case 1: this.enemy[index].x -= speed; break;
        case 2: this.enemy[index].y -= speed; break;
        case 3: this.enemy[index].x += speed; break;
        case 4: this.enemy[index].y += speed; break;
      }
      const { x: eX, y: eY } = this.enemy[index]
      // if(eX === _x && eY === _y) {
      if((eX >= _x &&  eX <= _x + speed) && (eY >= _y &&  eY <= _y + speed)) {
        this.enemy[index].curFloorI++
      }
    },
    /** 根据速度更改敌人位置 */
    setEnemyPosition() {

    },
    /** 按间隔时间生成敌人 */
    makeEnemy(isInit) {
      // 当前关卡敌人已经全部上场
      if(this.enemy.length === this.levelEnemy.length) return
      // 刚开始生成了一个敌人 然后因为是暂停，所以会清除定时器
      if(isInit) {
        this.timeDiff.stopTime = Date.now()
        this.setEnemy()
        return
      }
      // 暂停回来，间隔时间修改
      const time = this.intervalTime - (this.timeDiff.stopTime - this.timeDiff.curTime)
      // 
      this.pauseMakeEnemyTimer = setTimeout(() => {
        this.setEnemy()
        this.makeEnemyTimer = setInterval(() => {
          if(this.enemy.length === this.levelEnemy.length || this.isPause) {
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
      this.enemy.push(this.$lodash.cloneDeep(this.enemySource[this.levelEnemy[this.enemy.length]]))
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
    /** 初始化建筑物 */
    initBuilding() {

    },
    /** 初始化行动轨迹 */
    initMovePath() {
      const size = this.floorTile.size
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
    /** 获取canvas与浏览器 左边 / 顶部 的距离 */
    getCanvasMargin() {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.canvasInfo.left = this.$refs.canvasRef.getBoundingClientRect().left;
        this.canvasInfo.top = this.$refs.canvasRef.getBoundingClientRect().top;
      }, 50);
    },
    /** 单张gif转静态图片 */
    gifToStaticImg(index) {
      return new Promise((resolve, reject) => {
        const gifImg = document.createElement('img');
        gifImg.src = this.enemySource[index].imgSource
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
        
      })
    },
    /** 加载图片 */
    loadImage(imgUrl, isTower) {
      return new Promise((resolve, reject) => {
        var imgObj = {}; // 保存图片资源
        var tempImg,
          imgLength = 0,
          loaded = 0;
        for (var key in imgUrl) {
          imgLength++; // 初始化要加载图片的总数
          tempImg = new Image();
          tempImg.src = !isTower ? imgUrl[key] : imgUrl[key].img;
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
        switch (e.code) {
          case "Space": this.isPause = !this.isPause; break;
        }
      };
    },
  }
}
</script>

<style lang="less" scoped>
@size: 50px; 
#protect-horse {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
      top: -50px;
      left: 0;
      right: 0;
      font-size: 24px;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
      color: #ccc;
      text-align: center;
    }
    .canvas-wrap {
      position: relative;
      padding: 50px 50px 30px;
      background-image: radial-gradient(circle 500px at center, #16d9e3 0%, #30c7ec 47%, #46aef7 100%);
      border-radius: 4px;
      .building-wrap {
        position: absolute;
        user-select: none;
        .add-icon {
          width: @size;
          height: @size;
        }
        .tower-wrap {
          position: absolute;
          top: calc(@size + 6px);
          left: calc(50% - 120px);
          // 50 * 5 = 250
          width: calc(@size * 5 - 10px);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, .3);
          border-radius: 16px;
          padding: 12px;
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
            }
          }
        }
      }
      .terminal {
        position: absolute;
        left: 20px;
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
          width: 60px;
        }
      }
    }
  }
}
</style>
