import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Contact from '../components/Contact';

// Mock Formspree fetch globally since we can't mock individual fetch calls easily in tests
const fetchMock = vi.fn();
global.fetch = fetchMock;

vi.mock('react-intersection-observer', () => ({
  useInView: () => [vi.fn(), true]
}));

describe('Contact Form with Formspree', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful fetch response by default
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true, success: true }),
    } as any);
  });

  it('should render the contact section', () => {
    render(<Contact />);
    expect(screen.getByText("Let's Work")).toBeInTheDocument();
    expect(screen.getByText('Send Me a Message')).toBeInTheDocument();
  });

  it('should have form element', () => {
    render(<Contact />);
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('should have all input fields with correct name attributes', () => {
    render(<Contact />);
    expect(screen.getByLabelText(/Your Name/)).toHaveAttribute('name', 'name');
    expect(screen.getByLabelText(/Email Address/)).toHaveAttribute('name', 'email');
    expect(screen.getByLabelText(/Subject/)).toHaveAttribute('name', 'subject');
    expect(screen.getByLabelText(/Message/)).toHaveAttribute('name', 'message');
    expect(screen.getByLabelText(/Service Interest/)).toHaveAttribute('name', 'service');
  });

  it('should update form data on input change', () => {
    render(<Contact />);
    const nameInput = screen.getByLabelText(/Your Name/);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    expect(nameInput).toHaveValue('John Doe');
  });

  it('should show success message when Formspree submission succeeds', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    } as any);

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/Your Name/), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/), { target: { value: 'Test subject' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Test message' } });

    const submitButton = screen.getByRole('button', { name: /Send Message/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully. I\'ll get back to you soon.')).toBeInTheDocument();
    });

    // Check that fetch was called with correct Formspree endpoint and data
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/mandaogr',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          subject: 'Test subject',
          message: 'Test message',
          service: '',
        }),
      })
    );
  });

  it('should show retry button when Formspree submission fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
    } as any);

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/Your Name/), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/), { target: { value: 'Test subject' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Test message' } });

    const submitButton = screen.getByRole('button', { name: /Send Message/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message (400). Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('should handle Formspree rate limiting (429 errors)', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 429,
    } as any);

    render(<Contact />);

    fireEvent.change(screen.getByLabelText(/Your Name/), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/), { target: { value: 'Test subject' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Test message' } });

    const submitButton = screen.getByRole('button', { name: /Send Message/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Too many requests. Please try again later.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('should clear form after successful submission', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    } as any);

    render(<Contact />);

    const nameInput = screen.getByLabelText(/Your Name/);
    const emailInput = screen.getByLabelText(/Email Address/);
    const subjectInput = screen.getByLabelText(/Subject/);
    const messageInput = screen.getByLabelText(/Message/);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const submitButton = screen.getByRole('button', { name: /Send Message/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Thank you! Your message has been sent successfully. I\'ll get back to you soon.')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(subjectInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });
});
