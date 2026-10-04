import React, { useState } from 'react';

interface ExperienceItem {
  id: string;
  name: string;
  dates: string;
  role: string;
  location: string;
  category: string;
  desc?: string;
  highlights: string[];
  skills: string[];
  tools?: string[];
}

const EXPERIENCES_DATA: ExperienceItem[] = [
  {
    id: '01',
    name: 'ASR DIGI SOLUTIONS PVT LTD',
    dates: 'SEP 2026 — PRESENT',
    role: 'Associate Software Developer',
    location: 'Hyderabad, Telangana, India (On-site)',
    category: 'ASSOCIATE SOFTWARE DEVELOPER · FULL-TIME | HYDERABAD, INDIA',
    highlights: [
      'Working on backend development for the EduGrow 360 CRM using Java, Spring Boot, Hibernate, and MySQL.',
      'Developing and maintaining RESTful APIs and implementing CRUD operations for student and lead management.',
      'Assisting with debugging, testing, and database query optimization to improve application performance and reliability.',
      'Collaborating with the development team to enhance application functionality, usability, and system stability.',
      'Supporting application deployment and resolving issues during development and production support.'
    ],
    skills: [
      'Java',
      'Spring Boot',
      'Hibernate',
      'MySQL',
      'REST APIs',
      'Backend Development',
      'CRUD Operations',
      'Debugging',
      'Software Testing'
    ],
    tools: [
      'Antigravity',
      'VS Code',
      'IntelliJ IDEA',
      'ChatGPT',
      'Gemini AI',
      'Stitch',
      'Supabase',
      'Cloud AI'
    ]
  },
  {
    id: '02',
    name: 'EQUITRON MEDICA',
    dates: 'DEC 2024 — JUN 2025',
    role: 'Trainee Engineer – Customer Support',
    location: 'Hyderabad, Telangana',
    category: 'TRAINEE ENGINEER – CUSTOMER SUPPORT | HYDERABAD, TELANGANA',
    highlights: [
      'Collaborated with engineering teams and field technicians to troubleshoot and resolve client technical requirements.',
      'Diagnosed operational and hardware/software issues in customer-facing equipment, delivering effective technical support under tight deadlines.',
      'Maintained detailed maintenance logs, operational reports, and clear professional communication with clients and cross-functional teams.'
    ],
    skills: [
      'Customer Relationship Management (CRM)',
      'Customer Service',
      'Preventive Maintenance',
      'Service Engineering',
      'Electrical Troubleshooting',
      'Technical Support',
      'Customer Support',
      'Field Service Engineering',
      'Installation Qualification (IQ)',
      'Performance Qualification (PQ)'
    ]
  }
];

export const Experience: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeExp = EXPERIENCES_DATA[activeIdx];
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
    <section id="experience">
      <div className="section-label reveal">04 / Experience</div>
      
      <h2 className="section-title reveal">
        <span className="title-solid">PROFESSIONAL</span>{' '}
        <span className="title-outline">JOURNEY</span>
      </h2>

      <div className="projects-interactive-wrap reveal">
        {/* Left Side: Vertical Experience Selector List with Smooth Sliding Indicator */}
        <div className="projects-selector-col" role="tablist" aria-label="Experience list">
          <div className="projects-sliding-rail"></div>
          <div
            className="projects-sliding-indicator"
            style={{
              transform: `translateY(${indicatorStyle.top}px)`,
              height: `${indicatorStyle.height}px`
            }}
          ></div>

          {EXPERIENCES_DATA.map((item, idx) => {
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

        {/* Right Side: Active Experience Inspector Card */}
        <div className="project-inspector-card" role="tabpanel">
          <div className="project-inspector-inner" key={activeExp.id}>
            <div className="project-card-dates">{activeExp.dates}</div>
            <h3 className="project-card-title">{activeExp.name}</h3>
            <div className="project-card-category">{activeExp.category}</div>
            
            <ul className="project-card-bullets">
              {activeExp.highlights.map((point, i) => (
                <li key={i}>
                  <span className="bullet-dot">•</span>
                  <span className="bullet-text">{point}</span>
                </li>
              ))}
            </ul>

            <div className="project-card-divider" />

            <div className="project-card-tech-group">
              <div className="project-tech-label">SKILLS &amp; COMPETENCIES</div>
              <div className="project-tech-tags">
                {activeExp.skills.map((skill, i) => (
                  <span key={i} className="tech-tag-pill">{skill}</span>
                ))}
              </div>
            </div>

            {activeExp.tools && activeExp.tools.length > 0 && (
              <div className="project-card-tech-group" style={{ marginTop: '1.2rem' }}>
                <div className="project-tech-label">TOOLS &amp; PLATFORMS</div>
                <div className="project-tech-tags">
                  {activeExp.tools.map((tool, i) => (
                    <span key={i} className="tech-tag-pill">{tool}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
