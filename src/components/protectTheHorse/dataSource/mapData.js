export default mapData = [
  {
    3: 4, 15: 4, 21: 4, 39: 4, 58: 4, 68: 4,
    5: 3, 10: 3, 23: 3, 34: 3, 77: 3,
    8: 2, 29: 2, 51: 2, 62: 2, 74: 2, 79: 2,
    18: 1, 48: 1, 53: 1, 60: 1, 64: 1, 70: 1,
  }
]

/* 
switch判断写法
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
*/