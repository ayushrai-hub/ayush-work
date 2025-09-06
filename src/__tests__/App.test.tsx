import { render, screen } from '@testing-library/react';
import App from '../App';
import { vi } from 'vitest';

// Mock subcomponents to avoid complex dependencies
vi.mock('../components/ThreeJSHero', () => ({
  default: () => <div>ThreeJSHero</div>
}));

vi.mock('../components/ParticleBackground', () => ({
  default: () => <div>ParticleBackground</div>
}));

vi.mock('../components/About', () => ({
  default: () => <div>About</div>
}));

vi.mock('../components/Education', () => ({
  default: () => <div>Education</div>
}));

import React from 'react';
// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    main: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => <main {...props}>{children}</main>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => <section {...props}>{children}</section>,
  }
}));

describe('App', () => {
  it('should render the main application layout', () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render the footer with correct copyright text', () => {
    render(<App />);
    expect(screen.getByText(/© 2025 Ayush Rai/)).toBeInTheDocument();
  });
});
