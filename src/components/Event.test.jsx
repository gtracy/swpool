import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Event from './Event';

// Mock CardIcon to isolate Event rendering
vi.mock('./CardIcon', () => ({
  default: () => <div data-testid="card-icon" />
}));

// Mock moment to freeze "current time" to 2026-06-01 12:00 PM
vi.mock('moment', async (importOriginal) => {
  const actual = await importOriginal();
  const mockActualMoment = actual.default || actual;
  const mockMoment = (val, format) => {
    if (val === undefined) {
      return mockActualMoment('2026-06-01T12:00:00');
    }
    return mockActualMoment(val, format);
  };
  Object.assign(mockMoment, mockActualMoment);
  return { default: mockMoment };
});

describe('Event Component', () => {
  test('renders active event card correctly if it ends in the future', () => {
    const eventDetails = {
      type: 'open',
      start: '12:30 PM',
      end: '7:00 PM',
      description: 'Open Swim',
      notes: 'Wading pool open'
    };

    render(<Event eventDetails={eventDetails} activeDate="2026-06-01" />);

    // Check texts
    expect(screen.getByText('Open Swim')).toBeInTheDocument();
    expect(screen.getByText('12:30 PM - 7:00 PM')).toBeInTheDocument();
    expect(screen.getByText('Wading pool open')).toBeInTheDocument();
    expect(screen.getByTestId('card-icon')).toBeInTheDocument();
  });

  test('renders past event card correctly if it ended in the past', () => {
    const eventDetails = {
      type: 'open',
      start: '9:00 AM',
      end: '11:00 AM',
      description: 'Morning Swim',
      notes: 'Wading pool open'
    };

    render(<Event eventDetails={eventDetails} activeDate="2026-06-01" />);

    // Past event renders with muted styling: icon, strikethrough time, and description
    expect(screen.getByText('Morning Swim')).toBeInTheDocument();
    expect(screen.getByTestId('card-icon')).toBeInTheDocument();
    // Notes are hidden on past events
    expect(screen.queryByText('Wading pool open')).not.toBeInTheDocument();
  });
});
