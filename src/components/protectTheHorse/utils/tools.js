/** 用于限制 num 最大和最小不能超过边界值 */
export function limitRange(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/** 生成范围内的随机数 */
export function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
