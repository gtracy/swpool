import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import CardIcon from './CardIcon';

// Mock MUI icons to avoid rendering large SVGs and easily assert on them
vi.mock('@mui/icons-material/Pool', () => ({ default: () => <div data-testid="pool-icon" /> }));
vi.mock('@mui/icons-material/CropFree', () => ({ default: () => <div data-testid="crop-free-icon" /> }));
vi.mock('@mui/icons-material/SmsFailed', () => ({ default: () => <div data-testid="sms-failed-icon" /> }));
vi.mock('@mui/icons-material/School', () => ({ default: () => <div data-testid="school-icon" /> }));
vi.mock('@mui/icons-material/SportsGymnastics', () => ({ default: () => <div data-testid="sports-gymnastics-icon" /> }));
vi.mock('@mui/icons-material/Diversity1', () => ({ default: () => <div data-testid="diversity-icon" /> }));
vi.mock('@mui/icons-material/FamilyRestroom', () => ({ default: () => <div data-testid="family-restroom-icon" /> }));

describe('CardIcon Component', () => {
  test('renders CropFreeIcon for open type', () => {
    const { getByTestId } = render(<CardIcon type="open" />);
    expect(getByTestId('crop-free-icon')).toBeInTheDocument();
  });

  test('renders PoolIcon for team type', () => {
    const { getByTestId } = render(<CardIcon type="team" />);
    expect(getByTestId('pool-icon')).toBeInTheDocument();
  });

  test('renders SchoolIcon for programming type', () => {
    const { getByTestId } = render(<CardIcon type="programming" />);
    expect(getByTestId('school-icon')).toBeInTheDocument();
  });

  test('renders SportsGymnasticsIcon for aerobics type', () => {
    const { getByTestId } = render(<CardIcon type="aerobics" />);
    expect(getByTestId('sports-gymnastics-icon')).toBeInTheDocument();
  });

  test('renders Diversity1Icon for ballet type', () => {
    const { getByTestId } = render(<CardIcon type="ballet" />);
    expect(getByTestId('diversity-icon')).toBeInTheDocument();
  });

  test('renders FamilyRestroomIcon for family type', () => {
    const { getByTestId } = render(<CardIcon type="family" />);
    expect(getByTestId('family-restroom-icon')).toBeInTheDocument();
  });

  test('renders fallback SmsFailed icon for unknown type', () => {
    const { getByTestId } = render(<CardIcon type="unknown-type" />);
    expect(getByTestId('sms-failed-icon')).toBeInTheDocument();
  });
});
