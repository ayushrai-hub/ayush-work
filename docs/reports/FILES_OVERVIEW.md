# Files Overview — Ayush Rai Portfolio Website

## Project Architecture

This is a modern React/TypeScript portfolio website for Ayush Rai, featuring a **Single Page Application (SPA)** architecture with dynamic routing. The project uses **Vite** as the build tool, **Tailwind CSS** for styling, and **Framer Motion** for animations. It includes comprehensive analytics integration, SEO optimization, and responsive design.

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom CSS variables
- **Animations**: Framer Motion, React Intersection Observer
- **3D Graphics**: Three.js with React Three Fiber
- **Analytics**: Google Tag Manager, Custom analytics
- **Deployment**: Netlify/Vercel
- **Testing**: React Testing Library, Jest, Playwright E2E

---

## Directory Structure

### 🔵 Root Level (`/`) — Important
| File | Purpose | Inputs / Outputs | Environment / Notes | Consumers / Related |
|------|---------|-------------------|-------------------|-------------------|
| `package.json` | Node.js project configuration and dependency management | NPM/Yarn commands → dependency resolution | Requires Node.js 18+; automatically generated during `npm install` | Used by all build tools and package managers |
| `vite.config.ts` | Vite build configuration for development and production bundling | Environment variables, build settings → optimized bundles | Configures React plugin, TypeScript paths, deployment settings | `src/main.tsx`, `index.html`, `netlify.toml` |
| `tsconfig.json` | TypeScript compiler configuration for type checking | Compiler options → JavaScript output | Strict type checking enabled, includes React JSX types | All `.tsx` and `.ts` files |
| `tailwind.config.js` | Tailwind CSS configuration with custom design tokens | Color schemes, responsive breakpoints → CSS classes | Extendable theme system with dark mode support | All component files, `src/index.css` |
| `netlify.toml` | Netlify deployment configuration | Build commands, redirect rules → deployment settings | Override defaults for SPA routing and headers | Netlify CI/CD pipeline |
| `README.md` | Project documentation and setup instructions | Developer onboarding → project understanding | Maintained alongside code changes | New contributors and CI systems |

### 📁 `src/` — Critical (Main Application)
| File | Purpose | Inputs / Outputs | Environment / Notes | Consumers / Related |
|------|---------|-------------------|-------------------|-------------------|
| `src/main.tsx` | React application entry point and root rendering | DOM element → hydrated React app | Mounts to `#root` element defined in `index.html` | `src/App.tsx`, `index.html` |
| `src/App.tsx` | Main application component with routing and providers | URL path → rendered page components | Includes GTM provider, theme context, router configuration | All page components, routing logic |
| `src/index.css` | Global CSS styles and Tailwind imports | CSS variables → consistent styling | Includes dark mode theme and custom animations | All component files |

### 📁 `src/components/` — Important (UI Components)
| File | Purpose | Inputs / Outputs | Environment / Notes | Consumers / Related |
|------|---------|-------------------|-------------------|-------------------|

