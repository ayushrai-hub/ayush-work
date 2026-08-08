interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
}

export const defaultSEO: SEOMetadata = {
  title: "Ayush Rai",
  description:
    "Ayush Rai — AI-focused software engineer in Bhopal. Work across products, systems, research notes, and experiments. Digital home, not a brochure.",
  keywords:
    "Ayush Rai, AI engineer, software, products, research, Bhopal, RLHF, Open Framework, personal site",
  image: "/IMG_0029.jpeg",
  url: "https://ayush-me.netlify.app",
};
