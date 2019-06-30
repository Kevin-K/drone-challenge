import { parseTime } from './orderParser';

describe("parseTime", () => {
    it('returns a Date object', () => {
        expect(parseTime("12:10:05")).toBeInstanceOf(Date);
    });
    it('correctly captures the hours', () => {
        const orderTime = parseTime("12:10:05");
        expect(orderTime.getHours()).toEqual(12);
    });
    it('correctly captures the minutes', () => {
        const orderTime = parseTime("12:10:05");
        expect(orderTime.getMinutes()).toEqual(10);
    });
    it('correctly captures the seconds', () => {
        const orderTime = parseTime("12:10:05");
        expect(orderTime.getSeconds()).toEqual(5);
    });
});