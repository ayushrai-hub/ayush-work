interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
}

export const defaultSEO: SEOMetadata = {
  title: "Ayush Rai · AI Engineer & AI Product Builder",
  description:
    "Ayush Rai, AI engineer and AI product builder. LLM evaluation, preference feedback, and software products with the limits written down.",
  keywords:
    "Ayush Rai, AI engineer, software, products, research, remote, RLHF, Open Framework, personal site",
  image: "/IMG_0029.jpeg",
  url: "https://www.ayushrai.site",
};
