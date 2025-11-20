import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

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
