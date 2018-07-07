import { expect } from "chai";
import { List } from "immutable";
import { ma } from "./ma";

const noop = () => {};

describe("Moving Averages", () => {
  describe("Simple Moving Average", () => {
    it("Should return a SMA of [1, 2, 3, 4, 5]", () => {
      const results = List().asMutable();
      ma(List([1, 2, 3, 4, 5]), 3).subscribe(
        x => {
          results.push(x);
        },
        noop,
        () => {
          expect(results.toArray()).to.deep.equal([NaN, NaN, 2, 3, 4]);
        }
      );
    });

    it("Should return a SMA of [1,51,2,41,3,31,4,21,5,11,6,1]", () => {
      const results = List().asMutable();
      ma(List([1, 51, 2, 41, 3, 31, 4, 21, 5, 11, 6, 1]), 2).subscribe(
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
  });
});
