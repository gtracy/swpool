import React from 'react';
import { render } from '@testing-library/react';
import CardIcon from './CardIcon';

// Mock MUI icons to avoid rendering large SVGs and easily assert on them
jest.mock('@mui/icons-material/Pool', () => () => <div data-testid="pool-icon" />);
jest.mock('@mui/icons-material/CropFree', () => () => <div data-testid="crop-free-icon" />);
jest.mock('@mui/icons-material/SmsFailed', () => () => <div data-testid="sms-failed-icon" />);
jest.mock('@mui/icons-material/School', () => () => <div data-testid="school-icon" />);
jest.mock('@mui/icons-material/SportsGymnastics', () => () => <div data-testid="sports-gymnastics-icon" />);
jest.mock('@mui/icons-material/Diversity1', () => () => <div data-testid="diversity-icon" />);
jest.mock('@mui/icons-material/FamilyRestroom', () => () => <div data-testid="family-restroom-icon" />);

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