| `src/components/About.tsx` **✓ Documented** | Personal story and core values presentation component | None → animated personal story section | Displays personal journey with Framer Motion animations | `src/App.tsx` (main page), `src/components/AboutMe.tsx` |
| `src/components/AboutMe.tsx` **✓ Documented** | Detailed personal profile component with analytics integration | None → enhanced profile section | GTM analytics tracking for engagement measurement | `src/App.tsx`, `src/hooks/useGTM.ts` |
| `src/components/Certifications.tsx` **✓ Documented** | Professional certifications showcase with verification links | None → interactive certifications display | Category filtering, achievement statistics, external links | `src/App.tsx`, `src/lib/profilesData.ts` |
| `src/components/Contact.tsx` **✓ Documented** | Contact form with security validation and analytics | Form data → email submissions via Formspree | Comprehensive security: XSS prevention, rate limiting, input sanitization | `src/hooks/useGTM.ts`, `src/lib/securityLogger.ts`, `src/lib/analytics.ts` |
| `src/components/Education.tsx` **✓ Documented** | Academic background timeline visualization | None → responsive timeline | Alternating layout, coursework details, performance metrics | `src/App.tsx` |
| `src/components/Experience.tsx` **✓ Documented** | Professional experience timeline with achievements | None → career history display | Company details, technologies used, impact metrics | `src/App.tsx`, `src/components/Certifications.tsx` |
| `src/components/Skills.tsx` **✓ Documented** | Technical skills visualization with categorized display | None → skills grid with categories | Six core skill categories with interactive animations | `src/App.tsx` |
| `src/components/Projects.tsx` **✓ Documented** | Featured projects showcase with live demos | None → project portfolio grid | Technology tags, demo links, achievement metrics | `src/App.tsx` |
| `src/components/Services.tsx` **✓ Documented** | Professional services offering display | None → services grid with pricing | What's included, pricing, duration estimates | `src/App.tsx` |
| `src/components/Hero.tsx` **✓ Documented** | Landing section with animations and key statistics | None → main hero section | Dynamic headlines, animated counters, CTA buttons | `src/App.tsx` |
| `src/components/Experience.tsx` | Professional experience timeline with achievements | None → career history display | Company details, technologies used, impact metrics | `src/App.tsx`, `src/components/Certifications.tsx` |
| `src/components/Projects.tsx` | Featured projects showcase with live demos | None → project portfolio grid | Technology tags, demo links, achievement metrics | `src/App.tsx` |
| `src/components/Services.tsx` | Professional services offering display | None → services grid with pricing | What's included, pricing, duration estimates | `src/App.tsx` |
| `src/components/Skills.tsx` | Technical skills visualization | None → skills grid with categories | Multiple skill categories with interactive elements | `src/App.tsx` |
| `src/components/Hero.tsx` | Landing section with animations and CTAs | None → main hero section | Responsive design, smooth animations, profile image | `src/App.tsx` |
**Layout Components** (`src/components/layout/`):
| `src/components/layout/Header.tsx` | Navigation header with mobile menu | Current route → navigation links | Dropdown menus, theme toggle, mobile responsiveness | `src/App.tsx` |
| `src/components/layout/Footer.tsx` | Site footer with social links and profiles | None → footer navigation | Multiple social platforms, profile links, back-to-top | `src/App.tsx`, `src/lib/profilesData.ts` |
| `src/components/layout/SEO.tsx` | Search engine optimization component | SEO props → meta tags | Dynamic OpenGraph, Twitter cards, structured data | `src/App.tsx` |
| `src/components/layout/ErrorBoundary.tsx` | React error boundary for graceful error handling | React errors → fallback UI | Three.js error handling, security logging | All component files |
| `src/components/layout/GTMProvider.tsx` **✓ Documented** | Google Tag Manager integration provider | GTM config → analytics tracking | Environment-based configuration, error handling | `src/main.tsx` |

**UI Components** (`src/components/ui/`):
| `src/components/ui/FloatingNav.tsx` | Floating navigation component | None → floating nav links | Smooth animations, scroll-based positioning | `src/App.tsx` |
| `src/components/ui/ThemeToggle.tsx` | Dark/light theme toggle component | User preference → theme state update | Smooth animations, localStorage persistence | `src/components/layout/Header.tsx`, `src/contexts/ThemeContext.tsx` |
| `src/components/ui/Logo.tsx` | Reusable logo component with sizing options | Size props → logo display | Responsive sizing, optional text display | Available for use in Header |

