import sgMail from '@sendgrid/mail';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

type MailResponse = {
  status: (code: number) => MailResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

type MailRequest = {
  method?: string;
  httpMethod?: string;
  body?: unknown;
  json?: () => Promise<unknown>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function finish(
  res: MailResponse | undefined,
  status: number,
  payload: unknown,
) {
  if (res && typeof res.status === 'function') {
    for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
    if (payload == null) {
      res.status(status).end();
      return;
    }
    res.status(status).json(payload);
    return;
  }
  return new Response(payload == null ? null : JSON.stringify(payload), {
    status,
    headers,
  });
}

async function readJsonBody(event: MailRequest): Promise<unknown> {
  const body = event.body;
  if (typeof body === 'string') return body ? JSON.parse(body) : {};
  if (body && typeof body === 'object' && typeof (body as { getReader?: unknown }).getReader !== 'function') {
    return body;
  }
  if (typeof event.json === 'function') return event.json();
  return {};
}

export default async function handler(event: MailRequest, res?: MailResponse) {
  const method = (event.method || event.httpMethod || 'GET').toUpperCase();

  if (method === 'OPTIONS') return finish(res, 204, null);
  if (method !== 'POST') {
    return finish(res, 405, { message: 'Method not allowed' });
  }

  try {
    const parsed = await readJsonBody(event);
    const { name, email, subject, message, service } = (parsed ?? {}) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
      service?: string;
    };

    if (!name || !email || !subject || !message) {
      return finish(res, 400, {
        success: false,
        message: 'Missing required fields',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return finish(res, 400, {
        success: false,
        message: 'Invalid email format',
      });
    }

    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error('SENDGRID_API_KEY not configured');
      return finish(res, 500, {
        success: false,
        message: 'Email service not configured',
      });
    }

    sgMail.setApiKey(sendgridApiKey);

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);
    const safeService = escapeHtml(service || 'Not specified');

    await sgMail.send({
      to: process.env.CONTACT_EMAIL || 'ayushrai0211@gmail.com',
      from: {
        email: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        name: 'Portfolio Contact Form',
      },
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact Details:</h3>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
            <p><strong>Service Interest:</strong> ${safeService}</p>
          </div>

          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

          <p style="color: #64748b; font-size: 14px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
      replyTo: {
        email,
        name,
      },
    });

    return finish(res, 200, {
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (error) {
    const message = error instanceof SyntaxError
      ? 'Invalid email payload'
      : 'Failed to send message. Please try again later.';
    if (!(error instanceof SyntaxError)) console.error('Email service error:', error);
    return finish(res, error instanceof SyntaxError ? 400 : 500, {
      success: false,
      message,
    });
  }
}
