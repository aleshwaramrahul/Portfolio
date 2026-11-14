import React, { useState } from 'react';
import { VariableFontHoverWord } from './VariableFontHover';

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
    name: 'ASR DIGI SOLUTIONS LTD',
    dates: 'SEP 2026 — PRESENT',
    role: 'Associate Software Engineer',
    location: 'Hyderabad, Telangana, India',
    category: 'ASSOCIATE SOFTWARE ENGINEER · FULL-TIME | HYDERABAD, TELANGANA',
    highlights: [
      'Career Progression: Completed Internship and transitioned to a Full-Time Associate Software Engineer role.',
      'Designing and developing responsive, user-friendly websites and web interfaces, contributing to frontend development and UI/UX improvements.',
      'Contributing to ERP application development and enhancements using Java, Spring Boot, React, and Supabase.',
      'Performing functional testing across multiple ERP modules to verify application behavior and data accuracy.',
      'Validating web application records against Supabase database records to identify data mismatches.',
      'Investigating data discrepancies across business modules and reporting technical findings to support issue resolution.',
      'Creating and publishing engaging content across social media platforms, including post designing, content scheduling, and managing regular updates.'
    ],
    skills: [
      'Java',
      'Spring Boot',
      'React',
      'Supabase',
      'ERP Development',
      'UI/UX Design',
      'Functional Testing',
      'Data Validation',
      'REST APIs',
      'Web Development'
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
        <VariableFontHoverWord
          text="PROFESSIONAL"
          className="title-solid"
          fromWeight={400}
          toWeight={900}
          staggerDuration={35}
          staggerFrom="first"
        />
        <VariableFontHoverWord
          text="JOURNEY"
          className="title-outline"
          fromWeight={400}
          toWeight={900}
          staggerDuration={35}
          staggerFrom="first"
        />
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
              {activeExp.highlights.map((point, i) => {
                const isProgression = point.startsWith('Career Progression:');
                if (isProgression) {
                  const content = point.replace('Career Progression:', '').trim();
                  return (
                    <li key={i} className="progression-highlight-item">
                      <span className="bullet-highlight-badge">CAREER PROGRESSION</span>
                      <span className="bullet-text highlight-emphasis">{content}</span>
                    </li>
                  );
                }
                return (
                  <li key={i}>
                    <span className="bullet-dot">•</span>
                    <span className="bullet-text">{point}</span>
                  </li>
                );
              })}
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
