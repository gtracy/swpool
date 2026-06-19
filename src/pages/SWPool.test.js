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
import { gaEvents } from '../analytics';

// Mock MUI DatePicker to easily trigger onChange in test environment
jest.mock('@mui/x-date-pickers', () => ({
  MobileDatePicker: ({ label, onChange, defaultValue }) => (
    <input
      data-testid="mock-date-picker"
      aria-label={label}
      value={defaultValue ? defaultValue.format('YYYY-MM-DD') : ''}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));


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
  afterEach(() => {
    jest.restoreAllMocks();
  });

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

  test('handles schedule loading failure gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const consoleDirSpy = jest.spyOn(console, 'dir').mockImplementation(() => {});
    
    // Mock loadSchedule to fail for a single call
    jest.spyOn(schedule, 'loadSchedule').mockRejectedValueOnce(new Error('Mock network failure'));

    render(<SWPool />);

    // Wait for the loader to disappear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check that GA event for failure was tracked
    expect(gaEvents.eventOccurred).toHaveBeenCalledWith('sheet load failed');
    expect(consoleErrorSpy).toHaveBeenCalledWith('error loading arrival data');

    consoleErrorSpy.mockRestore();
    consoleDirSpy.mockRestore();
  });

  test('updates active date and day label when date picker changes', async () => {
    render(<SWPool />);

    // Wait for loader to disappear
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    const dateInput = screen.getByLabelText(/monday/i);
    expect(dateInput).toBeInTheDocument();

    // Trigger date change on the date picker input (simulating June 2nd, 2026, which is Tuesday)
    fireEvent.change(dateInput, { target: { value: '06/02/2026' } });

    // Verify day label updates (to tuesday)
    await waitFor(() => {
      expect(screen.getByLabelText(/tuesday/i)).toBeInTheDocument();
    });
  });
});
