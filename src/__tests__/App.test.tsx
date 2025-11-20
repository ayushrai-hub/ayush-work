import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../contexts/ThemeContext';
import App from '../App';
import { vi } from 'vitest';

// Mock GTMProvider
vi.mock('../components/GTMProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

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

vi.mock('../components/Header', () => ({
  default: () => <div>Header</div>
}));

vi.mock('../components/Footer', () => ({
  default: () => <div>Footer</div>
}));

vi.mock('../components/AboutMe', () => ({
  default: () => <div>AboutMe</div>
}));

vi.mock('../components/Experience', () => ({
  default: () => <div>Experience</div>
}));

vi.mock('../components/Projects', () => ({
  default: () => <div>Projects</div>
}));

vi.mock('../components/Skills', () => ({
  default: () => <div>Skills</div>
}));

vi.mock('../components/Other', () => ({
  default: () => <div>Other</div>
}));

vi.mock('../components/Contact', () => ({
  default: () => <div>Contact</div>
}));

import React from 'react';
// Mock BrowserRouter to use MemoryRouter in tests
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => {
      const { MemoryRouter } = actual as any;
      return React.createElement(MemoryRouter, null, children);
    },
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    main: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => <main {...props}>{children}</main>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => <section {...props}>{children}</section>,
  }
}));

describe('App', () => {
  const renderApp = () =>
    render(
      <ThemeProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ThemeProvider>
    );

  it('should render the main application layout', () => {
    renderApp();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
