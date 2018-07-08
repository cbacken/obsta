import { Observable } from "rxjs";
import { List } from "immutable";
import { round } from "../common/utils";

export function ma(obSeries: Observable<number>, period: number = 1) {
  return Observable.create(observer => {
    let series = List();

    let i: number = 0,
      s: number = 0,
      ma: number = 0;

    obSeries.subscribe(
      d => {
        series = series.push(d);

        s += isNaN(d) ? 0 : d;
        if (i < period - 1) {
          ma = NaN;
        } else if (i + 1 === period) {
          ma = round(s / period);
        } else {
          s -= isNaN(series.get(i - period) as number)
            ? 0
            : (series.get(i - period) as number);
          ma = round(s / period);
        }
        // console.log(`d: ${d} s: ${s} sma: ${ma}`);
        i++;
        observer.next(ma);
      },
      err => {
        observer.error(err);
      },
      () => {
        observer.complete();
      }
    );
  });
}