**Background Components** (`src/components/backgrounds/`):
| `src/components/backgrounds/ParticleBackground.tsx` | Animated particle background effect | None → canvas-based animation | WebGL fallback, performance optimization, mobile disabled | `src/App.tsx` |
| `src/components/backgrounds/ThreeJSHero.tsx` | 3D enhanced hero section | None → animated hero with 3D elements | WebGL availability check, fallback handling | `src/App.tsx` |
| `src/components/backgrounds/ThreeJSContent.tsx` | Three.js 3D scene component | None → rendered 3D graphics | WebGL requirement, mobile performance considerations | `src/components/backgrounds/ThreeJSHero.tsx` |

### 📁 `src/hooks/` — Important (Custom React Hooks)
| File | Purpose | Inputs / Outputs | Environment / Notes | Consumers / Related |
|------|---------|-------------------|-------------------|-------------------|
| `src/hooks/useGTM.ts` | Google Tag Manager integration hook | Tracking events → analytics | Custom event types, safe error handling | Contact components, CTA buttons |

### 📁 `src/lib/` — Important (Utility Libraries)
| File | Purpose | Inputs / Outputs | Environment / Notes | Consumers / Related |
|------|---------|-------------------|-------------------|-------------------|
| `src/lib/analytics.ts` | Custom analytics tracking utilities | User events → analytics data | Rate limiting, privacy considerations | Contact forms, CTA tracking |
| `src/lib/securityLogger.ts` | Security event logging utilities | Security events → logs/storage | Error tracking, form validation logging | Contact component |
| `src/lib/profilesData.ts` | Social media and profile platform data | None → profile configurations | Categories and platform integration | Footer, profiles section |
| `src/lib/seo.ts` | SEO utilities and structured data | SEO props → meta configurations | Schema.org markup, OpenGraph tags | SEO component |
| `src/lib/webVitals.ts` | Web performance monitoring | Performance metrics → analytics | Core Web Vitals tracking | Analytics integration |

### 📁 `src/contexts/` — Important (React Context)
| File | Purpose | Inputs / Outputs | Environment / Notes | Consumers / Related |
|------|---------|-------------------|-------------------|-------------------|
| `src/contexts/ThemeContext.tsx` | Theme state management context | Theme preference → global theme state | Dark/light mode, localStorage persistence | Theme toggle component |

### 📁 Additional Content Components
- `src/components/pages/` - Page components for dedicated routes (ResearchPage, LeadershipPage, CertificationsPage, ServicesPage, ExtraCurricularsPage)
- `src/components/Other.tsx` - Navigation component for specialized content sections
- `src/components/CommunityLeadership.tsx`, `src/components/ExtraCurriculars.tsx`, `src/components/Profiles.tsx` - Content showcase components

---

## Data Flow & Component Relationships

### Main Application Flow
```
User Request
    ↓
Router (src/App.tsx)
    ↓
Page Component (src/components/[Page].tsx)
    ↓
Sub-components + Hooks
    ↓
Libraries (src/lib/*) + Context (src/contexts/*)
    ↓
Rendered UI + Analytics Tracking
```

### Component Architecture
- **Presentation Components**: Pure UI components (Hero, About, Education, etc.)
- **Container Components**: State management and data flow (App.tsx, Contact.tsx)
- **Utility Components**: Reusable functionality (ThemeToggle, ErrorBoundary)
- **Page Components**: Route-specific layouts (`src/components/pages/`)

### Key Design Patterns
- **Component Composition**: Higher-order components for shared functionality
- **Custom Hooks**: Logic extraction for reusability (useGTM, useTheme)
- **Context API**: Global state management for theme preferences
- **Error Boundaries**: Graceful error handling and user feedback

---

## Development & Testing
- **Code Quality**: ESLint, TypeScript strict mode
- **Testing**: React Testing Library, Jest unit tests
- **E2E Testing**: Playwright (src/e2e/)
- **Build Optimization**: Vite with code splitting and tree shaking

---

## Deployment & Performance
- **Hosting**: Netlify/Vercel with edge function support
- **CDN**: Automatic asset optimization and global distribution
- **Performance**: Core Web Vitals monitoring, lazy loading
- **SEO**: Server-side rendering support, meta tag optimization
