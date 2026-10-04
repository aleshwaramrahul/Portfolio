import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  dates: string;
  category: string;
  desc: string;
  highlights: string[];
  tech: string[];
  githubUrl: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: '01',
    name: 'NEXUSHR (WORKFORCEOS)',
    dates: '2024 — 2025',
    category: 'HUMAN RESOURCE & WORKFORCE MANAGEMENT SYSTEM',
    desc: 'Engineered an enterprise workforce management platform featuring Role-Based Access Control (RBAC) with dedicated Admin and Employee self-service portals.',
    highlights: [
      'Implemented core modules for employee onboarding with auto-generated IDs, task lifecycle management (priority levels, status progression, comment threads), and leave approval workflows with attachments.',
      'Built real-time attendance tracking with automatic working hours calculation, status classification (Present, Absent, Late, Leave), and exportable workforce analytics reports.',
      'Integrated automated transactional email delivery using native Supabase Auth SMTP (GoTrue mailer) and Edge Functions to dispatch secure onboarding invitations, token activation links, and password reset lifecycles.',
      'Designed resilient state persistence combining Supabase PostgreSQL with local storage fallbacks for seamless offline/online operation.'
    ],
    tech: [
      'React 18',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Supabase (PostgreSQL)',
      'Supabase Auth / SMTP',
      'Edge Functions'
    ],
    githubUrl: 'https://github.com/aleshwaramrahul/NexusHR'
  },
  {
    id: '02',
    name: 'JOYBOYJUTSU (AI MEDIA ENGINE)',
    dates: '2024 — 2025',
    category: 'AUTONOMOUS AI MEDIA ENGINE & CONTENT PIPELINE',
    desc: 'Engineered a fully autonomous multi-agent media pipeline that scrapes viral content, synthesizes structured copy via Google Gemini AI, and renders 1080×1080px carousel slides for scheduled Instagram publication.',
    highlights: [
      'Built a fault-tolerant scraping engine across AniList GraphQL, Reddit, and RSS feeds using cheerio and rss-parser, applying a custom scoring algorithm to identify top trending topics.',
      'Developed a server-side graphics rendering engine using node-canvas and sharp to dynamically generate branded multi-slide graphics with automated layout calculation and typography.',
      'Automated publishing workflows via the Instagram Graph API and node-cron with transactional SQLite state tracking and an isolated sandbox preview mode.',
      'Designed an administrative monitoring dashboard in Next.js with Tailwind CSS and Recharts to track pipeline logs, inspect generated carousels, and review post performance metrics.'
    ],
    tech: [
      'Next.js 16',
      'React 19',
      'Node.js',
      'Express',
      'Google Gemini API',
      'SQLite',
      'Sharp',
      'Canvas',
      'Instagram Graph API'
    ],
    githubUrl: 'https://github.com/aleshwaramrahul/agent'
  },
  {
    id: '03',
    name: 'WHATNOW (CITY DISCOVERY & AI)',
    dates: '2026',
    category: 'AUTONOMOUS CITY DISCOVERY & LOCATION-AWARE AI CONCIERGE',
    desc: 'Architected an autonomous city discovery and AI concierge platform for Indian metropolitan capitals and heritage districts (Delhi, Mumbai, Bengaluru, Hyderabad, Jaipur, Kolkata, Warangal, Agra, Mysore) featuring real-time event discovery, PostGIS spatial mapping, weekend getaway planners, and multi-AI provider consensus.',
    highlights: [
      'Engineered the AskNowEngine AI City Concierge grounded in Indian heritage boundaries and state capitals using spatial PostGIS queries for real-time localized traveler guidance.',
      'Architected a resilient Multi-AI Provider Manager with automated fallback chains (OpenRouter ↔ Google Gemini) and multi-AI consensus pipelines for validating high-impact cultural data.',
      'Built the WorkAgent 18-step autonomous data discovery engine with background cron schedulers to discover/scrape events, reconcile duplicates, and track entity histories atomically.',
      'Implemented automated EventExpirationService with a 30-minute grace period triggering status lifecycles via custom Supabase PostGIS RPC database functions.',
      'Designed a reactive multi-city React 19 UI with Tailwind CSS ("Editorial Terroir" aesthetic), interactive spatial spotlights, category-filtered event discovery, and custom itinerary manifestos.'
    ],
    tech: [
      'React 19',
      'Vite 8',
      'Node.js (ESM)',
      'Supabase (PostgreSQL)',
      'PostGIS Spatial (Point 4326)',
      'Google Gemini API',
      'OpenRouter API',
      'Tailwind CSS',
      'Lucide Icons',
      'Oxlint',
      'Cron Schedulers'
    ],
    githubUrl: 'https://github.com/aleshwaramrahul/WhatNow'
  },
  {
    id: '04',
    name: 'GLOWORA SKINCARE',
    dates: '2024',
    category: 'E-COMMERCE WEB APPLICATION & JAVA STATIC HTTP SERVER',
    desc: 'Designed and built a modern, responsive single-page e-commerce application for a botanical skincare brand featuring category filtering, product quick-view modals, and routine video showcases.',
    highlights: [
      'Engineered a lightweight static HTTP server in pure Java 25 handling SPA fallback routing to serve production build distribution assets on port 8080 without external web server dependencies.',
      'Created custom Java build utilities (AssetExtractor, CopyLocalAssets) to organize, process, and optimize product imagery assets during the deployment pipeline.',
      'Implemented client-side shopping bag workflows with dynamic quantity controls, free-shipping threshold calculations, and animated order confirmation toast notifications.'
    ],
    tech: [
      'Java 25',
      'React 18',
      'Vite 5',
      'Tailwind CSS',
      'Lucide React',
      'JavaScript',
      'HTML5/CSS3'
    ],
    githubUrl: 'https://github.com/aleshwaramrahul/Glowora'
  },
  {
    id: '05',
    name: 'ONECHECK (CAREER COPILOT)',
    dates: '2026',
    category: 'AI-FIRST CAREER COPILOT & JOB APPLICATION ASSISTANT',
    desc: 'Architected an AI-first, enterprise-grade Career Copilot and Job Application Assistant providing job seekers with a streamlined, chat-centric platform to manage multi-version resumes, analyze job postings, track applications, and leverage real-time streaming AI tailored to verified user data.',
    highlights: [
      'Built a chat-centric operational hub with real-time SSE AI token streaming via OpenRouter API Gateway, using dynamic user context injection (resumes, job requirements, company intel).',
      'Developed a resilient Spring Boot 3 & Java 21 backend engine implementing Stateless JWT (SHA-512) authentication, BCrypt password encryption, Spring Data JPA, and Hibernate.',
      'Implemented an intelligent resume parsing engine with keyword match scoring, salary/skill-gap analysis against job descriptions, and custom AI cover letter / outreach email generation.',
      'Constructed Kanban & list application pipelines, company intelligence tracking hubs, productivity tools with STAR-method interview builders, and full GDPR privacy export/deletion controls.',
      'Containerized the entire multi-tier system (React 19 Vite TS frontend, Spring Boot 3 REST API, MySQL 8.0 with HikariCP pool) using Docker & Docker Compose.'
    ],
    tech: [
      'Java 21',
      'Spring Boot 3',
      'Spring Security (JWT)',
      'Spring Data JPA',
      'Hibernate',
      'MySQL 8.0',
      'React 19',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Zustand',
      'OpenRouter AI (SSE)',
      'Docker Compose'
    ],
    githubUrl: 'https://github.com/aleshwaramrahul/OneCheck'
  }
];

