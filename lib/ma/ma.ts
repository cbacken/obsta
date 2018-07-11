import { Observable } from "rxjs";
import { List } from "immutable";
import { div, round } from "../common/utils";

export function ema(obSeries: Observable<number>, period: number = 1) {
  return Observable.create(observer => {
    let i: number = 0,
      s: number = 0,
      ma: number = 0,
      pema: number = 0;

    obSeries.subscribe(
      d => {
        s += isNaN(d) ? 0 : d;
        if (i < period - 1) {
          ma = NaN;
        } else if (i + 1 === period) {
          ma = round(div(s, period));
          pema = ma;
        } else {
          ma = round((d - pema) * (2 / (period + 1)) + pema);
          pema = ma;
        }
        // console.log(`ema d: ${d} s: ${s} ema: ${ma}`);
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

export function sma(obSeries: Observable<number>, period: number = 1) {
  return Observable.create(observer => {
    let series = List<number>();

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
          ma = round(div(s, period));
        } else {
          let ts = series.get(i - period);
          s -= isNaN(ts) ? 0 : ts;
          ma = round(div(s, period));
        }
        // console.log(`sma d: ${d} s: ${s} sma: ${ma}`);
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
