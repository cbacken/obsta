import { List } from "immutable";

export function avg(n: List<number> = List<number>(), l: number = 1) {
  return n.reduce((a: number, b: number) => {
    return a + b;
  }, 0) / l;
}

export function div(n: number, l: number = 1) {
  return n / l;
}

export function round(n) {
  return Math.round(n * 100) / 100;
}