export const Projects: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeProject = PROJECTS_DATA[activeIdx];
  const btnRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 10, height: 22 });

  React.useEffect(() => {
    const currentBtn = btnRefs.current[activeIdx];
    if (currentBtn) {
      const topOffset = currentBtn.offsetTop + currentBtn.offsetHeight * 0.22;
      const height = currentBtn.offsetHeight * 0.56;
      setIndicatorStyle({ top: topOffset, height });
    }
  }, [activeIdx]);

  return (
    <section id="projects">
      <div className="section-label reveal">03 / Projects</div>
      
      <h2 className="section-title reveal">
        <span className="title-solid">SELECTED</span>{' '}
        <span className="title-outline">WORK</span>
      </h2>

      <div className="projects-interactive-wrap reveal">
        {/* Left Side: Vertical Project Selector List with Smooth Sliding Indicator */}
        <div className="projects-selector-col" role="tablist" aria-label="Projects list">
          <div className="projects-sliding-rail"></div>
          <div
            className="projects-sliding-indicator"
            style={{
              transform: `translateY(${indicatorStyle.top}px)`,
              height: `${indicatorStyle.height}px`
            }}
          ></div>

          {PROJECTS_DATA.map((item, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  btnRefs.current[idx] = el;
                }}
                role="tab"
                aria-selected={isActive}
                className={`project-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                <span className="project-tab-title">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Active Project Inspector Card */}
        <div className="project-inspector-card" role="tabpanel">
          <div className="project-inspector-inner" key={activeProject.id}>
            <div className="project-card-dates">{activeProject.dates}</div>
            <h3 className="project-card-title">{activeProject.name}</h3>
            <div className="project-card-category">{activeProject.category}</div>
            
            <p className="project-card-desc">{activeProject.desc}</p>
            
            <ul className="project-card-bullets">
              {activeProject.highlights.map((point, i) => (
                <li key={i}>
                  <span className="bullet-dot">•</span>
                  <span className="bullet-text">{point}</span>
                </li>
              ))}
            </ul>

            <div className="project-card-divider" />

            <div className="project-card-tech-group">
              <div className="project-tech-label">TECH STACK</div>
              <div className="project-tech-tags">
                {activeProject.tech.map((t, i) => (
                  <span key={i} className="tech-tag-pill">{t}</span>
                ))}
              </div>
            </div>

            <div className="project-card-actions">
              <a
                href={activeProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-btn-repo"
              >
                <svg
                  className="github-icon-svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                REPO <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
