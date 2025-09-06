# 🌐 Best Coding Standards & Practices for Modern Portfolio Development

This document outlines the **comprehensive coding standards, practices, and principles** for building a **modern personal/organizational portfolio website**.  
Following these ensures **readable, maintainable, secure, scalable, and optimized** code aligned with **industry standards**.

It also integrates **AI-assisted development practices (e.g., Windsurf, Copilot, Cursor, Codeium, etc.)** to ensure generated code is reliable, tested, and non-hallucinatory.

---

## 1. 🏗️ General Coding Principles

### 1.1 Code Readability
- Use **TypeScript** instead of plain JavaScript for type safety.
- Follow **Airbnb + ESLint + Prettier** coding style.
- Maintain **consistent indentation** (2 spaces).
- Use **descriptive names** for variables, components, and hooks (`ProjectCard.tsx`, `useUserTheme`, not `pc`, `ut`).
- Keep React/Next.js components **small and reusable**.
- Maintain import order:
  ```tsx
  // React and Next.js core
  import React from "react";
  import Link from "next/link";

  // Third-party libraries
  import { motion } from "framer-motion";

  // Internal components
  import { Navbar } from "@/components/layout/Navbar";
  import { Button } from "@/components/ui/Button";
  ```

### 1.2 Documentation
- Add **JSDoc/TSDoc comments** to all functions and components.
- Example:
  ```tsx
  /**
   * Renders a project card with title, description, and links.
   *
   * @param {string} title - Project title.
   * @param {string} description - Short project description.
   * @param {string} url - Link to the live demo or repo.
   */
  const ProjectCard: React.FC<ProjectProps> = ({ title, description, url }) => { ... }
  ```
- Document **API routes** in `docs/api.md`.
- Maintain a **CHANGELOG.md** for project updates.

### 1.3 Modularity
- Use **component-based architecture** (UI components in `/components/ui`, layouts in `/components/layout`).
- Follow **Atomic Design principles** where possible.
- Keep backend services modular (`routes/`, `controllers/`, `services/`, `models/`).

### 1.4 Version Control
- Use **Git with branch strategy**:
  - `main` → production  
  - `develop` → staging  
  - `feature/*` → new features  
  - `fix/*` → bug fixes  
- Use conventional commits:
  ```
  feat: add dark mode toggle
  fix: correct responsive navbar collapse issue
  docs: update setup instructions in README
  ```

---

## 2. ⚛️ Frontend Development Standards

### 2.1 Tech Stack
- **Next.js (React + SSR/SSG)**  
- **TypeScript** for strict typing  
- **TailwindCSS + shadcn/ui + Framer Motion** for styling and animations  

### 2.2 Practices
- Use **Server Components** for static content, **Client Components** for interactivity.
- Keep CSS **utility-first** with Tailwind; avoid inline styles.
- Use **dynamic imports** for large components to reduce bundle size.
- Ensure **accessibility (a11y)** with ARIA attributes and semantic HTML.
- Add **SEO best practices** (meta tags, Open Graph, sitemaps).

---

## 3. ⚡ Backend Development Standards

### 3.1 Tech Stack
- **Node.js + Express (or Next.js API Routes)**  
- **PostgreSQL or MongoDB** with Prisma ORM / Mongoose  
- **JWT or NextAuth** for authentication  

### 3.2 Practices
- Use **RESTful APIs** or **GraphQL** for structured communication.
- Store **secrets & configs** in `.env` (never commit).
- Validate API inputs with **Zod/Yup**.
- Implement **rate limiting** & sanitization for security.
- Use **services pattern**:
  ```
  /api
    /routes
    /controllers
    /services
    /models
  ```

---

## 4. 🚀 Performance Optimization

- Enable **Next.js Image Optimization** (`<Image />`).
- Implement **Code Splitting** & **Lazy Loading**.
- Use **Static Site Generation (SSG)** for static sections (About, Projects).
- Use **Incremental Static Regeneration (ISR)** for frequently updated sections (Blog).
- Apply **caching (Redis, Vercel Edge)** for API responses.
- Optimize **database queries** with indexes & pagination.

---

## 5. 🛡️ Security Best Practices

- Sanitize user inputs (XSS/SQLi prevention).
- Use **Helmet.js** for HTTP headers security.
- Use HTTPS everywhere.
- Store **passwords with bcrypt/argon2**.
- Regularly audit dependencies (`npm audit` / `snyk`).
- Rotate API keys & tokens.

