import { formatTime } from "./formatTime";

describe("formatTime", () => {
  describe("error handling", () => {
    it("returns Invalid date", () => {
      expect(formatTime("fake" as any)).toEqual("Invalid date");
    });
  });
  describe("with valid arguments", () => {
    it("Returns the time in HH:mm:ss", () => {
      const date = new Date();
      date.setHours(12);
      date.setMinutes(23);
      date.setSeconds(34);
      expect(formatTime(date)).toEqual("12:23:34");
    });
  });
});
