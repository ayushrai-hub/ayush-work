import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Contact from '../components/Contact';
import * as emailService from '../lib/emailService';
import * as analytics from '../lib/analytics';

vi.mock('../lib/emailService');
vi.mock('../lib/analytics');
vi.mock('react-intersection-observer', () => ({
  useInView: () => [vi.fn(), true]
}));

describe('Contact', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the contact section', () => {
    render(<Contact />);
    expect(screen.getByText("Let's Work")).toBeInTheDocument();
    expect(screen.getByText('Send Me a Message')).toBeInTheDocument();
  });

  it('should update form data on input change', async () => {
    render(<Contact />);
    const nameInput = screen.getByLabelText(/Your Name/);
    await user.type(nameInput, 'John Doe');
    expect(nameInput).toHaveValue('John Doe');
  });

  it('should show error message when form submission fails', async () => {
    const mockSendEmail = vi.fn().mockResolvedValue({ success: false, message: 'Test error' });
    vi.mocked(emailService.default.sendContactEmail).mockImplementation(mockSendEmail);

    render(<Contact />);

    await user.type(screen.getByLabelText(/Your Name/), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/), 'test@example.com');
    await user.type(screen.getByLabelText(/Subject/), 'Test subject');
    await user.type(screen.getByLabelText(/Message/), 'Test message');

    const submitButton = screen.getByRole('button', { name: /Send Message/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });
  });

  it('should show success message when form submission succeeds', async () => {
    const mockSendEmail = vi.fn().mockResolvedValue({ success: true, message: 'Test success' });
    vi.mocked(emailService.default.sendContactEmail).mockImplementation(mockSendEmail);

    render(<Contact />);

    await user.type(screen.getByLabelText(/Your Name/), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/), 'test@example.com');
    await user.type(screen.getByLabelText(/Subject/), 'Test subject');
    await user.type(screen.getByLabelText(/Message/), 'Test message');

    const submitButton = screen.getByRole('button', { name: /Send Message/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Test success')).toBeInTheDocument();
    });
  });

  // More tests can be added for contact info, social links, etc.
});
