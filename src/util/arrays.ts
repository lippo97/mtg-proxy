export function zipArrayWithShift<T>(arr: T[]): [T, T | null][] {
  const zippedArray: [T, T | null][] = [];

  for (let i = 0; i < arr.length - 1; i++) {
    zippedArray.push([arr[i], arr[i + 1]]);
  }

  zippedArray.push([arr[arr.length - 1], null]);

  return zippedArray;
}