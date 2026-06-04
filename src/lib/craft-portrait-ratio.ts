/** Stable portrait height variation (9:w) for organic masonry rhythm. */
export function craftPortraitRatioForId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const unit = (h >>> 0) / 2 ** 32;
  return 14 + unit * 5;
}
