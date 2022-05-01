/** 用于比较 num 最大和最小不能超过边界值 */
export function limitRange(num, min, max) {
  return Math.min(Math.max(num, min), max);
}
