// Google Analytics 4 setup
export const initGA = () => {
  // Use the provided measurement ID
  const GA_MEASUREMENT_ID = 'G-VBS0YJ07R8';

  if (typeof window === 'undefined') {
    console.log('Google Analytics not initialized - running on server');
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      anonymize_ip: true,
      allow_google_signals: true,
      allow_ad_features: false,
      page_title: document.title,
      page_location: window.location.href
    });
  `;
  document.head.appendChild(script2);

  console.log('Google Analytics 4 initialized with Measurement ID:', GA_MEASUREMENT_ID);
};

// Track page views on route changes (call this when components mount/unmount)
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-VBS0YJ07R8', {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }
};

// Analytics event tracking
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters);
  }
};

// Specific tracking functions for user engagement
export const trackPortfolioInteraction = (action: string, details?: Record<string, any>) => {
  trackEvent(action, {
    category: 'portfolio_interaction',
    ...details
  });
};

export const trackContactForm = (action: 'start' | 'submit' | 'success' | 'error') => {
  trackEvent('contact_form', {
    action: action,
    category: 'engagement'
  });
};

export const trackProjectClick = (projectName: string) => {
  trackEvent('project_view', {
    project_name: projectName,
    category: 'engagement'
  });
};

export const trackSocialClick = (platform: string) => {
  trackEvent('social_click', {
    platform: platform,
    category: 'engagement'
  });
};

export const trackServiceInterest = (service: string) => {
  trackEvent('service_interest', {
    service: service,
    category: 'engagement'
  });
};
