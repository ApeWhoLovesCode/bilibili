/**
 * 塔防数据
 * name:名称, money:花费, r:攻击半径, damage:伤害, targetNum:攻击目标数量, rate:攻击速率(n毫秒/次), speed:子弹速度, slow:{num:减速倍数,time:减速时间}  bSize: 子弹大小, img:塔防图片, bulletImg:子弹图片
 */
export default [
  {name: '茄子',     money: 525, saleMoney: 250, r: 300, damage: 5, targetNum: 1, rate: 1100, speed: 12, bSize: {w:20,h:20}, audioKey: 'qizi-wujie', img: require("../assets/img/plant/qiezi.png"), bulletImg: require("../assets/img/plant/bullet.png")},
  {name: '单发豌豆', money: 100, saleMoney: 50, r: 100, damage: 1, targetNum: 1, rate: 900, speed: 5, bSize: {w:20,h:20},    audioKey: 'pea-one',  img: require("../assets/img/plant/pea_icon.gif"), bulletImg: require("../assets/img/plant/bullet.png")},
  {name: '两发豌豆', money: 200, saleMoney: 100, r: 150, damage: 1, targetNum: 1, rate: 450, speed: 8, bSize: {w:20,h:20},   audioKey: 'pea-two',  img: require("../assets/img/plant/pea_2_icon.gif"), bulletImg: require("../assets/img/plant/bullet.png")},
  {name: '寒冰豌豆', money: 300, saleMoney: 100, r: 150, damage: 1, targetNum: 2, rate: 900, speed: 5, slow: {num: 2, time: 5000}, bSize: {w:20,h:20}, audioKey: 'pea-slow', img: require("../assets/img/plant/pea_snow_icon.gif"), bulletImg: require("../assets/img/plant/bullet2.png")},
  {name: '三发豌豆', money: 350, saleMoney: 150, r: 200, damage: 1, targetNum: 3, rate: 900, speed: 8, bSize: {w:20,h:20},   audioKey: 'pea-three', img: require("../assets/img/plant/pea_3_icon.gif"), bulletImg: require("../assets/img/plant/bullet.png")},
]