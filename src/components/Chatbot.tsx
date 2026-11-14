import React, { useState, useRef, useEffect } from 'react';
import { RobotHead } from './RobotHead';
import { cyberAudio } from '../utils/cyberAudio';
import { CONVERSATION_DATASET } from '../data/conversationDataset';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  links?: { label: string; url: string; isAction?: boolean }[];
  followUps?: string[];
}

interface KnowledgeItem {
  keywords: string[];
  response: string;
  links?: { label: string; url: string; isAction?: boolean }[];
  followUps?: string[];
  actionTarget?: { sectionId: string; highlightSelector?: string; tabIndex?: number };
}

// Levenshtein distance for typo tolerance
function editDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // ── RECRUITER FAST-TRACK (WHY HIRE RAHUL) ──
  {
    keywords: ['why hire', 'hire rahul', 'why should we hire', 'elevator pitch', 'summary pitch', 'candidate overview', 'recruiter'],
    response:
      "**⚡ Why Hire Aleshwaram Rahul? (Recruiter Pitch):**\n\n• 🚀 **Production-Tested Full-Stack Engineer:** Associate Software Engineer at **ASR Digi Solutions Ltd**, shipping ERP modules, responsive UIs, and robust enterprise APIs with Java, Spring Boot, React & Supabase.\n• ☕ **Deep Java & Spring Expertise:** Built scalable REST architectures, Spring Security (Stateless JWT SHA-512), and custom Java 25 micro-servers.\n• ⚛️ **Modern Frontend Mastery:** React 18/19, TypeScript, Next.js, Vite, Tailwind CSS, WebGL shaders & motion interactions.\n• 🧠 **High Algorithmic Rigor:** 200+ LeetCode & GeeksforGeeks problems solved.\n• 📍 **Location:** Hyderabad, India (Open to Hybrid / Remote / On-Site Full-Time roles).\n• ⏱️ **Notice Period:** Immediate / Fast-Track Joiner.",
    links: [
      { label: 'Schedule Interview / Contact', url: '#contact', isAction: true },
      { label: '📄 Download Resume (PDF)', url: `${import.meta.env.BASE_URL}resume.pdf` },
      { label: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/aleshwaramrahul' },
    ],
    followUps: ['Show featured projects', 'What are his top skills?', 'Work experience at ASR Digi'],
    actionTarget: { sectionId: '#contact' },
  },

  // ── BIO & SUMMARY ──
  {
    keywords: ['about', 'who is', 'rahul', 'background', 'intro', 'overview', 'bio', 'summary', 'profile', 'who are you'],
    response:
      "**Aleshwaram Rahul** is a Results-Driven Full-Stack Software Developer based in **Hyderabad, Telangana, India**.\n\nHe specializes in `Java`, `Spring Boot`, `React 19`, `TypeScript`, `RESTful microservices`, and `AI-driven workflow automation`.\n\nHe has built scalable full-stack applications with clean architecture, enterprise HRMS workflows, autonomous AI scraping/media engines, spatial mapping city platforms, and lightweight Java static HTTP servers.",
    links: [
      { label: 'Explore About Section', url: '#about', isAction: true },
      { label: 'View Experience', url: '#experience', isAction: true },
      { label: 'Inspect Projects', url: '#projects', isAction: true },
    ],
    followUps: ['Why should we hire Rahul?', 'Show featured projects', 'Download updated resume'],
    actionTarget: { sectionId: '#about' },
  },

  // ── WORK EXPERIENCE ──
  {
    keywords: ['experience', 'work experience', 'job', 'company', 'asr', 'digi', 'edugrow', 'equitron', 'career', 'role', 'current role', 'working'],
    response:
      "**Professional Experience:**\n\n1. **ASR Digi Solutions Ltd** (Sep 2026 — Present)\n   *Role:* Associate Software Engineer · Full-time (Hyderabad, Telangana)\n   *Career Progression:* Completed Internship and transitioned to a Full-Time Associate Software Engineer role.\n   *Highlights:*\n   • Designing & developing responsive web interfaces, contributing to frontend development and UI/UX improvements.\n   • Contributing to ERP application development and enhancements using Java, Spring Boot, React, and Supabase.\n   • Performing functional testing across multiple ERP modules to verify application behavior and data accuracy.\n   • Validating web application records against Supabase database records to investigate data discrepancies.\n\n2. **Equitron Medica Private Limited** (Dec 2024 — Jun 2025)\n   *Role:* Trainee Engineer – Customer Support\n   *Highlights:*\n   • Troubleshooting customer hardware/software issues under tight deadlines.\n   • Maintenance logging, reporting, and cross-functional engineering communication.",
    links: [
      { label: 'View Experience Timeline', url: '#experience', isAction: true },
      { label: 'Contact Rahul', url: '#contact', isAction: true },
    ],
    followUps: ['Tell me about projects built', 'Top technical skills', 'Download resume'],
    actionTarget: { sectionId: '#experience' },
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
    followUps: ['Tell me about NexusHR', 'Tell me about WhatNow AI', 'Why hire Rahul?'],
    actionTarget: { sectionId: '#projects' },
  },

  // ── NEXUSHR (WORKFORCEOS) ──
  {
    keywords: ['nexushr', 'workforce', 'workforceos', 'hrms', 'attendance', 'payroll', 'human resource'],
    response:
      "**NexusHR (WorkforceOS) — Enterprise Workforce Management System:**\n• **Stack:** `React 18`, `TypeScript`, `Vite`, `Tailwind CSS`, `Supabase (PostgreSQL)`, `Supabase Auth / SMTP`, `Edge Functions`.\n• **Key Features:**\n  • Role-Based Access Control (RBAC) with separate Admin & Employee portals.\n  • Real-time attendance tracking with automatic working hours & exportable reports.\n  • Automated transactional onboarding invitations & activation lifecycles.\n  • Offline-first resilient state persistence combining PostgreSQL with local storage fallbacks.",
    links: [
      { label: 'View NexusHR Repo', url: 'https://github.com/aleshwaramrahul/NexusHR' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
    followUps: ['Tell me about WhatNow AI', 'Show OneCheck copilot', 'Why hire Rahul?'],
    actionTarget: { sectionId: '#projects', tabIndex: 0 },
  },

  // ── JOYBOYJUTSU (AI MEDIA ENGINE) ──
  {
    keywords: ['joyboyjutsu', 'media engine', 'instagram', 'carousel', 'slides', 'gemini', 'openrouter', 'automation engine'],
    response:
      "**JoyboyJutsu — Autonomous Multi-Agent AI Media Engine:**\n• **Stack:** `React 19`, `Vite 6`, `Node.js (ESM)`, `Tailwind CSS 3.4`, `Sharp 0.33`, `Google Gemini API`, `OpenRouter API`.\n• **Key Features:**\n  • Fully automated 7-agent pipeline turning single topic briefs into multi-slide 1080×1080px Instagram carousels.\n  • Deterministic fallback cascade (OpenRouter ➔ Gemini ➔ Local offline mock engine).\n  • High-DPI Sharp rendering pipeline producing ready-to-publish ZIP asset archives.",
    links: [
      { label: 'View JoyboyJutsu Repo', url: 'https://github.com/aleshwaramrahul/JoyboyJutsu' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
    followUps: ['Tell me about WhatNow AI', 'Tell me about NexusHR', 'Download resume'],
    actionTarget: { sectionId: '#projects', tabIndex: 1 },
  },

  // ── WHATNOW (CITY DISCOVERY & AI) ──
  {
    keywords: ['whatnow', 'city discovery', 'maps', 'postgis', 'delhi', 'mumbai', 'hyderabad', 'geospatial'],
    response:
      "**WhatNow — Autonomous City Discovery & Location-Aware AI Concierge:**\n• **Stack:** `React 19`, `Vite 6`, `Node.js (ESM)`, `Supabase (PostgreSQL)`, `PostGIS Spatial (Point 4326)`, `Google Gemini API`, `OpenRouter API`.\n• **Key Features:**\n  • AskNowEngine AI Concierge grounded in Indian heritage boundaries & state capitals using spatial PostGIS queries.\n  • Multi-AI consensus pipeline validating high-impact cultural travel data.\n  • WorkAgent 18-step autonomous data discovery engine with background cron schedulers.",
    links: [
      { label: 'View WhatNow Repo', url: 'https://github.com/aleshwaramrahul/WhatNow' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
    followUps: ['Show OneCheck copilot', 'Top technical skills', 'Contact Rahul'],
    actionTarget: { sectionId: '#projects', tabIndex: 2 },
  },

  // ── GLOWORA SKINCARE (JAVA STATIC SERVER) ──
  {
    keywords: ['glowora', 'skincare', 'java server', 'http server', 'static server', 'ecommerce', 'e-commerce'],
    response:
      "**Glowora Skincare — Botanical E-Commerce Platform:**\n• **Stack:** `Pure Java 25 (OpenJDK 25 EA)`, `com.sun.net.httpserver`, `Vanilla JavaScript (ES6+)`, `HTML5`, `CSS3`.\n• **Key Features:**\n  • Custom lightweight zero-framework Java HTTP static web server.\n  • Reactive client-side routing, sliding side-cart state engine & glassmorphic luxury UI.\n  • Modular single-file architecture with strict MIME resolution and zero external runtime dependencies.",
    links: [
      { label: 'View Glowora Repo', url: 'https://github.com/aleshwaramrahul/Glowora-Skincare' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
    followUps: ['Tell me about OneCheck', 'Core Java & Spring skills', 'Download resume'],
    actionTarget: { sectionId: '#projects', tabIndex: 3 },
  },

  // ── ONECHECK (AI CAREER COPILOT) ──
  {
    keywords: ['onecheck', 'copilot', 'career copilot', 'resume parse', 'job application', 'kanban', 'spring boot 3', 'java 21'],
    response:
      "**OneCheck — AI-First Career Copilot & Job Application Assistant:**\n• **Stack:** `Java 21`, `Spring Boot 3`, `Spring Security (Stateless JWT SHA-512)`, `Spring Data JPA`, `Hibernate`, `MySQL 8.0`, `React 19`, `TypeScript`, `OpenRouter AI (SSE)`.\n• **Key Features:**\n  • Real-time SSE AI token streaming via OpenRouter API with dynamic user context injection.\n  • Resume parsing, keyword match scoring, and skill-gap analysis against live job descriptions.\n  • Kanban application pipelines, company intelligence hub, and GDPR privacy controls.",
    links: [
      { label: 'View on GitHub', url: 'https://github.com/aleshwaramrahul/OneCheck' },
      { label: 'Projects Section', url: '#projects', isAction: true },
    ],
    followUps: ['Why hire Rahul?', 'Show technical skills', 'Schedule interview'],
    actionTarget: { sectionId: '#projects', tabIndex: 4 },
  },

  // ── TECHNICAL SKILLS & STACK ──
  {
    keywords: ['skill', 'skills', 'stack', 'tech', 'technologies', 'languages', 'java', 'spring', 'react', 'database', 'tools'],
    response:
      "**Technical Skills & Arsenal:**\n\n• **Core Languages:** `Java`, `TypeScript`, `SQL`, `HTML5`, `CSS3`\n• **Backend & Automation:** `Spring Boot`, `Spring MVC`, `Node.js`, `Hibernate`, `RESTful APIs`, `Gemini API`\n• **Frontend & UI:** `React 18/19`, `Next.js`, `Vite`, `Tailwind CSS`, `Lucide React`\n• **Databases & Cloud:** `PostgreSQL`, `MySQL`, `SQLite`, `Supabase`, `PostGIS`\n• **Developer Tools:** `Git`, `GitHub`, `Postman`, `Maven`, `IntelliJ IDEA`, `VS Code`\n• **Architecture & Concepts:** OOP, DSA, System Design, Microservices, Stateless JWT Authentication",
    links: [{ label: 'Explore Skills Grid', url: '#skills', isAction: true }],
    followUps: ['DSA & LeetCode stats', 'Work experience', 'Why hire Rahul?'],
    actionTarget: { sectionId: '#skills' },
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
    followUps: ['What are his top skills?', 'Show featured projects', 'Download resume'],
    actionTarget: { sectionId: '#skills' },
  },

  // ── EDUCATION & QUALIFICATIONS ──
  {
    keywords: ['education', 'college', 'degree', 'study', 'school', 'btech', 'diploma', 'academic', 'qualification', 'university', 'st peter'],
    response:
      "**Education & Academic Background:**\n\n🎓 **Bachelor of Technology (B.Tech) in Electrical & Electronics Engineering**\n   *Institution:* St. Peter's Engineering College, Hyderabad, Telangana (2022 — 2025)\n   *Relevant Coursework:* Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems, OOP.\n\n📜 **Diploma in Electrical & Electronics Engineering**\n   *Institution:* TKR College of Engineering & Technology, Hyderabad (2019 — 2022)\n\n🏫 **Secondary School Certificate (SSC — 10th Standard)**\n   *Institution:* Sri Vijaya Sai High School, Nizamabad, Telangana (Graduated 2019)",
    links: [{ label: 'View Education Section', url: '#education', isAction: true }],
    followUps: ['Certifications & training', 'Work experience', 'Download resume'],
    actionTarget: { sectionId: '#education' },
  },

  // ── CERTIFICATIONS & WORKSHOPS ──
  {
    keywords: ['certificate', 'certifications', 'training', 'workshop', 'nsic', 'solar', 'multisim', 'hiee'],
    response:
      "**Certifications & Technical Training:**\n\n1. ⚡ **Industrial Internship on Solar PV Systems & Automation** — National Small Industries Corporation (NSIC)\n2. 🔌 **Electric Circuit Analysis: Hands-on with MultiSim Live** — Technical Workshop\n3. 🛠️ **Technical Engineering Workshop** — HIEE Empowering Engineers Pvt. Ltd.",
    links: [{ label: 'View Education & Certs', url: '#education', isAction: true }],
    followUps: ['Academic background', 'Top technical skills', 'Contact Rahul'],
    actionTarget: { sectionId: '#education' },
  },

  // ── CONTACT & HIRING ──
  {
    keywords: ['contact', 'email', 'phone', 'number', 'mobile', 'cell', 'call', 'hire', 'reach', 'github', 'linkedin', 'message', 'freelance', 'talk', 'connect', 'location'],
    response:
      "**Contact & Hiring Information:**\n\n• 📍 **Location:** Hyderabad, Telangana, India\n• 📞 **Phone:** [+91 7674885265](tel:+917674885265)\n• ✉️ **Email:** [aleshwaramrahul@gmail.com](mailto:aleshwaramrahul@gmail.com)\n• 🐙 **GitHub:** [github.com/aleshwaramrahul](https://github.com/aleshwaramrahul)\n• 🔗 **LinkedIn:** [linkedin.com/in/aleshwaramrahul](https://www.linkedin.com/in/aleshwaramrahul)\n• 💼 **Status:** Open to Full-Time Software Developer roles & High-Impact Collaborations!",
    links: [
      { label: 'Jump to Contact Form', url: '#contact', isAction: true },
      { label: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/aleshwaramrahul' },
      { label: 'Call (+91 7674885265)', url: 'tel:+917674885265' },
      { label: 'Send Email', url: 'mailto:aleshwaramrahul@gmail.com' },
    ],
    followUps: ['Why hire Rahul?', 'Download updated resume', 'Show featured projects'],
    actionTarget: { sectionId: '#contact' },
  },

  // ── RESUME DOWNLOAD ──
  {
    keywords: ['resume', 'cv', 'pdf', 'download', 'document', 'curriculum vitae'],
    response:
      "**Resume & Professional CV:**\n\nYou can view and download Rahul's verified updated resume directly, or reach out via email for tailored CV inquiries.",
    links: [
      { label: '📄 Download Resume (PDF)', url: `${import.meta.env.BASE_URL}resume.pdf` },
      { label: 'Send Email Request', url: 'mailto:aleshwaramrahul@gmail.com?subject=Request%20for%20Resume' },
      { label: 'Contact Section', url: '#contact', isAction: true },
    ],
    followUps: ['Why hire Rahul?', 'What are his top skills?', 'View work experience'],
  },
];

const SUGGESTED_QUESTIONS = [
  '⚡ Why Hire Rahul?',
  'What are his top skills?',
  'Show featured projects',
  'What is his work experience?',
  'Download updated resume',
];

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 Hi! I'm **Rahul's Cybernetic AI Assistant**, trained on his verified resume & full-stack engineering portfolio.\n\nAsk me anything or pick a quick topic below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      followUps: ['⚡ Why Hire Rahul?', 'Show featured projects', 'Top technical skills'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync sound mute setting with audio module
  useEffect(() => {
    cyberAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  const openChat = () => {
    setIsClosing(false);
    setIsRendered(true);
    setIsOpen(true);
    cyberAudio.playChirp('open');
  };

  const closeChat = () => {
    if (!isRendered || isClosing) return;
    setIsClosing(true);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
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

  // Voice Input (Speech Recognition)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        cyberAudio.playChirp('click');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text to Speech (Audio Reader)
  const toggleSpeechSynthesis = (msgId: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[*#`_•]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Typo-tolerant NLP keyword matching
  const getBotReply = (
    query: string
  ): {
    text: string;
    links?: Message['links'];
    followUps?: string[];
    actionTarget?: KnowledgeItem['actionTarget'];
  } => {
    const q = query.toLowerCase().trim();
    const cleanQ = q.replace(/[?!.,'"]/g, '').trim();

    // ── STEP 1: Check Conversational Dataset (Greetings, Casual, Thanks, FAQs, Farewells) ──
    for (const item of CONVERSATION_DATASET) {
      for (const pattern of item.patterns) {
        if (typeof pattern === 'string') {
          const p = pattern.toLowerCase();
          if (cleanQ === p || cleanQ.startsWith(`${p} `) || cleanQ.endsWith(` ${p}`) || cleanQ === `${p}!`) {
            return {
              text: item.response,
              followUps: item.followUps,
            };
          }
        } else if (pattern.test(q)) {
          return {
            text: item.response,
            followUps: item.followUps,
          };
        }
      }
    }

    // ── STEP 2: Domain-Specific Knowledge Matching (Skills, Projects, Experience, Resume) ──
    const qTokens = cleanQ.split(/\s+/).filter(Boolean);

    let bestMatch: KnowledgeItem | null = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        const kwLower = kw.toLowerCase();

        // Exact full phrase match
        if (q === kwLower) {
          score += 20;
        } else if (q.includes(kwLower)) {
          score += 10 + kwLower.length;
        } else {
          // Token level & typo tolerance (distance <= 2 for words >= 5 chars)
          const kwParts = kwLower.split(/\s+/);
          for (const token of qTokens) {
            for (const kwPart of kwParts) {
              if (token === kwPart) {
                score += 6;
              } else if (kwPart.length >= 5 && token.length >= 5) {
                const dist = editDistance(token, kwPart);
                if (dist <= 2) {
                  score += 4;
                }
              }
            }
          }
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0) {
      return {
        text: bestMatch.response,
        links: bestMatch.links,
        followUps: bestMatch.followUps,
        actionTarget: bestMatch.actionTarget,
      };
    }

    return {
      text: `I can provide full details on Rahul's **Skills**, **Projects** (\`NexusHR\`, \`WhatNow\`, \`OneCheck\`, \`Glowora\`, \`JoyboyJutsu\`), **Work Experience** at ASR Digi Solutions, **Education**, and **Why Hire Rahul**.\n\nWhat would you like to explore?`,
      links: [
        { label: 'Technical Skills', url: '#skills', isAction: true },
        { label: 'Projects', url: '#projects', isAction: true },
        { label: 'Download Resume', url: `${import.meta.env.BASE_URL}resume.pdf` },
        { label: 'Contact', url: '#contact', isAction: true },
      ],
      followUps: ['⚡ Why Hire Rahul?', 'Show featured projects', 'Top technical skills'],
    };
  };

  // Interactive Live Site Navigator
  const triggerSiteAction = (target?: KnowledgeItem['actionTarget']) => {
    if (!target) return;
    const { sectionId, highlightSelector, tabIndex } = target;

    // Switch tab in Projects if requested
    if (sectionId === '#projects' && typeof tabIndex === 'number') {
      const projectBtns = document.querySelectorAll<HTMLButtonElement>('.project-nav-item');
      if (projectBtns && projectBtns[tabIndex]) {
        projectBtns[tabIndex].click();
      }
    }

    // Scroll to section smoothly
    const elem = document.querySelector(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Highlight target with a brief cyan pulse
      if (highlightSelector) {
        const highlighted = elem.querySelector(highlightSelector);
        if (highlighted) {
          highlighted.classList.add('ai-command-highlight');
          setTimeout(() => highlighted.classList.remove('ai-command-highlight'), 1800);
        }
      }
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    cyberAudio.playChirp('send');

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
      const botMsgId = String(Date.now() + 1);

      // Trigger interactive site action if mapped
      if (reply.actionTarget) {
        triggerSiteAction(reply.actionTarget);
      }

      // Add message in streaming mode
      const botMsg: Message = {
        id: botMsgId,
        sender: 'bot',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
        links: reply.links,
        followUps: reply.followUps,
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      cyberAudio.playChirp('receive');

      // Real-Time Token Streaming Simulation
      const fullText = reply.text;
      let charIdx = 0;
      const chunkSize = Math.max(2, Math.floor(fullText.length / 45));

      const streamTimer = setInterval(() => {
        charIdx += chunkSize;
        if (charIdx >= fullText.length) {
          clearInterval(streamTimer);
          setMessages(prev =>
            prev.map(m =>
              m.id === botMsgId ? { ...m, text: fullText, isStreaming: false } : m
            )
          );
        } else {
          const currentSub = fullText.slice(0, charIdx);
          setMessages(prev =>
            prev.map(m =>
              m.id === botMsgId ? { ...m, text: currentSub, isStreaming: true } : m
            )
          );
        }
      }, 16);
    }, 320);
  };

  const handleLinkClick = (url: string, isAction?: boolean) => {
    cyberAudio.playChirp('click');
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
                  ONLINE · VERIFIED PORTFOLIO AI
                </div>
              </div>
            </div>
            
            <div className="chatbot-header-actions">
              {/* Sound Toggle Button */}
              <button
                type="button"
                className={`chatbot-icon-btn ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(prev => !prev)}
                title={soundEnabled ? 'Mute audio' : 'Enable audio'}
                aria-label="Toggle sound"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>

              <button
                className="chatbot-close-btn"
                onClick={closeChat}
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Recruiter Pinned Action Bar */}
          <div className="chatbot-fast-track-bar">
            <button
              className="fast-track-chip highlight"
              onClick={() => handleSend('Why hire Rahul?')}
            >
              ⚡ Why Hire?
            </button>
            <button
              className="fast-track-chip"
              onClick={() => handleSend('Download updated resume')}
            >
              📄 Resume
            </button>
            <button
              className="fast-track-chip"
              onClick={() => handleSend('Show featured projects')}
            >
              💼 Projects
            </button>
            <button
              className="fast-track-chip"
              onClick={() => handleSend('Contact and hiring info')}
            >
              📞 Contact
            </button>
          </div>

          {/* Messages Body */}
          <div
            className="chatbot-body"
            data-lenis-prevent="true"
            onWheel={e => e.stopPropagation()}
          >
            {messages.map(msg => (
              <div key={msg.id} className={`chatbot-msg ${msg.sender}`}>
                <div className="chatbot-msg-bubble">
                  <div
                    className="chatbot-msg-content"
                    dangerouslySetInnerHTML={{
                      __html: (msg.text || (msg.isStreaming ? '▍' : ''))
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`([^`]+)`/g, '<code class="chatbot-inline-code">$1</code>')
                        .replace(/•/g, '<span style="color:#ffffff;margin-right:4px;">•</span>')
                        .replace(/\n/g, '<br/>') +
                        (msg.isStreaming ? '<span class="chatbot-streaming-cursor">▍</span>' : ''),
                    }}
                  />

                  {/* Audio Read-Out Button for Bot Messages */}
                  {msg.sender === 'bot' && msg.text && !msg.isStreaming && (
                    <div className="chatbot-msg-tts-row">
                      <button
                        type="button"
                        className={`chatbot-tts-btn ${speakingId === msg.id ? 'speaking' : ''}`}
                        onClick={() => toggleSpeechSynthesis(msg.id, msg.text)}
                        title={speakingId === msg.id ? 'Stop speaking' : 'Read answer aloud'}
                      >
                        {speakingId === msg.id ? '⏹ Stop Voice' : '🔊 Listen'}
                      </button>
                    </div>
                  )}

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

                  {/* Dynamic Follow-Up Suggestions */}
                  {msg.followUps && msg.followUps.length > 0 && !msg.isStreaming && (
                    <div className="chatbot-followups">
                      <span className="chatbot-followup-label">SUGGESTED NEXT:</span>
                      <div className="chatbot-followup-chips">
                        {msg.followUps.map((fu, fIdx) => (
                          <button
                            key={fIdx}
                            className="chatbot-followup-pill"
                            onClick={() => handleSend(fu)}
                          >
                            {fu} →
                          </button>
                        ))}
                      </div>
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

          {/* Quick Suggestions Bar */}
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
            {/* Voice Input Mic Button */}
            <button
              type="button"
              className={`chatbot-mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleSpeechRecognition}
              title={isListening ? 'Listening... click to stop' : 'Speak your question'}
              aria-label="Voice input"
            >
              {isListening ? '🔴' : '🎙'}
            </button>

            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder={isListening ? 'Listening to voice...' : "Ask about Rahul's skills, projects..."}
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

export default Chatbot;
