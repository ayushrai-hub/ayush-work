// Profile data for Ayush Rai's portfolio
export type Profile = {
  id: string;
  name: string;
  url: string;
  icon: string;
  domain: 'development' | 'design' | 'data-science' | 'writing' | 'professional' | 'social' | 'portfolio';
  category: string;
  description: string;
};

export interface Domain {
  name: string;
  color: string;
  gradient: string;
  description: string;
}

export const domains: Domain[] = [
  {
    name: 'development',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Programming and coding platforms'
  },
  {
    name: 'design',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Design and creative platforms'
  },
  {
    name: 'data-science',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-500',
    description: 'Data analysis and machine learning platforms'
  },
  {
    name: 'writing',
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-orange-500',
    description: 'Writing and content platforms'
  },
  {
    name: 'professional',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-blue-500',
    description: 'Professional networking platforms'
  },
  {
    name: 'portfolio',
    color: 'bg-teal-500',
    gradient: 'from-teal-500 to-cyan-500',
    description: 'Portfolio and personal websites'
  },
  {
    name: 'social',
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-500',
    description: 'Social media platforms'
  }
];

export const profiles: Profile[] = [
  // Development & Coding
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/ayushrai-hub',
    icon: 'github',
    category: 'Code Hosting',
    description: 'Explore my open-source projects and contributions',
    domain: 'development'
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    url: 'https://leetcode.com/ayushrai0211',
    icon: 'code',
    category: 'Coding Practice',
    description: 'Check out my problem-solving skills and solutions',
    domain: 'development'
  },
  {
    id: 'unstop',
    name: 'Unstop',
    url: 'https://unstop.com/u/ayushrai4939',
    icon: 'award',
    category: 'Competitions',
    description: 'View my participation in coding competitions',
    domain: 'development'
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/user/ayushrai0211/',
    icon: 'code',
    category: 'Coding Practice',
    description: 'Check out my coding solutions and articles',
    domain: 'data-science'
  },

  // Data Science & Analytics
  {
    id: 'kaggle',
    name: 'Kaggle',
    url: 'https://www.kaggle.com/ayushrai02',
    icon: 'bar-chart-2',
    category: 'Data Science',
    description: 'Explore my data science projects and notebooks',
    domain: 'data-science'
  },
  {
    id: 'data-science-portfolio',
    name: 'Data Science Portfolio',
    url: 'https://www.datascienceportfol.io/ayushrai0211',
    icon: 'database',
    category: 'Portfolio',
    description: 'My curated data science projects and case studies',
    domain: 'data-science'
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    url: 'https://huggingface.co/ayushrai02',
    icon: 'robot',
    category: 'AI/ML Models',
    description: 'Check out my AI models and contributions on Hugging Face',
    domain: 'data-science'
  },

  // Design & Creative
  {
    id: 'behance',
    name: 'Behance',
    url: 'https://www.behance.net/ayushrai17',
    icon: 'image',
    category: 'Design Portfolio',
    description: 'View my creative design projects and artwork',
    domain: 'design'
  },
  {
    id: 'designcrowd',
    name: 'DesignCrowd',
    url: 'https://www.designcrowd.com/designer/1663180/ayushrai02/about',
    icon: 'palette',
    category: 'Design Marketplace',
    description: 'Explore my design services and completed projects',
    domain: 'design'
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    url: 'https://dribbble.com/ayushrai',
    icon: 'droplet',
    category: 'UI/UX Design',
    description: 'Check out my UI/UX design projects',
    domain: 'design'
  },

  // Writing & Content
  {
    id: 'medium',
    name: 'Medium',
    url: 'https://medium.com/@ayushrai0211',
    icon: 'book-open',
    category: 'Technical Blog',
    description: 'Read my technical articles and stories',
    domain: 'writing'
  },
  {
    id: 'substack',
    name: 'Substack',
    url: 'https://substack.com/@ayushrai02',
    icon: 'book-open',
    category: 'Newsletter',
    description: 'Subscribe to my newsletter and articles',
    domain: 'writing'
  },
  {
    id: 'quora',
    name: 'Quora',
    url: 'https://www.quora.com/profile/Ayush-Rai-751',
    icon: 'help-circle',
    category: 'Q&A Platform',
    description: 'Share knowledge and get answers to questions',
    domain: 'writing'
  },
  {
    id: 'blogger',
    name: 'Blogger',
    url: 'https://ayushrai02.blogspot.com/',
    icon: 'edit-3',
    category: 'Personal Blog',
    description: 'My personal thoughts and experiences',
    domain: 'writing'
  },

  // Professional Networks
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/ayushrai02/',
    icon: 'linkedin',
    category: 'Professional Network',
    description: 'Connect with me professionally',
    domain: 'professional'
  },
  {
    id: 'salesforce-trailblazer',
    name: 'Salesforce Trailblazer',
    url: 'https://www.salesforce.com/trailblazer/ayushr02',
    icon: 'cloud',
    category: 'Certifications',
    description: 'My Salesforce certifications and badges',
    domain: 'professional'
  },
  {
    id: 'braintrust',
    name: 'Braintrust',
    url: 'https://app.usebraintrust.com/talent/1859806/',
    icon: 'briefcase',
    category: 'Freelance Network',
    description: 'Connect with top-tier clients and projects',
    domain: 'professional'
  },
  {
    id: 'workana',
    name: 'Workana',
    url: 'https://www.workana.com/freelancer/052bc40cbb5e205f5b39bbf629409be3',
    icon: 'briefcase',
    category: 'Freelance',
    description: 'Find freelance opportunities and projects',
    domain: 'professional'
  },
  {
    id: 'guru',
    name: 'Guru',
    url: 'https://www.guru.com/freelancers/ayushrai02',
    icon: 'briefcase',
    category: 'Freelance',
    description: 'Connect with clients for freelance work',
    domain: 'professional'
  },
  {
    id: 'codementor',
    name: 'Codementor',
    url: 'https://www.codementor.io/@ayushrai188327',
    icon: 'briefcase',
    category: 'Mentorship',
    description: 'Mentor and get mentored by developers',
    domain: 'professional'
  },
  {
    id: 'lemonio',
    name: 'Lemon.io',
    url: 'https://magic.lemon.io/share/candidate?id=68c09bc7d31295bad67a375f&availability=Full-time%20only',
    icon: 'briefcase',
    category: 'Job Board',
    description: 'Connect with startups and companies',
    domain: 'professional'
  },
  {
    id: 'producthunt',
    name: 'ProductHunt',
    url: 'https://www.producthunt.com/@ayush_rai02',
    icon: 'briefcase',
    category: 'Product Discovery',
    description: 'Discover and share amazing products',
    domain: 'professional'
  },
  {
    id: 'upwork',
    name: 'Upwork',
    url: 'https://www.upwork.com/freelancers/~0154ec8cf0990e80bc?mp_source=share',
    icon: 'briefcase',
    category: 'Freelance',
    description: 'Hire me for development projects',
    domain: 'professional'
  },
  {
    id: 'fiverr',
    name: 'Fiverr',
    url: 'https://www.fiverr.com/ayush_rai02?public_mode=true',
    icon: 'briefcase',
    category: 'Freelance',
    description: 'Find me for creative and development services',
    domain: 'professional'
  },
  {
    id: 'peopleperhour',
    name: 'PeoplePerHour',
    url: 'https://www.peopleperhour.com/freelancer/ayush-rai-zymqwwmm',
    icon: 'briefcase',
    category: 'Freelance',
    description: 'Hire me for development and tech projects',
    domain: 'professional'
  },

  // Portfolio & Personal Sites
  {
    id: 'notion-portfolio',
    name: 'Notion Portfolio',
    url: 'https://www.notion.so/Ayush-s-Portfolio-5d069b2fa8b64d7e8b939a0c9b946e7b',
    icon: 'layout-grid',
    category: 'Digital Portfolio',
    description: 'My comprehensive work portfolio',
    domain: 'portfolio'
  },
  {
    id: 'super-site',
    name: 'Super Site',
    url: 'https://ayush-rai.super.site/',
    icon: 'globe',
    category: 'Personal Website',
    description: 'My personal website and blog',
    domain: 'portfolio'
  },
  {
    id: 'linktree',
    name: 'Linktree',
    url: 'https://linktr.ee/ayush_rai02',
    icon: 'link',
    category: 'Link Hub',
    description: 'All my important links in one place',
    domain: 'portfolio'
  },

  // Social Media
  {
    id: 'twitter',
    name: 'Twitter / X',
    url: 'https://x.com/AyushRai0211',
    icon: 'twitter',
    category: 'Microblogging',
    description: 'Follow me for updates and thoughts',
    domain: 'social'
  },
  {
    id: 'bluesky',
    name: 'Bluesky',
    url: 'https://bsky.app/profile/ayush-rai.bsky.social',
    icon: 'globe',
    category: 'Microblogging',
    description: 'Follow me for decentralized social networking',
    domain: 'social'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/ayush_rai02/',
    icon: 'instagram',
    category: 'Photos & Stories',
    description: 'See my personal moments and stories',
    domain: 'social'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/people/Ayush-Rai/pfbid02ha7vx1uEQ8tgakypf3A5U7uzpgJykuEVQffwPPqy9BnLhmz1g4aTeE93SdFuAvH1l/',
    icon: 'facebook',
    category: 'Social Network',
    description: 'Connect with me on Facebook',
    domain: 'social'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    url: 'https://api.whatsapp.com/send/?phone=7440567944&text&type=phone_number&app_absent=0',
    icon: 'message-circle',
    category: 'Messaging',
    description: 'Send me a message on WhatsApp',
    domain: 'social'
  }
];
