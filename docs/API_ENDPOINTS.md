# API Endpoints Documentation

This document outlines the available API endpoints for the Ayush Rai Portfolio application.

## Overview

The portfolio application includes a serverless API built on Netlify Functions, providing contact form functionality and other backend features.

## Base URL

In production: `https://ayush-rai-work.netlify.app`
In development: `http://localhost:5173`

## Endpoints

### POST `/api/send-email`

Handles contact form submissions by sending emails using SendGrid.

#### Request

- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "subject": "Project Collaboration Inquiry",
  "message": "Hello, I'm interested in discussing a potential collaboration...",
  "service": "Web Development" // optional
}
```

#### Required Fields

- `name` (string): The sender's full name (2-100 characters)
- `email` (string): Valid email address format
- `subject` (string): Email subject (5-200 characters)
- `message` (string): Message content (10-5000 characters)

#### Optional Fields

- `service` (string): Service interest (e.g., "Web Development", "AI/ML Consulting")

#### Response

##### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

##### Error Responses

**400 Bad Request** - Validation Error
```json
{
  "success": false,
  "message": "Missing required fields" | "Invalid email format"
}
```

**405 Method Not Allowed**
```json
{
  "success": false,
  "message": "Method not allowed"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Failed to send message. Please try again later." | "Email service not configured"
}
```

#### Validation Rules

- **Email Format**: Uses regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Field Length**:
  - `name`: 1-100 characters
  - `email`: 1-254 characters (RFC compliant)
  - `subject`: 1-200 characters
  - `message`: 1-5000 characters

#### Environment Variables

The endpoint requires the following environment variables to be configured:

- `SENDGRID_API_KEY`: SendGrid API key for email sending
- `CONTACT_EMAIL`: Destination email address (defaults to `ayushrai0211@gmail.com`)
- `FROM_EMAIL`: From email address (defaults to `noreply@yourdomain.com`)

#### Security Features

- Input validation for all fields
- Email format validation
- XSS protection through proper content handling
- CORS configuration (if needed)

#### Email Template

The emails are sent with the following HTML template:

- **From**: Portfolio Contact Form <noreply@yourdomain.com>
- **To**: Specified contact email
- **Subject**: "Portfolio Contact: {subject}"
- **HTML Body**: Styled template including contact details, service interest (if provided), and message content
- **Reply-To**: Sender's email address

#### Rate Limiting

Currently no explicit rate limiting is implemented. Consider implementing:
- IP-based rate limiting
- User session-based limiting
- CAPTCHA verification for high-volume submissions

#### Dependencies

- `@sendgrid/mail`: ^8.x.x
- Netlify Functions runtime

#### Error Handling

The API includes comprehensive error handling for:
- Missing or invalid environment variables
- SendGrid service failures
- Network timeouts
- Invalid request methods
- Malformed JSON payloads

#### Testing

API tests are located in `api/__tests__/send-email.test.ts` and include tests for:
- Successful email sending
- Validation failures
- SendGrid service errors
- Invalid request methods

#### Usage Example (Frontend)

```typescript
const submitContactForm = async (formData: ContactFormData) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      // Handle success
      showSuccessMessage(result.message);
    } else {
      // Handle error
      showErrorMessage(result.message);
    }
  } catch (error) {
    // Handle network error
    showErrorMessage('Network error. Please try again.');
  }
};
```

#### Monitoring

Consider implementing monitoring for:
- Email delivery success/failure rates
- Response times
- Error rates
- Usage analytics

---

## Future Endpoints

### Planned APIs

- `GET /api/portfolio-data` - Fetch portfolio content from CMS
- `POST /api/analytics` - Track user interactions
- `GET /api/health` - Health check endpoint

## Deployment

API endpoints are deployed on Netlify Functions with:
- Automatic scaling
- Built-in CDN
- SSL certificates
- Real-time function logs
- Built-in analytics

## Support

For API-related issues or questions:
- Check function logs in Netlify dashboard
- Verify SendGrid API key and email settings
- Ensure all required environment variables are set in Netlify build settings
- Test locally using `netlify dev` before deployment
