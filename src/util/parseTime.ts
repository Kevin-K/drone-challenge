import moment from "moment";
import { isString } from "lodash";
import { isObject } from "util";

/**
 * Optional settings to apply to the TimeParser implementation.
 */
export interface TimeParserOptions {
  /**
   * character representation of the time format.
   */
  format?: string;
  /**
   * Enforce strict format checking, if enabled
   * any characters in the time string other than
   * those matching the format or if the numerical
   * time is invalid an error is thrown.
   */
  strict?: boolean;
}

/**
 * Converts time from a string to a Date object.
 */
export interface TimeParser {
  (time: string, options?: TimeParserOptions): Date;
}

/**
 * Error constant: Input time was not valid
 */
export const ERR_INVAL_TIME = "Time does not match parsing format.";

/**
 * Error constant: Options must be an object
 */
export const ERR_INVAL_OPTS = "Options must be an object.";

/**
 * A time parsing utility.
 * Defaults the format option to "HH:mm:ss" (24 hour time)
 * Defaults the strict option to true
 */
export const parseTime: TimeParser = (time, options = {}) => {
  if (!isString(time)) {
    throw new Error(ERR_INVAL_TIME);
  } else if (!isObject(options)) {
    throw new Error(ERR_INVAL_OPTS);
  }

  // get options, if not provided use defaults
  const { format = "HH:mm:ss", strict = true } = options;

  const parsedMoment = moment(time.toUpperCase(), format, strict);

  if (!parsedMoment.isValid()) {
    throw new Error(ERR_INVAL_TIME);
  }

  return parsedMoment.toDate();
};
