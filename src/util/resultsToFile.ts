import fs from "fs";
import { TaskResult } from "../Task/BaseTask";
import moment = require("moment");
export const ERR_INVAL_FILE = "Failed to write file.";
/**
 */
export function resultsToFile(
  totalScore: number,
  results: TaskResult[],
  outputFilePath: string
): void {
  let writeStream = fs.createWriteStream(outputFilePath);
  results.forEach(result => {
    if (result.delivered) {
      writeStream.write(
        `${result.task.id} ${moment(result.startTime).format("HH:mm:ss")}\n`
      );
    } else {
      writeStream.write(`${result.task.id} Could not deliver\n`);
    }
  });
  writeStream.write(`NPS ${totalScore}`);
  writeStream.close();
}
