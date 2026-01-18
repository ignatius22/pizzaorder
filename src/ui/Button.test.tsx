import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(
      <BrowserRouter>
        <Button type="primary">Click me</Button>
      </BrowserRouter>
    );
    expect(screen.getByText(/click me/i)).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is true', () => {
    render(
      <BrowserRouter>
        <Button type="primary" disabled={true}>
          Disabled
        </Button>
      </BrowserRouter>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
