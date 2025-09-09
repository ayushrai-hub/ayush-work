# Google Tag Manager Implementation Guide

## Overview

Google Tag Manager (GTM) has been successfully implemented in your portfolio website with a robust, environment-variable-based configuration that supports both development and production environments.

## Implementation Details

### 1. HTML Integration

The GTM code has been added to `index.html` in two locations:

**Head Section** (lines 27-33):
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

**Body Section** (lines 43-46):
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### 2. Environment Configuration

Added GTM container ID to `.env.example`:
```env
# Google Tag Manager
VITE_GTM_ID=GTM-XXXXXXX
```

### 3. React Integration

**GTM Provider Component** (`src/components/GTMProvider.tsx`):
- Initializes GTM dataLayer
- Dynamically loads GTM script with environment variable
- Wraps the entire application

**GTM Utilities** (`src/utils/gtm.ts`):
- `initGTM()` - Initialize dataLayer
- `gtmPush()` - Push events to dataLayer
- `trackPageView()` - Track page views
- `trackEvent()` - Track custom events
- `trackFormSubmission()` - Track form submissions
- `trackButtonClick()` - Track button clicks
- `trackDownload()` - Track file downloads
- `trackExternalLink()` - Track external link clicks
- `trackScrollDepth()` - Track scroll depth

**Custom Hook** (`src/hooks/useGTM.ts`):
Provides easy-to-use methods for tracking throughout the application.

## Setup Instructions

### 1. Get Your GTM Container ID

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new container or use an existing one
3. Copy your container ID (format: GTM-XXXXXXX)

### 2. Configure Environment Variables

Create a `.env` file in the project root:
```env
VITE_GTM_ID=GTM-YOUR_ACTUAL_ID
```

### 3. Update HTML (if needed)

Replace `GTM-XXXXXXX` in `index.html` with your actual container ID:
- Line 32: Update the GTM script
- Line 44: Update the noscript iframe

## Usage Examples

### Basic Event Tracking

```tsx
import { useGTM } from '../hooks/useGTM';

const MyComponent = () => {
  const { trackButton, trackForm, trackCustomEvent } = useGTM();

  const handleButtonClick = () => {
    trackButton('hero_cta_button', 'hero_section');
    // Your button logic here
  };

  const handleFormSubmit = (success: boolean) => {
    trackForm('contact_form', success);
    // Your form logic here
  };

  const handleCustomEvent = () => {
    trackCustomEvent('portfolio_project_view', {
      project_name: 'AI Chatbot',
      project_category: 'AI/ML'
    });
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Get Started</button>
      {/* Your component JSX */}
    </div>
  );
};
```

### Page View Tracking

```tsx
import { useEffect } from 'react';
import { useGTM } from '../hooks/useGTM';

const AboutPage = () => {
  const { trackPage } = useGTM();

  useEffect(() => {
    trackPage('/about', 'About - Ayush Rai');
  }, [trackPage]);

  return <div>About content</div>;
};
```

### Download Tracking

```tsx
const ResumeDownload = () => {
  const { trackFileDownload } = useGTM();

  const handleDownload = () => {
    trackFileDownload('ayush_rai_resume.pdf', 'pdf');
    // Trigger download
  };

  return <button onClick={handleDownload}>Download Resume</button>;
};
```

## Common GTM Events to Track

### Portfolio-Specific Events

1. **Hero Section Interactions**
   - CTA button clicks
   - Social media link clicks
   - Resume download

2. **Project Portfolio**
   - Project card views
   - Live demo clicks
   - GitHub repository visits

3. **Contact Form**
   - Form submissions
   - Form validation errors
   - Success/failure states

4. **Skills & Experience**
   - Skills category expansions
   - Certification link clicks
   - Timeline interactions

5. **Navigation**
   - Menu item clicks
   - Scroll depth tracking
   - Section visibility

## GTM Container Setup Recommendations

### Recommended Tags to Create in GTM:

1. **Google Analytics 4**
   - Configuration tag with your GA4 measurement ID
   - Page view events
   - Custom events

2. **Facebook Pixel** (if needed)
   - Base code
   - Custom conversions

3. **LinkedIn Insight Tag** (for professional portfolio)

### Recommended Triggers:

1. **Page View** - All Pages
2. **Button Clicks** - Specific button classes/IDs
3. **Form Submissions** - Contact forms
4. **File Downloads** - Resume, portfolio files
5. **External Links** - Social media, GitHub, etc.

### Recommended Variables:

1. **Page URL**
2. **Page Title**
3. **Click Element**
4. **Form Element**
5. **Custom Event Parameters**

## Testing & Debugging

### 1. GTM Preview Mode
- Use GTM's preview mode to test events
- Check if events are firing correctly

### 2. Browser Developer Tools
```javascript
// Check if dataLayer exists
console.log(window.dataLayer);

// Check recent events
console.log(window.dataLayer.slice(-5));
```

### 3. GTM Debug Extension
Install the Google Tag Assistant browser extension for easier debugging.

## Production Deployment

1. Ensure your `.env` file contains the correct GTM container ID
2. Test all tracking events in GTM preview mode
3. Publish your GTM container
4. Verify events in Google Analytics (if connected)

## Security & Privacy

- GTM respects user privacy settings
- Consider implementing cookie consent management
- Ensure GDPR compliance if targeting EU users
- Use GTM's built-in consent mode for enhanced privacy

## Troubleshooting

### Common Issues:

1. **Events not firing**: Check GTM container ID and network requests
2. **Duplicate events**: Ensure GTM is only loaded once
3. **Missing dataLayer**: Verify GTMProvider is wrapping the app
4. **Environment variables**: Ensure VITE_GTM_ID is properly set

### Debug Commands:
```javascript
// Check if GTM is loaded
console.log(typeof window.gtag);

// Check dataLayer
console.log(window.dataLayer);

// Manual event push
window.dataLayer.push({
  event: 'test_event',
  custom_parameter: 'test_value'
});
```

## Next Steps

1. Replace `GTM-XXXXXXX` with your actual container ID
2. Set up your GTM container with appropriate tags and triggers
3. Test all tracking events
4. Connect to Google Analytics 4 for comprehensive analytics
5. Implement additional tracking as needed for your portfolio goals
