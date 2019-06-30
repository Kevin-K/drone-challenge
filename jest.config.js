// This configures jest (test framework) to work with typescript.
// Refer to "Typescript Deep Dive" book for how this works
// https://basarat.gitbooks.io/typescript/docs/testing/jest.html
module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    "transform": {
      "^.+\\.tsx?$": "ts-jest"
    },
  };