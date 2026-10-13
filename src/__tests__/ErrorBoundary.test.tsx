/**
 * Unit tests for the ErrorBoundary class component's three render outcomes.
 *
 * Verifies that children render normally, that a throwing child shows the
 * "Something went wrong" card when `showUserMessage` is true, and that it
 * renders nothing when `showUserMessage` is false. React logs the thrown errors
 * to the console during these tests; that output is expected.
 *
 * Connects to:
 * - src/components/layout/ErrorBoundary.tsx, which this suite is the only importer of
 *   (the live app does not mount it)
 * - src/lib/securityLogger.ts, called from componentDidCatch (not mocked)
 */
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/layout/ErrorBoundary';

/** Children pass-through and the two fallback modes. */
describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Test component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test component')).toBeInTheDocument();
  });

  it('renders fallback when there is an error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary showUserMessage={true}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders null when there is an error and showUserMessage is false', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { container } = render(
      <ErrorBoundary showUserMessage={false}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(container.firstChild).toBeNull();
  });
});
