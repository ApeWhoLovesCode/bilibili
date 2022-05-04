/**
 * 敌人资源 
 * curFloorI: 当前所在格的索引, imgList: gif转静态图片数组, curSpeed: 当前的速度
 * ∵ offset.y = 10; ∴ h + y = 90
 */



export default [
  {name: '僵尸',     x: 0, y: 15, w: 75, h: 75, curFloorI: 0, curSpeed: 1.5, speed: 1.5, reward: 50, hp: {cur: 10, sum: 10, size: 8},    audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_0_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 15, w: 75, h: 75, curFloorI: 0, curSpeed: 1.5, speed: 1.5, reward: 10, hp: {cur: 10, sum: 10, size: 8},    audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_1_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 15, w: 75, h: 75, curFloorI: 0, curSpeed: 1.5, speed: 1.5, reward: 20, hp: {cur: 20, sum: 20, size: 8},    audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_2_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 15, w: 75, h: 75, curFloorI: 0, curSpeed: 1.5, speed: 1.5, reward: 30, hp: {cur: 30, sum: 30, size: 8},    audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_3_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 15, w: 75, h: 75, curFloorI: 0, curSpeed: 2, speed: 2, reward: 50, hp: {cur: 50, sum: 50, size: 8},        audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_4_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 5,  w: 85, h: 85, curFloorI: 0, curSpeed: 3, speed: 3, reward: 100, hp: {cur: 100, sum: 100, size: 8},     audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_5_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 5, w: 85, h: 85, curFloorI: 0,  curSpeed: 3, speed: 3, reward: -100, hp: {cur: 20, sum: 20, size: 8},      audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_6_move.gif"), imgList: [], imgIndex: 0},
  {name: '舞王',     x: 0, y: 5,  w: 85, h: 85, curFloorI: 0, curSpeed: 2, speed: 2, reward: 150, hp: {cur: 150, sum: 150, size: 8},       skill: {timer: null, pauseTimer: null, time: 6000, curTime: 0, stopTime: 0 }, audioKey: 'pvz-dance', type: 'gif', imgSource: require("../assets/img/zombies/zombies_7_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 5, w: 100, h: 85, curFloorI: 0, curSpeed: 4, speed: 4, reward: 20, hp: {cur: 20, sum: 20, size: 8},        audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_8_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 0, w: 90, h: 90, curFloorI: 0,  curSpeed: 2, speed: 2, reward: 150, hp: {cur: 200, sum: 200, size: 8},     audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_9_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 0, w: 90, h: 90, curFloorI: 0,  curSpeed: 1.5, speed: 1.5, reward: 200, hp: {cur: 500, sum: 500, size: 8}, audioKey: 'pvz', type: 'png', imgSource: require("../assets/img/zombies/afu.png"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 0, w: 90, h: 90, curFloorI: 0,  curSpeed: 1.5, speed: 1.5, reward: 300, hp: {cur: 800, sum: 800, size: 8}, audioKey: 'pvz', type: 'png', imgSource: require("../assets/img/zombies/fulisha.png"), imgList: [], imgIndex: 0},
  {name: '舞王小兵', x: 0, y: 15, w: 75, h: 75, curFloorI: 0,  curSpeed: 2, speed: 2, reward: 30, hp: {cur: 30, sum: 30, size: 8},       audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_10_move.gif"), imgList: [], imgIndex: 0},
  {name: '僵尸',     x: 0, y: 15, w: 75, h: 75, curFloorI: 0,  curSpeed: 2, speed: 2, reward: 10, hp: {cur: 10, sum: 10, size: 8},       audioKey: 'pvz', type: 'gif', imgSource: require("../assets/img/zombies/zombies_11_move.gif"), imgList: [], imgIndex: 0},
  {name: '坤坤',     x: 0, y: 0, w: 90, h: 90, curFloorI: 0,  curSpeed: 2, speed: 2, reward: 250, hp: {cur: 500, sum: 500, size: 8},     skill: {timer: null, pauseTimer: null, time: 10000, curTime: 0, stopTime: 0 }, audioKey: 'kunkun', type: 'png', imgSource: require("../assets/img/zombies/kunkun.png"), imgList: [], imgIndex: 0},
]