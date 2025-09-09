interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
}

export const defaultSEO: SEOMetadata = {
  title: "Ayush Rai - AI & Full-Stack Developer Portfolio",
  description: "Experienced AI/ML Engineer and Full-Stack Developer specializing in React, Python, and machine learning. Explore my projects, skills, and get in touch for your next project.",
  keywords: "AI, Machine Learning, React, Python, Full-Stack Developer, Data Science, Web Development, Portfolio, Profiles, Ayush Rai, Connect, Socials",
  image: "/profile-image.jpeg",
  url: "https://ayush-me.netlify.app"
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ayush Rai",
  "jobTitle": "AI & Full-Stack Developer",
  "description": "Experienced AI/ML Engineer and Full-Stack Developer specializing in React, Python, and machine learning",
  "url": "https://ayush-me.netlify.app",
  "image": "/profile-image.jpeg",
  "sameAs": [
    "https://github.com/ayushrai-hub",
    "https://linkedin.com/in/ayushrai02"
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Python",
    "React",
    "JavaScript",
    "TypeScript",
    "Web Development",
    "Data Science",
    "Computer Vision"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bhopal",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-7440567944",
    "email": "ayushrai0211@gmail.com",
    "contactType": "Professional"
  }
};

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ayush Rai Portfolio",
  "url": "https://ayush-me.netlify.app",
  "logo": "/profile-image.jpeg",
  "description": "Professional portfolio of Ayush Rai - AI & Full-Stack Developer"
};
