import * as fs from "fs";
import { parseOrder, printHelp } from "./util";

/**
 * Read in arguments
 */
// Ensure arguments are correct
if (process.argv.length < 3) {
  console.error("Invalid arguments.");
  printHelp();
  process.exit(1);
}
const [_node, _program, inputFile] = process.argv;

/**
 * Read in the input file
 */
// TODO: error handling on file read
const orderBuffer = fs.readFileSync(inputFile);

// TODO: stream the data from the buffer. for now just converting to string
const orderStrings = orderBuffer.toString().split("\n");
const orders = orderStrings.map(parseOrder);
console.log(orders);

/**
 * Generate resources: drone(s) and task schedule
 */
//todo
