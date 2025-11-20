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
