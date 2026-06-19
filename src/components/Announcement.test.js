import React from 'react';
import { render, screen } from '@testing-library/react';
import Announcement from './Announcement';

// Mock CampaignIcon
jest.mock('@mui/icons-material/Campaign', () => () => <div data-testid="campaign-icon" />);

describe('Announcement Component', () => {
  test('renders Announcement card with correct header and icon', () => {
    render(<Announcement />);
    
    expect(screen.getByText('Announcements!')).toBeInTheDocument();
    expect(screen.getByTestId('campaign-icon')).toBeInTheDocument();
  });
});
