import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Programming from './components/Programming';

// Mock gaEvents to avoid tracking during tests
vi.mock('./analytics', () => ({
  gaEvents: {
    eventOccurred: vi.fn(),
  },
}));

// Mock moment to freeze "current time" to May 20, 2026,
// so that all schedule events (May 30 - Sep 1) are always in the "future"
// and render as active cards with notes.
vi.mock('moment', async (importOriginal) => {
  const actual = await importOriginal();
  const mockActualMoment = actual.default || actual;
  const mockMoment = (val, format) => {
    if (val === undefined) {
      return mockActualMoment('2026-05-20T12:00:00Z');
    }
    return mockActualMoment(val, format);
  };
  Object.assign(mockMoment, mockActualMoment);
  return { default: mockMoment };
});

// Mock window.matchMedia to prevent MUI errors during rendering
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Helper to get specific event card by description and start time
function getEventCard(description, startTime) {
  const headings = screen.queryAllByText(description);
  const card = headings.map(h => h.closest('.card')).find(c => c && c.textContent.includes(startTime));
  return card;
}

describe('Programming Schedule Component Tests', () => {
  test('2026-05-30 (Saturday before restriction period)', () => {
    render(<Programming activeDate="2026-05-30" />);
    
    // Open Swim note should not contain June restrictions, only "Wading pool open"
    const openSwimCard = getEventCard('Open Swim', '12:30 PM');
    expect(openSwimCard).toBeInTheDocument();
    expect(openSwimCard).toHaveTextContent('Wading pool open');
    expect(openSwimCard).not.toHaveTextContent('restricted');

    // Water Aerobics should not be rendered on this day
    const waterAerobics = screen.queryByText('Water Aerobics');
    expect(waterAerobics).not.toBeInTheDocument();
  });

  test('2026-06-01 (Monday during June restriction period)', () => {
    render(<Programming activeDate="2026-06-01" />);
    
    // Open Swim note should contain restriction note but no future dates
    const openSwimCard = getEventCard('Open Swim', '12:30 PM');
    expect(openSwimCard).toBeInTheDocument();
    expect(openSwimCard).toHaveTextContent('Wading pool open. Portion restricted 5-7 PM for Swim/Dive practice (short course format)');
  });

  test('2026-06-08 (Monday transition week for Water Aerobics)', () => {
    render(<Programming activeDate="2026-06-08" />);
    
    // Water Aerobics is now scheduled, but has a TBD note
    const aerobicsCard = getEventCard('Water Aerobics', '12:40 PM');
    expect(aerobicsCard).toBeInTheDocument();
    expect(aerobicsCard).toHaveTextContent('TBD');
    expect(aerobicsCard).not.toHaveTextContent('Starting after June 7th');
  });

  test('2026-06-15 (Monday with standard early closing)', () => {
    render(<Programming activeDate="2026-06-15" />);
    
    // Adult lap swim (5:45 AM) should be "Long course (1-lane)" on Mondays
    const lapSwimCard = getEventCard('Adult lap swim', '5:45 AM');
    expect(lapSwimCard).toBeInTheDocument();
    expect(lapSwimCard).toHaveTextContent('Long course (1-lane)');

    // Wading pool open should close at 7:30 PM
    const wadingCard = getEventCard('Wading pool open', '10:30 AM');
    expect(wadingCard).toBeInTheDocument();
    expect(wadingCard).toHaveTextContent('10:30 AM - 7:30 PM');
    expect(wadingCard).toHaveTextContent('Closes at 7:30 PM');
  });

  test('2026-06-16 (Tuesday with standard hours)', () => {
    render(<Programming activeDate="2026-06-16" />);
    
    // Adult lap swim (5:45 AM) should be "Short course (1-3 lanes)" on Tuesdays
    const lapSwimCard = getEventCard('Adult lap swim', '5:45 AM');
    expect(lapSwimCard).toBeInTheDocument();
    expect(lapSwimCard).toHaveTextContent('Short course (1-3 lanes)');

    // Wading pool open should close at 8:30 PM and not have early closing notes
    const wadingCard = getEventCard('Wading pool open', '10:30 AM');
    expect(wadingCard).toBeInTheDocument();
    expect(wadingCard).toHaveTextContent('10:30 AM - 8:30 PM');
    expect(wadingCard).not.toHaveTextContent('Closes at 7:30 PM');
  });

  test('2026-06-29 (Monday with 6/29 early closing)', () => {
    render(<Programming activeDate="2026-06-29" />);
    
    // Adult swim (11:00 AM) ends before 7:30 PM so should NOT have its time changed, but should say "Closes at 7:30 PM"
    const adultSwimCard = getEventCard('Adult swim', '11:00 AM');
    expect(adultSwimCard).toBeInTheDocument();
    expect(adultSwimCard).toHaveTextContent('11:00 AM - 12:30 PM');
    expect(adultSwimCard).toHaveTextContent('Closes at 7:30 PM');

    // Wading pool open should close at 7:30 PM
    const wadingCard = getEventCard('Wading pool open', '11:00 AM');
    expect(wadingCard).toBeInTheDocument();
    expect(wadingCard).toHaveTextContent('11:00 AM - 7:30 PM');
    expect(wadingCard).toHaveTextContent('Closes at 7:30 PM');
  });

  test('2026-06-30 (Tuesday after 6/29 early closing)', () => {
    render(<Programming activeDate="2026-06-30" />);
    
    // Adult swim (11:00 AM) should not have any early closing notes
    const adultSwimCard = getEventCard('Adult swim', '11:00 AM');
    expect(adultSwimCard).toBeInTheDocument();
    expect(adultSwimCard).toHaveTextContent('11:00 AM - 12:30 PM');
    expect(adultSwimCard).not.toHaveTextContent('Closes at 7:30 PM');
  });

  test('2026-07-09 (Thursday morning lap swim should be cancelled)', () => {
    render(<Programming activeDate="2026-07-09" />);
    
    // Thursday morning lap swim at 5:45 AM should not exist
    const morningLapSwim = getEventCard('Adult lap swim', '5:45 AM');
    expect(morningLapSwim).toBeUndefined();
  });

  test('2026-07-30 (Thursday morning lap swim should be cancelled with NO TH/FR rule)', () => {
    render(<Programming activeDate="2026-07-30" />);
    
    // Thursday has NO TH/FR rule in late July, so morning lap swim is cancelled
    const morningLapSwim = getEventCard('Adult lap swim', '5:45 AM');
    expect(morningLapSwim).toBeUndefined();
  });

  test('2026-08-31 (Monday - August gap day filled with standard schedule)', () => {
    render(<Programming activeDate="2026-08-31" />);
    
    // Wading pool open should close at 7:30 PM (standard Monday early closing)
    const wadingCard = getEventCard('Wading pool open', '10:00 AM');
    expect(wadingCard).toBeInTheDocument();
    expect(wadingCard).toHaveTextContent('10:00 AM - 7:30 PM');
    expect(wadingCard).toHaveTextContent('Closes at 7:30 PM');
  });

  test('2026-09-01 (Tuesday - Special Labor Day / Closing Period schedule)', () => {
    render(<Programming activeDate="2026-09-01" />);
    
    // Adult swim should be scheduled with the special note
    const adultSwimCard = getEventCard('Adult swim', '9:00 AM');
    expect(adultSwimCard).toBeInTheDocument();
    expect(adultSwimCard).toHaveTextContent('9:00 AM - 12:00 PM');
    expect(adultSwimCard).toHaveTextContent(/closing/i);
  });
});
