import React from 'react';

// Mock window.matchMedia before imports
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SWPool from './SWPool';
import { schedule } from '../schedule';


// Mock moment to freeze current date to June 1st, 2026 (a valid date within our range)
jest.mock('moment', () => {
  const mockActualMoment = jest.requireActual('moment');
  const mockMoment = (val, format) => {
    if (val === undefined) {
      return mockActualMoment('2026-06-01T12:00:00');
    }
    return mockActualMoment(val, format);
  };
  Object.assign(mockMoment, mockActualMoment);
  return mockMoment;
});

// Mock analytics
jest.mock('../analytics', () => ({
  gaEvents: {
    eventOccurred: jest.fn(),
  },
}));




describe('SWPool Page Integration Tests', () => {
  test('renders SWPool page, shows loader, and loads initial schedule', async () => {
    render(<SWPool />);

    // Initially, it shows progress bar / loading state
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();

    // Wait for the loader to disappear and layout to render
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Verify header/menu element is rendered (contains the date label picker)
    expect(screen.getByLabelText(/monday/i)).toBeInTheDocument();

    // Verify first event is displayed
    expect(screen.getByText('Adult Swim')).toBeInTheDocument();
    expect(screen.getByText('11:00 AM - 12:30 PM')).toBeInTheDocument();
    expect(screen.getByText('Wading pool open')).toBeInTheDocument();
  });
});
