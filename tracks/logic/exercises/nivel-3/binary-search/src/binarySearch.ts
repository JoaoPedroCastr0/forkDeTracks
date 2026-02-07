export function binarySearch(arr: number[], target: number): number {
  let low = 0
  let high = arr.length - 1

  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const value = arr[mid]
    if (value === target) return mid
    if (value < target) low = mid + 1
    else high = mid - 1
  }

  return -1
}
