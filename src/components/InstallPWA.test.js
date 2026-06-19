import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import InstallPWA from './InstallPWA';
import { gaEvents } from '../analytics';

// Mock analytics
jest.mock('../analytics', () => ({
  gaEvents: {
    buttonClick: jest.fn(),
  },
}));

// Mock Material UI icons
jest.mock('@mui/icons-material/InstallMobile', () => () => <div data-testid="install-icon" />);

describe('InstallPWA Component', () => {
  let matchMediaMock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock for matchMedia (not standalone mode)
    matchMediaMock = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    window.matchMedia = matchMediaMock;
  });

  test('does not render button initially (when supportsPWA is false)', () => {
    const { container } = render(<InstallPWA />);
    expect(container.firstChild).toBeNull();
  });

  test('renders button when beforeinstallprompt event fires', () => {
    render(<InstallPWA />);

    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    beforeInstallPromptEvent.preventDefault = jest.fn();

    act(() => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    // Check that button and icon are visible
    expect(screen.getByText('install app')).toBeInTheDocument();
    expect(screen.getByTestId('install-icon')).toBeInTheDocument();
    expect(beforeInstallPromptEvent.preventDefault).toHaveBeenCalled();
  });

  test('calls gaEvents and prompt when button is clicked', () => {
    render(<InstallPWA />);

    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    beforeInstallPromptEvent.preventDefault = jest.fn();
    beforeInstallPromptEvent.prompt = jest.fn();

    act(() => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });

    const button = screen.getByText('install app');
    fireEvent.click(button);

    expect(gaEvents.buttonClick).toHaveBeenCalledWith('app install');
    expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();
  });

  test('hides button when app is installed (appinstalled event fires)', () => {
    render(<InstallPWA />);

    // First support PWA
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    act(() => {
      window.dispatchEvent(beforeInstallPromptEvent);
    });
    expect(screen.getByText('install app')).toBeInTheDocument();

    // Mock matchMedia to report standalone mode (installed)
    matchMediaMock.mockImplementation(query => ({
      matches: true,
      media: query,
    }));

    // Trigger appinstalled
    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(screen.queryByText('install app')).toBeNull();
  });
});
