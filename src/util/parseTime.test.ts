import { parseTime, ERR_INVAL_TIME, ERR_INVAL_OPTS } from "./parseTime";

describe("parseTime", () => {
  describe("error handling", () => {
    it("throws an error on invalid time argument type", () => {
      // Typescript note: force variable type to "any" with "as any"
      // when testing variables to functions that are strictly typed but
      // the test needs to pass a different type
      // (for example here: parseTime takes a string, but we want to pass a number
      //  for test purposes).
      const invalidInput = 12 as any;
      // Jest note: when testing for Error throws, wrap your test case in a function
      // if it isn't a promise.
      // Ref: https://github.com/facebook/jest/issues/781#issuecomment-193991055
      expect(() => {
        parseTime(invalidInput);
      }).toThrowError(ERR_INVAL_TIME);
    });

    it("throws an error on invalid options argument type", () => {
      const invalidOptions = 12 as any;
      expect(() => {
        parseTime("12:05:05", invalidOptions);
      }).toThrowError(ERR_INVAL_OPTS);
    });
    it("throws an error if input does not match default HH:mm:ss", () => {
      expect(() => {
        parseTime("12-05-05");
      }).toThrowError(ERR_INVAL_TIME);
    });

    it("throws an error if input hours are not valid", () => {
      expect(() => {
        parseTime("25:05:05");
      }).toThrowError(ERR_INVAL_TIME);
    });

    it("throws an error if input minutes are not valid", () => {
      expect(() => {
        parseTime("12:105:05");
      }).toThrowError(ERR_INVAL_TIME);
    });

    it("throws an error if input seconds are not valid", () => {
      expect(() => {
        parseTime("12:05:105");
      }).toThrowError(ERR_INVAL_TIME);
    });

    it("throws an error if input does not match custom format", () => {
      const options = {
        format: "HH-mm-ss"
      };
      expect(() => {
        parseTime("12:05:105", options);
      }).toThrowError(ERR_INVAL_TIME);
    });

    it("does not throw an error on extra characters if strict option off", () => {
      const options = {
        strict: false
      };
      expect(() => {
        parseTime("ORDER12:05:05", options);
      }).not.toThrowError();
    });
  });

  describe("with valid arguments", () => {
    it("returns a Date object", () => {
      expect(parseTime("12:10:05")).toBeInstanceOf(Date);
    });
    it("correctly captures the hours", () => {
      const orderTime = parseTime("12:10:05");
      expect(orderTime.getHours()).toEqual(12);
    });
    it("correctly captures the minutes", () => {
      const orderTime = parseTime("12:10:05");
      expect(orderTime.getMinutes()).toEqual(10);
    });
    it("correctly captures the seconds", () => {
      const orderTime = parseTime("12:59:05");
      expect(orderTime.getSeconds()).toEqual(5);
    });
  });
});
