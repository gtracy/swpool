const { parseCSVLine, parsePeriod, getDaysOfWeekList } = require('../scripts/compile-schedule');
const moment = require('moment');

describe('compile-schedule Utility Functions', () => {
  describe('parseCSVLine', () => {
    test('splits simple CSV line by commas', () => {
      const line = 'May 23 - June 12,Daily,Open,11:00 AM,12:30 PM,Adult Swim,Wading pool open';
      const parsed = parseCSVLine(line);
      expect(parsed).toEqual([
        'May 23 - June 12',
        'Daily',
        'Open',
        '11:00 AM',
        '12:30 PM',
        'Adult Swim',
        'Wading pool open'
      ]);
    });

    test('joins additional trailing comma fields into the Notes column', () => {
      const line = 'June 13 - June 28,Monday - Friday,Lap / Open,10:30 AM,9:00 PM,Wading pool open,Closes at 7:30 PM, additional info';
      const parsed = parseCSVLine(line);
      expect(parsed).toEqual([
        'June 13 - June 28',
        'Monday - Friday',
        'Lap / Open',
        '10:30 AM',
        '9:00 PM',
        'Wading pool open',
        'Closes at 7:30 PM, additional info'
      ]);
    });
  });

  describe('parsePeriod', () => {
    test('parses a date range correctly', () => {
      const periodStr = 'May 23 - June 12';
      const period = parsePeriod(periodStr);
      expect(period.start.format('YYYY-MM-DD')).toBe('2026-05-23');
      expect(period.end.format('YYYY-MM-DD')).toBe('2026-06-12');
    });

    test('parses a single date correctly', () => {
      const periodStr = 'July 4';
      const period = parsePeriod(periodStr);
      expect(period.start.format('YYYY-MM-DD')).toBe('2026-07-04');
      expect(period.end.format('YYYY-MM-DD')).toBe('2026-07-04');
    });

    test('handles "Closing" keyword as September 1, 2026', () => {
      const periodStr = 'September 1 - Closing';
      const period = parsePeriod(periodStr);
      expect(period.start.format('YYYY-MM-DD')).toBe('2026-09-01');
      expect(period.end.format('YYYY-MM-DD')).toBe('2026-09-01');
    });
  });

  describe('getDaysOfWeekList', () => {
    test('Daily maps to all days', () => {
      expect(getDaysOfWeekList('Daily')).toEqual([
        'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
      ]);
    });

    test('Monday - Friday maps to weekdays', () => {
      expect(getDaysOfWeekList('Monday - Friday')).toEqual([
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday'
      ]);
    });

    test('M-W-F maps to monday, wednesday, friday', () => {
      expect(getDaysOfWeekList('M-W-F')).toEqual(['monday', 'wednesday', 'friday']);
    });

    test('Mon / Wed maps to monday, wednesday', () => {
      expect(getDaysOfWeekList('Mon / Wed')).toEqual(['monday', 'wednesday']);
    });

    test('Single days map correctly', () => {
      expect(getDaysOfWeekList('Saturday')).toEqual(['saturday']);
      expect(getDaysOfWeekList('Sunday')).toEqual(['sunday']);
    });
  });
});
