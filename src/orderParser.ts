import moment from 'moment';
import {isString} from 'lodash';

export type Coordinates = {
    north:number,
    south:number,
    east:number,
    west:number
};

export interface Order {
    orderId: string,
    deliveryCoords: Coordinates,
    orderTime: Date
}

export type TimeParser = (x: string) => Date;
export type CoordinateParser  = (x: string) => Coordinates;
export type OrderParser  = (x: string) => Order;

export const COORD_REGEXP = /^(N|S)([0-9]*)(E|W)([0-9]*)/;

export const parseCoordinates: CoordinateParser = (coordStr: string) => {
    if (!isString(coordStr)) {
        throw new Error("Invalid coordinate format");
    }

    // run the regular expression against the coordinate string
    // force to uppercase for error handling of lower cases.
    const match = COORD_REGEXP.exec(coordStr.toUpperCase());
    if (match == null) {
        throw new Error("Invalid coordinate format");
    }
    const [
        _fullMatch, 
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

    switch (latDirection) {
        case 'N':
            coordinates.north = Number.parseInt(latMagnitude);
            break;
        case 'S':
            coordinates.south = Number.parseInt(latMagnitude);
            break;
        default:
            // never reached, but included for clarity
            throw new Error("Invalid latitude direction");
    }

    switch (lonDirection) {
        case 'E':
            coordinates.east = Number.parseInt(lonMagnitude);
            break;
        case 'S':
            coordinates.west = Number.parseInt(lonMagnitude);
            break;
        default:
            // never reached, but included for clarity
            throw new Error("Invalid longitude direction");
    }

    return coordinates;
};

export const parseTime: TimeParser = (timeStr) => {
    return moment(timeStr.toUpperCase(), "HH:MM:SS").toDate();
}
export const parseOrder: OrderParser = (orderStr) => {
    if (!isString(orderStr)) {
        throw new Error("Invalid order format.");
    }
    const [ orderIdStr, coordStr, timeStr] = orderStr
        // 1. trim out any leading or trailing spaces
        .trim()
        // 2. fix any extra spacing so only 1 space between arguments
        .replace(/\s+/g, ' ')
        // 3. split the arguments by spaces
        .split(' ');

    return {
        orderId: orderIdStr.toUpperCase(),
        deliveryCoords: parseCoordinates(coordStr),
        orderTime: parseTime(timeStr)
    };
}