/** Bir listedeki iki komşu öğenin kimliğini yer değiştirir — yukarı/aşağı butonları için. */
export function swapAdjacentIds(ids: number[], index: number, direction: "up" | "down"): number[] {
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= ids.length) return ids;

  const reordered = [...ids];
  [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
  return reordered;
}
