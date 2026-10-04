import React, { useState, useRef, useEffect } from 'react';
import { RobotHead } from './RobotHead';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  links?: { label: string; url: string; isAction?: boolean }[];
}

interface KnowledgeItem {
  keywords: string[];
  response: string;
  links?: { label: string; url: string; isAction?: boolean }[];
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // ── BIO & SUMMARY ──
  {
    keywords: ['about', 'who is', 'rahul', 'background', 'intro', 'overview', 'bio', 'summary', 'profile', 'who are you'],
    response:
      "**Aleshwaram Rahul** is a Results-Driven Full-Stack Software Developer based in **Hyderabad, Telangana, India**.\n\nHe specializes in **Java**, **Spring Boot**, **React 19**, **TypeScript**, **RESTful microservices**, and **AI-driven workflow automation**.\n\nHe has built scalable full-stack applications with clean architecture, enterprise HRMS workflows, autonomous AI scraping/media engines, spatial mapping city platforms, and lightweight Java static HTTP servers.",
    links: [
      { label: 'Explore About Section', url: '#about', isAction: true },
      { label: 'View Experience', url: '#experience', isAction: true },
      { label: 'Inspect Projects', url: '#projects', isAction: true },
    ],
  },

  // ── WORK EXPERIENCE ──
  {
    keywords: ['experience', 'work experience', 'job', 'company', 'asr', 'digi', 'edugrow', 'equitron', 'career', 'role', 'current role', 'working'],
    response:
      "**Professional Experience:**\n\n1. **ASR Digi Solutions Pvt Ltd** (Sep 2026 — Present)\n   *Role:* Associate Software Developer · Full-time (On-site, Hyderabad)\n   *Highlights:*\n   • Backend development for **EduGrow 360 CRM** using Java, Spring Boot, Hibernate, and MySQL.\n   • Developing and maintaining RESTful APIs & CRUD operations for student and lead management.\n   • Assisting with debugging, testing, and database query optimization for performance & reliability.\n   • Supporting deployment and production issue resolution.\n\n2. **Equitron Medica Private Limited** (Dec 2024 — Jun 2025)\n   *Role:* Trainee Engineer – Customer Support\n   *Highlights:*\n   • Troubleshooting customer hardware/software issues under tight deadlines.\n   • Maintenance logging, reporting, and cross-functional engineering communication.",
    links: [
      { label: 'View Experience Timeline', url: '#experience', isAction: true },
      { label: 'Contact Rahul', url: '#contact', isAction: true },
    ],
  },

  // ── ALL PROJECTS SUMMARY ──
  {
    keywords: ['project', 'projects', 'work', 'portfolio', 'built', 'showcase', 'apps', 'featured work'],
    response:
      "**Featured Engineering Projects:**\n\n1. 🏢 **NexusHR (WorkforceOS)** — Enterprise HRMS platform with RBAC, attendance tracking & Supabase workflows.\n2. 🤖 **JoyboyJutsu** — Autonomous multi-agent AI media engine generating 1080×1080px carousel slides for Instagram.\n3. 🗺️ **WhatNow** — Autonomous city discovery & location-aware AI concierge with PostGIS spatial queries.\n4. 🌿 **Glowora Skincare** — Botanical e-commerce SPA powered by a custom pure Java 25 static HTTP server.\n5. 🎯 **OneCheck** — AI-first Career Copilot with OpenRouter SSE token streaming, Spring Boot 3 & Java 21 REST API.",
    links: [
      { label: 'Explore Projects Section', url: '#projects', isAction: true },
      { label: 'NexusHR GitHub', url: 'https://github.com/aleshwaramrahul/NexusHR' },
      { label: 'OneCheck GitHub', url: 'https://github.com/aleshwaramrahul/OneCheck' },
    ],
  },

