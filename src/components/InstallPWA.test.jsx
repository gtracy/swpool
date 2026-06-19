import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import InstallPWA from './InstallPWA';
import { gaEvents } from '../analytics';

// Mock analytics
vi.mock('../analytics', () => ({
  gaEvents: {
    buttonClick: vi.fn(),
  },
}));

// Mock Material UI icons
vi.mock('@mui/icons-material/InstallMobile', () => ({
  default: () => <div data-testid="install-icon" />
}));

describe('InstallPWA Component', () => {
  let matchMediaMock;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for matchMedia (not standalone mode)
    matchMediaMock = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
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
    beforeInstallPromptEvent.preventDefault = vi.fn();

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
    beforeInstallPromptEvent.preventDefault = vi.fn();
    beforeInstallPromptEvent.prompt = vi.fn();

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
