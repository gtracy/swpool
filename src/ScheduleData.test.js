import scheduleData from './schedule.json';
import moment from 'moment';

describe('schedule.json Data Integrity Tests', () => {
  
  test('Basic JSON structure and types', () => {
    expect(scheduleData).toBeInstanceOf(Object);
    expect(Array.isArray(scheduleData)).toBe(false);

    Object.entries(scheduleData).forEach(([dateStr, dateObj]) => {
      // Keys must be valid dates in YYYY-MM-DD format
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(moment(dateStr, 'YYYY-MM-DD', true).isValid()).toBe(true);

      // Value must be an object with an events array
      expect(dateObj).toBeInstanceOf(Object);
      expect(dateObj).toHaveProperty('events');
      expect(Array.isArray(dateObj.events)).toBe(true);
    });
  });

  test('Target date range (May 30, 2026 to September 1, 2026) with no gaps', () => {
    const startLimit = moment('2026-05-30', 'YYYY-MM-DD');
    const endLimit = moment('2026-09-01', 'YYYY-MM-DD');

    // Verify first and last date keys specifically
    const dateKeys = Object.keys(scheduleData).sort();
    expect(dateKeys[0]).toBe('2026-05-30');
    expect(dateKeys[dateKeys.length - 1]).toBe('2026-09-01');

    // Verify no missing days between START and END limits
    let current = moment(startLimit);
    while (current.isSameOrBefore(endLimit)) {
      const currentStr = current.format('YYYY-MM-DD');
      expect(scheduleData).toHaveProperty(currentStr);
      current.add(1, 'day');
    }
  });

  test('Event structure and field validations', () => {
    const allowedTypes = ['open', 'programming', 'aerobics', 'ballet', 'family'];

    Object.entries(scheduleData).forEach(([dateStr, dateObj]) => {
      dateObj.events.forEach((event, index) => {
        const errorContext = `on date ${dateStr} at index ${index}`;

        // Validate presence of required properties
        expect(event).toHaveProperty('dow');
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('start');
        expect(event).toHaveProperty('end');
        expect(event).toHaveProperty('description');
        expect(event).toHaveProperty('notes');

        // Validate types of properties
        expect(typeof event.dow).toBe('string');
        expect(typeof event.type).toBe('string');
        expect(typeof event.start).toBe('string');
        expect(typeof event.end).toBe('string');
        expect(typeof event.description).toBe('string');
        expect(typeof event.notes).toBe('string');

        // Validate event types
        expect(allowedTypes).toContain(event.type);
      });
    });
  });

  test('Day of week (DOW) matches the date key', () => {
    Object.entries(scheduleData).forEach(([dateStr, dateObj]) => {
      const expectedDow = moment(dateStr, 'YYYY-MM-DD').format('dddd').toLowerCase();

      dateObj.events.forEach((event, index) => {
        expect(event.dow).toBe(expectedDow);
      });
    });
  });

  test('Event start/end times format, chronological ordering, and sorting', () => {
    const timePattern = /^(?:1[0-2]|0?[1-9]):[0-5]\d [AP]M$/;

    Object.entries(scheduleData).forEach(([dateStr, dateObj]) => {
      let previousStartMoment = null;

      dateObj.events.forEach((event, index) => {
        const errorContext = `on date ${dateStr} at index ${index}`;

        // Validate time formats
        expect(event.start).toMatch(timePattern);
        expect(event.end).toMatch(timePattern);

        const startMoment = moment(event.start, 'h:mm A');
        const endMoment = moment(event.end, 'h:mm A');

        // Validate that start time is before end time
        expect(startMoment.isBefore(endMoment)).toBe(true);

        // Validate that end time is never later than 8:30 PM
        const maxEndMoment = moment('8:30 PM', 'h:mm A');
        expect(endMoment.isSameOrBefore(maxEndMoment)).toBe(true);

        // Validate sorting order: events must be sorted chronologically
        if (previousStartMoment !== null) {
          expect(startMoment.isSameOrAfter(previousStartMoment)).toBe(true);
        }

        previousStartMoment = startMoment;
      });
    });
  });

});
