import { isString } from "util";

/**
 * Coordinate data type.
 */
export type Coordinates = {
  north: number;
  south: number;
  east: number;
  west: number;
};

/**
 * Converts coordinates from a string to a Coordinate object.
 */
export interface CoordinateParser {
  (coordStr: string): Coordinates;
}

/**
 * Coordinate grouping Regular Expression.
 * Matches and groups a given string in the following format:
 * Group 1: (string must start with): "N" or "S"
 * Group 2: any 0 or positive integer
 * Group 3: "E" or "W"
 * Group 4: any 0 or positive integer
 */
export const COORD_REGEXP = /^(N|S)([0-9]*)(E|W)([0-9]*)/;

/**
 * Error constant: Options must be an object
 */
export const ERR_INVAL_COORDS =
  "Coordinate string does not match parsing format.";

/**
 * Coordinate parsing utility.
 * Given a string of the following format a Coordinates object is returned.
 * Format: "<Lat Direction><Lat Magnitude> <Lon Direction><Lon Magnitude>"
 *  - Lat Direction: "N" for north or "S" for south
 *  - Lat Magnitude: any integer 0 or positive
 *  - Lon Direction: "E" for east or "W" for west
 *  - Lon Magnitude: any integer 0 or positive
 */
export const parseCoordinates: CoordinateParser = (coordStr: string) => {
  if (!isString(coordStr)) {
    throw new Error(ERR_INVAL_COORDS);
  }

  // run the regular expression against the coordinate string
  // force to uppercase for error handling of lower cases.
  const match = COORD_REGEXP.exec(coordStr.toUpperCase());
  if (match == null) {
    throw new Error(ERR_INVAL_COORDS);
  }
  const [
    _fullMatch, // unused but always first element from exec
    latDirection,
    latMagnitude,
    lonDirection,
    lonMagnitude
  ] = match;

  const coordinates = {
    north: 0,
    south: 0,
    east: 0,
    west: 0
  };

  if (latDirection === "N") {
    coordinates.north = Number.parseInt(latMagnitude);
  } else {
    coordinates.south = Number.parseInt(latMagnitude);
  }

  if (lonDirection === "E") {
    coordinates.east = Number.parseInt(lonMagnitude);
  } else {
    coordinates.west = Number.parseInt(lonMagnitude);
  }

  return coordinates;
};