  // ── SPECIFIC PROJECT: NEXUSHR ──
  {
    keywords: ['nexushr', 'workforce', 'workforceos', 'hrms', 'hr', 'attendance', 'leave'],
    response:
      "**NexusHR (WorkforceOS) — Enterprise HR & Workforce Management:**\n• **Stack:** React 18, TypeScript, Vite, Tailwind CSS, Supabase PostgreSQL, Supabase Auth/SMTP, Edge Functions.\n• **Key Features:**\n  • Role-Based Access Control (RBAC) with Admin & Employee portals.\n  • Auto-generated employee IDs, task lifecycles, and leave approval workflows.\n  • Real-time attendance calculation and exportable analytics reports.\n  • Automated transactional emails via GoTrue SMTP and Edge Functions.",
    links: [
      { label: 'View on GitHub', url: 'https://github.com/aleshwaramrahul/NexusHR' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
  },

  // ── SPECIFIC PROJECT: JOYBOYJUTSU ──
  {
    keywords: ['joyboyjutsu', 'joyboy', 'media engine', 'instagram', 'carousel', 'agent', 'scraping'],
    response:
      "**JoyboyJutsu — Autonomous AI Media Engine & Content Pipeline:**\n• **Stack:** Next.js 16, React 19, Node.js, Express, Google Gemini AI, SQLite, Sharp, Canvas, Instagram Graph API.\n• **Key Features:**\n  • Autonomous multi-agent pipeline scraping AniList GraphQL, Reddit, and RSS feeds with custom scoring.\n  • Server-side graphics engine using node-canvas and sharp for branded 1080×1080px carousel rendering.\n  • Automated scheduled publishing via Instagram Graph API and node-cron.",
    links: [
      { label: 'View on GitHub', url: 'https://github.com/aleshwaramrahul/agent' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
  },

  // ── SPECIFIC PROJECT: WHATNOW ──
  {
    keywords: ['whatnow', 'city', 'concierge', 'discovery', 'postgis', 'heritage', 'spatial'],
    response:
      "**WhatNow — Autonomous City Discovery & AI Concierge:**\n• **Stack:** React 19, Vite 8, Node.js (ESM), Supabase PostgreSQL with PostGIS Spatial, Google Gemini API, OpenRouter API, Tailwind CSS, Oxlint, Cron Schedulers.\n• **Key Features:**\n  • **AskNowEngine:** Location-aware AI concierge using spatial PostGIS queries across Indian state capitals and heritage districts.\n  • Multi-AI consensus engine with automated fallback chains (OpenRouter ↔ Gemini).\n  • **WorkAgent:** 18-step autonomous cycle discovering city events with duplicate prevention.\n  • EventExpirationService background scheduler with 30-min grace period.",
    links: [
      { label: 'View on GitHub', url: 'https://github.com/aleshwaramrahul/WhatNow' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
  },

  // ── SPECIFIC PROJECT: GLOWORA ──
  {
    keywords: ['glowora', 'skincare', 'ecommerce', 'e-commerce', 'static http server', 'java 25'],
    response:
      "**Glowora Skincare — Botanical E-Commerce & Java Static HTTP Server:**\n• **Stack:** Java 25, React 18, Vite 5, Tailwind CSS, Lucide React, JavaScript, HTML5/CSS3.\n• **Key Features:**\n  • Lightweight static HTTP server in pure Java 25 handling SPA fallback routing to serve production build assets on port 8080.\n  • Custom Java build utilities (AssetExtractor, CopyLocalAssets) for media optimization.\n  • Category filtering, quick-view modals, and client-side shopping bag workflows.",
    links: [
      { label: 'View on GitHub', url: 'https://github.com/aleshwaramrahul/Glowora' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
  },

  // ── SPECIFIC PROJECT: ONECHECK ──
  {
    keywords: ['onecheck', 'copilot', 'career copilot', 'resume parse', 'job application', 'kanban'],
    response:
      "**OneCheck — AI-First Career Copilot & Job Application Assistant:**\n• **Stack:** Java 21, Spring Boot 3, Spring Security (Stateless JWT SHA-512), Spring Data JPA, Hibernate, MySQL 8.0, React 19, TypeScript, Vite, Tailwind CSS, Zustand, OpenRouter AI (SSE), Docker Compose.\n• **Key Features:**\n  • Real-time SSE AI token streaming via OpenRouter API with dynamic user context injection.\n  • Resume parsing, keyword match scoring, and skill-gap analysis against live job descriptions.\n  • Kanban application pipelines, company intelligence hub, STAR-method interview builders, and GDPR privacy controls.",
    links: [
      { label: 'View on GitHub', url: 'https://github.com/aleshwaramrahul/OneCheck' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
  },

  // ── TECHNICAL SKILLS & STACK ──
  {
    keywords: ['skill', 'skills', 'stack', 'tech', 'technologies', 'languages', 'java', 'spring', 'react', 'database', 'tools'],
    response:
      "**Technical Skills & Arsenal:**\n\n• **Core Languages:** Java, TypeScript, SQL, HTML5, CSS3\n• **Backend & Automation:** Spring Boot, Spring MVC, Node.js, Hibernate, RESTful APIs, Gemini API\n• **Frontend & UI:** React 18/19, Next.js, Vite, Tailwind CSS, Lucide React\n• **Databases & Media:** PostgreSQL, MySQL, SQLite, Supabase, Sharp\n• **Developer Tools:** Git, GitHub, Postman, Maven, IntelliJ IDEA, VS Code, Antigravity\n• **Architecture & Concepts:** OOP, DSA, System Design, Microservices",
    links: [{ label: 'Explore Skills Grid', url: '#skills', isAction: true }],
  },

  // ── CODING & PROBLEM SOLVING ──
  {
    keywords: ['leetcode', 'geeksforgeeks', 'dsa', 'problem solving', 'coding', 'algorithms', 'data structures'],
    response:
      "**Problem Solving & Competitive Programming:**\n\n• **200+ Coding Problems Solved** across **LeetCode** and **GeeksforGeeks**.\n• Core Focus Areas: Arrays, Strings, Linked Lists, Trees, HashMaps, and algorithmic optimization.\n• Strong foundation in Object-Oriented Programming (OOP) and clean system architecture.",
    links: [
      { label: 'View Skills', url: '#skills', isAction: true },
      { label: 'GitHub Profile', url: 'https://github.com/aleshwaramrahul' },
    ],
  },

  // ── EDUCATION & QUALIFICATIONS ──
  {
    keywords: ['education', 'college', 'degree', 'study', 'school', 'btech', 'diploma', 'academic', 'qualification', 'university', 'st peter'],
    response:
      "**Education & Academic Background:**\n\n🎓 **Bachelor of Technology (B.Tech) in Electrical & Electronics Engineering**\n   *Institution:* St. Peter's Engineering College, Hyderabad, Telangana (2022 — 2025)\n   *Relevant Coursework:* Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems, OOP.\n\n📜 **Diploma in Electrical & Electronics Engineering**\n   *Institution:* TKR College of Engineering & Technology, Hyderabad (2019 — 2022)\n\n🏫 **Secondary School Certificate (SSC — 10th Standard)**\n   *Institution:* Sri Vijaya Sai High School, Nizamabad, Telangana (Graduated 2019)",
    links: [{ label: 'View Education Section', url: '#education', isAction: true }],
  },

  // ── CERTIFICATIONS & WORKSHOPS ──
  {
    keywords: ['certificate', 'certifications', 'training', 'workshop', 'nsic', 'solar', 'multisim', 'hiee'],
    response:
      "**Certifications & Technical Training:**\n\n1. ⚡ **Industrial Internship on Solar PV Systems & Automation** — National Small Industries Corporation (NSIC)\n2. 🔌 **Electric Circuit Analysis: Hands-on with MultiSim Live** (From Theory to Practice) — Technical Workshop\n3. 🛠️ **Technical Engineering Workshop** — HIEE Empowering Engineers Pvt. Ltd.",
    links: [{ label: 'View Education & Certs', url: '#education', isAction: true }],
  },

  // ── SPOKEN LANGUAGES ──
  {
    keywords: ['language', 'languages', 'speak', 'spoken', 'telugu', 'hindi', 'english'],
    response:
      "**Spoken Languages & Proficiency:**\n\n• 🇬🇧 **English:** Professional Working Proficiency\n• 🇮🇳 **Telugu:** Native Proficiency\n• 🇮🇳 **Hindi:** Full Professional Proficiency",
    links: [{ label: 'Get in Touch', url: '#contact', isAction: true }],
  },

  // ── CONTACT & HIRING ──
  {
    keywords: ['contact', 'email', 'phone', 'number', 'mobile', 'cell', 'call', 'hire', 'reach', 'github', 'linkedin', 'message', 'freelance', 'talk', 'connect', 'location'],
    response:
      "**Contact & Hiring Information:**\n\n• 📍 **Location:** Hyderabad, Telangana, India\n• 📞 **Phone:** [+91 7674885265](tel:+917674885265)\n• ✉️ **Email:** [aleshwaramrahul@gmail.com](mailto:aleshwaramrahul@gmail.com)\n• 🐙 **GitHub:** [github.com/aleshwaramrahul](https://github.com/aleshwaramrahul)\n• 💼 **Status:** Open to Full-Time Software Developer roles & High-Impact Collaborations!",
    links: [
      { label: 'Jump to Contact Form', url: '#contact', isAction: true },
      { label: 'Call (+91 7674885265)', url: 'tel:+917674885265' },
      { label: 'Send Email', url: 'mailto:aleshwaramrahul@gmail.com' },
    ],
  },

  // ── RESUME DOWNLOAD ──
  {
    keywords: ['resume', 'cv', 'pdf', 'download', 'document'],
    response:
      "**Resume & Professional CV:**\n\nYou can download Rahul's verified updated resume directly, or reach out via email for tailored CV requests.",
    links: [
      { label: '📄 Download Resume (PDF)', url: '/resume.pdf' },
      { label: 'Send Email Request', url: 'mailto:aleshwaramrahul@gmail.com?subject=Request%20for%20Resume' },
      { label: 'Contact Section', url: '#contact', isAction: true },
    ],
  },
];

const SUGGESTED_QUESTIONS = [
  'Tell me about Rahul',
  'What are his top skills?',
  'Show me featured projects',
  'What is his work experience?',
  'Download updated resume',
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm **Rahul's AI Assistant**, trained on his verified resume & portfolio data.\n\nAsk me about his **Skills**, **Work Experience**, **Projects**, **Education**, or **Resume**!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  const openChat = () => {
    setIsClosing(false);
    setIsRendered(true);
    setIsOpen(true);
  };

  const closeChat = () => {
    if (!isRendered || isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
      setIsRendered(false);
    }, 220);
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  // Click outside to minimize / close chatbot & Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const targetNode = e.target as Node;
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(targetNode) &&
        triggerBtnRef.current &&
        !triggerBtnRef.current.contains(targetNode)
      ) {
        closeChat();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChat();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isClosing, isRendered]);

  const getBotReply = (query: string): { text: string; links?: Message['links'] } => {
    const q = query.toLowerCase().trim();

    let bestMatch: KnowledgeItem | null = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (q === kw) {
          score += 10;
        } else if (q.includes(kw)) {
          score += kw.length;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0) {
      return { text: bestMatch.response, links: bestMatch.links };
    }

    return {
      text: `I can provide full details on Rahul's **Skills**, **Projects** (NexusHR, WhatNow, OneCheck, Glowora, JoyboyJutsu), **Work Experience** at ASR Digi Solutions & Equitron, **Education**, and **Resume Download**.\n\nWhat would you like to explore?`,
      links: [
        { label: 'Technical Skills', url: '#skills', isAction: true },
        { label: 'Projects', url: '#projects', isAction: true },
        { label: 'Download Resume', url: '/resume.pdf' },
        { label: 'Contact', url: '#contact', isAction: true },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'bot',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links: reply.links,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleLinkClick = (url: string, isAction?: boolean) => {
    if (isAction && url.startsWith('#')) {
      const target = document.querySelector(url);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        closeChat();
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="chatbot-root">
      {/* Floating 3D Robot Trigger Button */}
      <button
        ref={triggerBtnRef}
        type="button"
        className={`chatbot-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        title="Chat with Rahul's AI Assistant"
        aria-label="Open AI Assistant"
      >
        <div className="chatbot-trigger-inner">
          <div className="chatbot-robot-avatar">
            <RobotHead size={46} />
          </div>
          {!isOpen && <div className="chatbot-pulse-ring" />}
          <div className="chatbot-online-indicator" />
        </div>
      </button>

      {/* Floating Chat Window Modal with Smooth Collapse Animation */}
      {isRendered && (
        <div
          ref={chatWindowRef}
          className={`chatbot-window ${isClosing ? 'closing' : 'opening'}`}
          data-lenis-prevent="true"
          role="dialog"
          aria-label="AI Portfolio Assistant"
          onWheel={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar-small">
                <RobotHead size={30} />
              </div>
              <div className="chatbot-header-meta">
                <div className="chatbot-title">RAHUL_AI // ASSISTANT</div>
                <div className="chatbot-status">
                  <span className="chatbot-status-dot" />
                  ONLINE · VERIFIED RESUME AI
                </div>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={closeChat}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages Body with Smooth Scroll & Touch Gestures */}
          <div
            className="chatbot-body"
            data-lenis-prevent="true"
            onWheel={e => e.stopPropagation()}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`chatbot-msg ${msg.sender}`}
              >
                <div className="chatbot-msg-bubble">
                  <div
                    className="chatbot-msg-content"
                    dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/•/g, '<span style="color:#ffffff;margin-right:4px;">•</span>')
                        .replace(/\n/g, '<br/>'),
                    }}
                  />
                  {msg.links && msg.links.length > 0 && (
                    <div className="chatbot-msg-links">
                      {msg.links.map((link, idx) => (
                        <button
                          key={idx}
                          className="chatbot-chip-link"
                          onClick={() => handleLinkClick(link.url, link.isAction)}
                        >
                          {link.label} ↗
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="chatbot-msg-time">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-msg bot">
                <div className="chatbot-typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div
            className="chatbot-suggestions"
            data-lenis-prevent="true"
            onWheel={e => e.stopPropagation()}
          >
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                className="chatbot-suggestion-pill"
                onClick={() => handleSend(q)}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Footer Input */}
          <form
            className="chatbot-footer"
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Ask about Rahul's skills, projects..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputValue.trim()}
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
