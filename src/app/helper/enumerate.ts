export function enumerate<T>(arr: T[]): [number, T][] {
  const result: [number, T][] = [];
  for (let i = 0; i < arr.length; i++) {
    result.push([i, arr[i]]);
  }
  return result;
}
