import { inputFileToArray, ERR_INVAL_FILE } from "./inputFileToArray";
describe("inputFileToArray", () => {
  describe("error handling", () => {
    it("throws an error if file does not exist", () => {
      expect(() => {
        inputFileToArray("noFile");
      }).toThrowError(ERR_INVAL_FILE);
    });
  });

  describe("with valid arguments", () => {
    it("splits the file into an array by new line", () => {
      const values = inputFileToArray("src/util/testFile.txt");
      expect(values.length).toEqual(3);
      expect(values[0]).toEqual("line 1");
      expect(values[1]).toEqual("line 2");
      expect(values[2]).toEqual("line 3");
    });
  });
});
