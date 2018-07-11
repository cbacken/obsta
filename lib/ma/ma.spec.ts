import { Observable, from, of, interval, pipe } from "rxjs";
import { take, delay } from "rxjs/operators";
import { List } from "immutable";
import { expect } from "chai";
import { ema, sma } from "./ma";

const noop = () => {};

function* randPrice() {
  while (1) yield Math.floor(Math.random() * (1000 - 100) + 100) / 100;
}

describe("Observable Moving Averages", () => {
  describe("Observable Simple Moving Average", () => {
    it("Should return NaN on empty observable", done => {
      sma(of(), 3).subscribe(
        x => {
          expect(x).to.deep.equal(NaN);
        },
        noop,
        () => done()
      );
    }).timeout(10000);

    it("Should return a Simple Moving Average of [1,51,2,41,3,31,4,21,5,11,6,1]", done => {
      const results = List().asMutable();
      sma(from([1, 51, 2, 41, 3, 31, 4, 21, 5, 11, 6, 1]), 2).subscribe(
        x => {
          results.push(x);
        },
        noop,
        () => {
          expect(results.toArray()).to.deep.equal([
            NaN,
            26,
            26.5,
            21.5,
            22,
            17,
            17.5,
            12.5,
            13,
            8,
            8.5,
            3.5
          ]);
          done();
        }
      );
    }).timeout(10000);

    it("Should return Simple Moving Average on Timed Sequence", done => {
      // const source = from(randPrice()).pipe(take(25));
      const source = interval(50).pipe(take(10));
      let t = 0;
      sma(source, 5).subscribe(
        x => {
          t = x;
        },
        noop,
        () => {
          expect(t).to.equal(7);
          done();
        }
      );
    }).timeout(10000);
  });

  describe("Observable Exponential Moving Average", () => {
    it("Should return NaN on empty observable", done => {
      ema(of(), 3).subscribe(
        x => {
          expect(x).to.deep.equal(NaN);
        },
        noop,
        () => done()
      );
    }).timeout(10000);

    it("Should return a Exponential Moving Average of [22.27, 22.19, 22.08, 22.17, 22.18, 22.13, 22.23, 22.43, 22.24, 22.29, 22.15,22.39]", done => {
      const results = List().asMutable();
      ema(
        from([
          22.27,
          22.19,
          22.08,
          22.17,
          22.18,
          22.13,
          22.23,
          22.43,
          22.24,
          22.29,
          22.15,
          22.39,
        ]),
        10
      ).subscribe(
        x => {
          results.push(x);
        },
        noop,
        () => {
          expect(results.toArray()).to.deep.equal([
            NaN,
            NaN,
            NaN,
            NaN,
            NaN,
            NaN,
            NaN,
            NaN,
            NaN,
            22.22,
            22.21,
            22.24
          ]);
          done();
        }
      );
    }).timeout(10000);

    it("Should return Exponential Moving Average on Timed Sequence", done => {
      const source = interval(50).pipe(take(10));
      let t = 0;
      ema(source, 5).subscribe(
        x => {
          t = x;
        },
        noop,
        () => {
          expect(t).to.equal(7);
          done();
        }
      );
    }).timeout(10000);    
  });
});
