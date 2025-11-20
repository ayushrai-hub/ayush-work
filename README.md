# 🌐 Ayush Rai – Portfolio Website

A modern, dynamic, and interactive personal portfolio website built with **Vite React, Tailwind CSS, and Framer Motion**.

The website showcases **professional experience, projects, skills, certifications, and achievements** while integrating animations, interactivity, and a CMS-driven backend for easy updates.

---

## 🚀 Features

### 🔹 Dynamic Content

- Headless CMS integration (Sanity/Contentful/Strapi) for projects, certifications, and blog posts.
- API fetching via React hooks for dynamic content.

### 🔹 Hero Section

- Dynamic text rotation (e.g., "AI Engineer", "Full-Stack Developer", "Polymath").
- Animated counters (experience years, projects, clients).
- Status indicator with color-coded labels.
- 3D animated particle background using **Three.js / react-three-fiber**.

### 🔹 About Me

- Interactive career timeline with milestones.
- Personal story & personality showcase section.

### 🔹 Education Hub

- Dual-degree details with expandable cards.
- Academic achievements & honors.

### 🔹 Professional Experience

- Role-wise structured experience.
- Experience metrics dashboard with animations.

### 🔹 Skills Matrix

- Categorized technical skills (AI/ML, Web Dev, Cloud, etc.).
- Domain expertise radar chart visualization.
- Non-technical/managerial skills included.

### 🔹 Projects Portfolio

- Project cards with live demo & GitHub links.
- Categorized projects by discipline (AI, Web, etc.).

### 🔹 Certifications & Achievements

- Certifications showcase with links.
- Interactive timeline for awards & recognition.

### 🔹 Other Sections

- Research, Services, Community Contributions.

### 🔹 Interactive Features

- Smooth scrolling (Locomotive Scroll).
- Section transitions & micro-interactions with Framer Motion.
- Scroll-based gradient overlay animation.
- Matrix-style binary rain background (Canvas API).

### 🔹 Backend & Integrations

- Contact form with serverless function (Vercel/Netlify).
- Resume dynamic download feature.
- Google Analytics 4 integration.
- Headless CMS (optional).

### 🔹 Performance & SEO

- Lazy loading for images & components.
- Asset & code optimization.
- Meta tags, Open Graph, structured data.
- CDN delivery (Vercel/Netlify).

### 🔹 Accessibility

- Semantic HTML & ARIA labels.
- Keyboard navigation support.
- Screen reader compatibility.
- High-contrast mode option.

### 🔹 Deployment

- Hosted on **Netlify** (primary) with serverless functions.
- Custom domain with SSL certificate.
- Real-time function logs and analytics.
- Built-in CDN with global edge locations.

---

## 📂 Project Structure

```bash
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── components/         # Reusable UI components
│   ├── components/pages/   # Page components
│   ├── styles/             # Global styles
│   ├── utils/              # Helper functions
│   └── lib/                # CMS/API integration
├── .gitignore
├── package.json
├── tailwind.config.js
├── README.md
└── vite.config.ts
```

---

## ⚙️ Tech Stack

- **Framework:** [Vite](https://vitejs.dev/) with React
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), CSS-in-JS (optional)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **CMS (optional):** Sanity / Contentful / Strapi
- **Charts:** Chart.js / Recharts
- **Deployment:** Vercel / Netlify
- **Contact/Email:** Nodemailer / SendGrid
- **Analytics:** Google Analytics 4

---

## ✅ Development Checklist

- [x] Define project scope and requirements
- [x] Choose tech stack (Vite React, Tailwind, Framer Motion)
- [ ] Implement Hero section with animations
- [ ] Add About Me interactive timeline
- [ ] Create Projects Portfolio with cards & filters
- [ ] Add Certifications showcase
- [ ] Integrate Contact Form (serverless)
- [ ] Implement Resume Download feature
- [ ] Optimize for SEO & performance
- [ ] Add accessibility features
- [ ] Deploy on Netlify with serverless functions
- [ ] Configure Netlify Functions with environment variables
- [ ] Set up continuous deployment via GitHub
- [ ] Test contact form functionality in production

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Netlify CLI (for local development)

### Setup Steps

```bash
# Clone repo
git clone https://github.com/your-username/ayush-portfolio.git

# Navigate into project
cd ayush-portfolio

# Install dependencies
npm install

# Install Netlify CLI globally (for local development)
npm install -g netlify-cli

# Set up environment variables
cp .env.example .env
# Edit .env and fill in your actual API keys and configuration values

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view in your browser.

### Netlify Functions Development

```bash
# Run with Netlify Functions locally
npm run netlify:dev
```

This enables the contact form API endpoint at `http://localhost:8888/.netlify/functions/send-email`

### Environment Variables Required

Create a `.env` file with the following variables:

```bash
# SendGrid API Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Contact Form Settings
CONTACT_EMAIL=ayushrai0211@gmail.com
FROM_EMAIL=noreply@ayush-rai-work.netlify.app
```

---

## 📤 Deployment

### Netlify Deployment (Recommended)

1. **Connect to GitHub**: Import your repository in Netlify dashboard
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add in Netlify dashboard:
   - `SENDGRID_API_KEY`
   - `CONTACT_EMAIL`
   - `FROM_EMAIL`
4. **Deploy**: Automatic deployment on git push

**Or deploy manually:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=dist
```

### Vercel Deployment (Alternative)

```bash
npm run build
vercel --prod
```

**Note**: Netlify is the primary deployment platform with optimized serverless functions.

---

## 🛡️ License

This project is licensed under the MIT License – free to use and modify.

---

## 👤 Author

**Ayush Rai**
📧 [ayushrai0211@gmail.com](mailto:ayushrai0211@gmail.com)
📞 +91-744056794
🔗 [LinkedIn](https://www.linkedin.com/) | [GitHub](https://github.com/) | [Portfolio](#)

---

## ⭐ Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the repo and submit a pull request.

```bash
# Create a new branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "Add new feature"

# Push branch
git push origin feature/your-feature
```

---

## 📈 Roadmap

- [ ] Blog section with MDX support.
- [ ] Dark mode toggle.
- [ ] AI chatbot integration for portfolio Q\&A.
- [ ] Multilingual support (EN/DE/HI).
- [ ] Add e-learning or mini-course modules.

---
