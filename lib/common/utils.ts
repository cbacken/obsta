export function avg(n: number, l: number) {
  return this.round(n / (l || 1));
}

export function round(n) {
  return Math.round(n * 100) / 100;
}
