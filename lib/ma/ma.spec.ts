import { Observable, from, of, interval, pipe } from "rxjs";
import { take, delay } from "rxjs/operators";
import { List } from "immutable";
import { expect } from "chai";
import { ma } from "./ma";

const noop = () => {};

// const randPrice = (): number => yield Math.floor(Math.random() * (1000 - 100) + 100) / 100;

function* randPrice() {
  while (1) yield Math.floor(Math.random() * (1000 - 100) + 100) / 100;
}

describe("Observable Moving Averages", () => {
  describe("Observable Simple Moving Average", () => {
    it("Should return NaN on empty observable", () => {
      ma(of(), 3).subscribe(
        x => {
          expect(x).to.deep.equal(NaN);
        },
        noop,
        noop
      );
    });

    it("Should return a Simple Moving Average of [1, 2, 3, 4, 5]", () => {
      const results = List().asMutable();
      ma(from([1, 2, 3, 4, 5]), 3).subscribe(
        x => {
          results.push(x);
        },
        noop,
        () => {
          expect(results.toArray()).to.deep.equal([NaN, NaN, 2, 3, 4]);
        }
      );
    });

    it("Should return a Simple Moving Average of [1,51,2,41,3,31,4,21,5,11,6,1]", () => {
      const results = List().asMutable();
      ma(from([1, 51, 2, 41, 3, 31, 4, 21, 5, 11, 6, 1]), 2).subscribe(
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
        }
      );
    });

    it("Should return Simple Moving Average on Timed Sequence", () => {
      // const source = from(randPrice()).pipe(take(25));
      const source = interval(50).pipe(take(10));
      let t = 0;
      ma(source, 5).subscribe(
        x => {
          t = x;
        },
        noop,
        () => {
          expect(t).to.equal(7);
        }
      );
    });
  });
});