---

## 6. 🧪 Testing & Validation

- **Unit Testing:** Jest + React Testing Library.
- **Integration Testing:** Supertest for API routes.
- **E2E Testing:** Playwright or Cypress.
- Example test:
  ```tsx
  test("renders ProjectCard with correct title", () => {
    render(<ProjectCard title="Portfolio" description="Showcase" url="/demo" />);
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });
  ```
- Run tests in CI/CD pipeline.

---

## 7. 📦 Packaging & Deployment

### 7.1 Project Structure
```bash
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Next.js pages & routes
│   ├── lib/              # Utils & helpers
│   ├── styles/           # Global styles
│   ├── api/              # API routes
│   └── tests/            # Unit & integration tests
├── prisma/               # Database schema
├── .env                  # Environment variables
├── package.json
└── README.md
```

### 7.2 Deployment
- Use **Docker** for consistent environments.
- Deploy with **Vercel** (Next.js native), **Netlify**, or **AWS/GCP/Azure**.
- Maintain staging & production environments.

---

## 8. 🔄 CI/CD Standards

- Use **GitHub Actions** for:
  - Linting (`eslint`, `prettier`)  
  - Running unit tests (`jest`)  
  - Building project (`next build`)  
  - Deploying automatically on merge to `main`  
- Example GitHub Action:
  ```yaml
  name: CI
  on: [push, pull_request]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: 18
        - run: npm install
        - run: npm run lint
        - run: npm run test
        - run: npm run build
  ```

---

## 9. 📊 Monitoring & Logging

- Use **structured logging** (Winston/Pino).
- Log API requests & errors with context.
- Monitor performance (Lighthouse, Google Analytics, Vercel Analytics).
- Enable **error tracking** (Sentry).

---

## 10. 🤖 AI-Assisted Development Standards (Windsurf, Copilot, Cursor, etc.)

### 10.1 Code Generation Best Practices
- **Never commit AI-generated code blindly.**
- Validate AI suggestions by:
  - Running **linting** (`eslint`, `prettier`).
  - Writing **unit tests** for AI-generated functions/components.
  - Reviewing for **hallucinations** (fake libraries, wrong imports, APIs that don’t exist).
- Always cross-check with official documentation (Next.js, Prisma, Tailwind, etc.).

### 10.2 Guardrails & Checks
- Enforce **type safety** (TypeScript will catch most AI mistakes).
- Use **strict mode** in `tsconfig.json`.
- Run **build + test** before pushing AI code.
- Reject AI code if:
  - It introduces **unused dependencies**.
  - It rewrites working code without justification.
  - It uses **anti-patterns** (inline styles, global state misuse, etc.).

### 10.3 Collaboration Workflow
- Open **pull requests for AI-generated changes**.
- Require **manual code review** before merging.
- Add **comments in PR** when AI-generated code is used (e.g., “AI-suggested function, verified and tested locally”).

### 10.4 Testing AI-Generated Code
- Write **edge case tests** to verify correctness.
- Check **cross-browser compatibility** (AI often assumes only Chrome/React).
- Validate **performance impact** of AI code (no unnecessary rerenders, no heavy synchronous calls).

---

## 11. ✅ Checklist Summary

* [ ] Code follows ESLint/Prettier + TypeScript standards  
* [ ] Components are modular and documented  
* [ ] Responsive & accessible design (a11y)  
* [ ] Environment variables managed securely  
* [ ] Database queries optimized  
* [ ] Unit, integration & E2E tests written  
* [ ] SEO & performance optimization in place  
* [ ] CI/CD pipeline with linting & tests enabled  
* [ ] Logs, monitoring & error tracking integrated  
* [ ] Deployment staged, containerized & versioned  
* [ ] **AI-generated code reviewed, tested & verified**  
* [ ] **No hallucinated or fake imports present**  
* [ ] **Manual approval before merging AI code**  

---

## 📌 References
- [Next.js Documentation](https://nextjs.org/docs)  
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)  
- [TailwindCSS Docs](https://tailwindcss.com/docs)  
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)  
- [OWASP Web Security Guidelines](https://owasp.org/)  
- [Responsible AI Development (Google)](https://ai.google/responsibilities/responsible-ai-practices)  

---
