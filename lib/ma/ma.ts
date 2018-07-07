import { Observable } from "rxjs";
import { List } from "immutable";
import { round } from "../common/utils";

export function ma(series: List<number>, period: number = 1) {
  return Observable.create(observer => {
    let i = 0,
      s = 0,
      ma = 0;
    series.map(d => {
      s += isNaN(d) ? 0 : d;
      if (i < period - 1) {
        ma = NaN;
      } else if (i + 1 === period) {
        ma = round(s / period);
      } else {
        s -= isNaN(series.get(i - period)) ? 0 : series.get(i - period);
        ma = round(s / period);
      }
      // console.log(`d: ${d} s: ${s} sma: ${ma}`);
      i++;
      observer.next(ma);
    });
    observer.complete();
  });
}
