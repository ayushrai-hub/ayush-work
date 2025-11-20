/**
 * Test suite for the main App component.
 *
 * This test file validates the core application structure and routing functionality.
 * The App component serves as the root container for the entire portfolio application,
 * managing theme context, routing, and overall layout composition.
 *
 * Due to complex component dependencies, extensive mocking is used to isolate
 * the App component's behavior and validate its core responsibilities:
 * - Theme provider integration
 * - Router configuration
 * - SEO/meta-tag management
 * - Layout structure assembly
 *
 * @see ../App.tsx - The main application component
 * @see ../contexts/ThemeContext.tsx - Theme provider
 * @see ../components/GTMProvider.tsx - Analytics integration
 */
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../contexts/ThemeContext';
import App from '../App';
import { vi } from 'vitest';

/**
 * Analytics provider mock for isolated testing.
 *
 * Mocks the GTMProvider component to avoid external dependencies during tests.
 * The GTM provider handles Google Tag Manager integration for tracking and analytics,
 * which is not needed for basic component structure validation.
 */
vi.mock('../components/GTMProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mocked UI components to isolate App structure testing
/**
 * Mock for the 3D hero component.
 * The ThreeJSHero component includes complex Three.js scenes and animations
 * that would increase test complexity and execution time unnecessarily.
 */
vi.mock('../components/ThreeJSHero', () => ({
  default: () => <div>ThreeJSHero</div>
}));

/**
 * Mock for particle background effects.
 * ParticleBackground uses canvas animation and performance-intensive rendering
 * that is not essential for testing the overall application structure.
 */
vi.mock('../components/ParticleBackground', () => ({
  default: () => <div>ParticleBackground</div>
}));

/**
 * Mocks for portfolio section components.
 *
 * Individual section components are mocked to focus testing on the App component's
 * composition and layout rather than each section's internal implementation.
 * The App component orchestrates the portfolio's main content areas.
 */
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

/**
 * React imports and router mocking setup.
 *
 * React is imported to enable JSX usage in mocks. The BrowserRouter is
 * replaced with MemoryRouter for testing to avoid browser history API
 * dependencies and ensure consistent test environment behavior.
 */
import React from 'react';
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

/**
 * Animation library mocking.
 *
 * Framer Motion provides animation components and hooks. For testing purposes,
 * the motion components are replaced with plain HTML elements to focus on
 * layout structure rather than animation behavior.
 */
vi.mock('framer-motion', () => ({
  motion: {
    main: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => <main {...props}>{children}</main>,
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) => <section {...props}>{children}</section>,
  }
}));

/**
 * Test suite for App component core functionality.
 *
 * Focuses on validating the application's fundamental structure and provider
 * composition. Tests ensure the root component properly assembles the necessary
 * context providers and maintains the expected layout hierarchy.
 *
 * @test-environment jsdom
 * @test-framework vitest + react-testing-library
 */
describe('App', () => {
  /**
   * Helper function to render the App component with required providers.
   *
   * Wraps the App component in ThemeProvider and HelmetProvider to simulate
   * the production environment. This ensures proper context and meta-tag
   * management during testing.
   *
   * @returns {RenderResult} - Rendering utilities and container
   */
  const renderApp = () =>
    render(
      <ThemeProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ThemeProvider>
    );

  /**
   * Validates basic application layout structure.
   *
   * Ensures the App component successfully renders the core navigation
   * elements (Header and Footer) that form the application's shell.
   * This test confirms proper component composition and layout foundation.
   *
   * @returns {void} - Test assertion results
   */
  it('should render the main application layout', () => {
    renderApp();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
