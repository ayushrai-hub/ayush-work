interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  service?: string;
}

class EmailService {
  static async sendContactEmail(data: EmailData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        return { success: true, message: result.message };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to send message. Please try again.'
        };
      }
    } catch (error) {
      console.error('Email service error:', error);
      return {
        success: false,
        message: 'Network error. Please check your internet connection and try again.'
      };
    }
  }
}

export default EmailService;
