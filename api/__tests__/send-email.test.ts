import { createMocks } from 'node-mocks-http';
import { vi } from 'vitest';
import handler from '../send-email';

// Mock sendgrid
vi.mock('@sendgrid/mail', () => ({
  setApiKey: vi.fn(),
  send: vi.fn().mockResolvedValue({}),
}));

describe('Send Email API', () => {
  const validRequestBody = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message',
    service: 'Web Development'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SENDGRID_API_KEY = 'test-api-key';
    process.env.CONTACT_EMAIL = 'contact@example.com';
    process.env.FROM_EMAIL = 'noreply@example.com';
  });

  it('should return 405 for non-POST methods', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      message: 'Method not allowed'
    });
  });

  it('should return 400 for missing required fields', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Test User',
        // Missing email, subject, message
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Missing required fields');
  });

  it('should return 400 for invalid email format', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ...validRequestBody,
        email: 'invalid-email',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Invalid email format');
  });

  it('should return 500 when SENDGRID_API_KEY is not configured', async () => {
    delete process.env.SENDGRID_API_KEY;

    const { req, res } = createMocks({
      method: 'POST',
      body: validRequestBody,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Email service not configured');
  });

  it('should successfully send email with valid data', async () => {
    const mockSend = vi.mocked(require('@sendgrid/mail').send);

    const { req, res } = createMocks({
      method: 'POST',
      body: validRequestBody,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(true);
    expect(responseData.message).toBe('Message sent successfully!');

    // Verify sendgrid was called with correct data
    expect(mockSend).toHaveBeenCalledWith({
      to: 'contact@example.com',
      from: {
        email: 'noreply@example.com',
        name: 'Portfolio Contact Form'
      },
      subject: 'Portfolio Contact: Test Subject',
      html: expect.stringContaining('Test User'),
      reply_to: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });
  });

  it('should handle service field correctly', async () => {
    const mockSend = vi.mocked(require('@sendgrid/mail').send);

    const { req, res } = createMocks({
      method: 'POST',
      body: validRequestBody,
    });

    await handler(req, res);

    const sentMailData = mockSend.mock.calls[0][0];
    expect(sentMailData.html).toContain('Web Development');
  });

  it('should handle missing service field', async () => {
    const mockSend = vi.mocked(require('@sendgrid/mail').send);

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        ...validRequestBody,
        service: undefined
      },
    });

    await handler(req, res);

    const sentMailData = mockSend.mock.calls[0][0];
    expect(sentMailData.html).toContain('Not specified');
  });

  it('should handle sendgrid errors', async () => {
    const mockSend = vi.mocked(require('@sendgrid/mail').send);
    mockSend.mockRejectedValue(new Error('Sendgrid error'));

    const { req, res } = createMocks({
      method: 'POST',
      body: validRequestBody,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    const responseData = JSON.parse(res._getData());
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe('Failed to send message. Please try again later.');
  });

  it('should use default contact email when CONTACT_EMAIL is not set', async () => {
    delete process.env.CONTACT_EMAIL;

    const mockSend = vi.mocked(require('@sendgrid/mail').send);

    const { req, res } = createMocks({
      method: 'POST',
      body: validRequestBody,
    });

    await handler(req, res);

    const sentMailData = mockSend.mock.calls[0][0];
    expect(sentMailData.to).toBe('ayushrai0211@gmail.com');
  });

  it('should use default from email when FROM_EMAIL is not set', async () => {
    delete process.env.FROM_EMAIL;

    const mockSend = vi.mocked(require('@sendgrid/mail').send);

    const { req, res } = createMocks({
      method: 'POST',
      body: validRequestBody,
    });

    await handler(req, res);

    const sentMailData = mockSend.mock.calls[0][0];
    expect(sentMailData.from.email).toBe('noreply@yourdomain.com');
  });
});
