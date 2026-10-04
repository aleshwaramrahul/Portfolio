import React from 'react';

export const Skills: React.FC = () => {
  return (
    <section id="skills">
      <div className="section-label reveal">02 / Skills</div>
      <h2 className="section-title reveal">
        <span className="title-solid">TECHNICAL</span>{' '}
        <span className="title-outline">ARSENAL</span>
      </h2>
      <div className="skills-grid reveal">
        <div className="skill-card">
          <div className="skill-icon">Languages</div>
          <div className="skill-name">Core Languages</div>
          <div className="skill-tags">
            <span className="skill-tag">Java</span>
            <span className="skill-tag">TypeScript</span>
            <span className="skill-tag">SQL</span>
            <span className="skill-tag">HTML5</span>
            <span className="skill-tag">CSS3</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-icon">Backend</div>
          <div className="skill-name">Server &amp; Automation</div>
          <div className="skill-tags">
            <span className="skill-tag">Spring Boot</span>
            <span className="skill-tag">Spring MVC</span>
            <span className="skill-tag">Node.js</span>
            <span className="skill-tag">Hibernate</span>
            <span className="skill-tag">RESTful APIs</span>
            <span className="skill-tag">Gemini API</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-icon">Frontend</div>
          <div className="skill-name">UI Engineering</div>
          <div className="skill-tags">
            <span className="skill-tag">React 18/19</span>
            <span className="skill-tag">Next.js</span>
            <span className="skill-tag">Vite</span>
            <span className="skill-tag">Tailwind CSS</span>
            <span className="skill-tag">Lucide React</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-icon">Data</div>
          <div className="skill-name">Databases &amp; Media</div>
          <div className="skill-tags">
            <span className="skill-tag">PostgreSQL</span>
            <span className="skill-tag">MySQL</span>
            <span className="skill-tag">SQLite</span>
            <span className="skill-tag">Supabase</span>
            <span className="skill-tag">Sharp</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-icon">Tooling</div>
          <div className="skill-name">Developer Tools</div>
          <div className="skill-tags">
            <span className="skill-tag">Git / GitHub</span>
            <span className="skill-tag">Postman</span>
            <span className="skill-tag">Maven</span>
            <span className="skill-tag">IntelliJ IDEA</span>
            <span className="skill-tag">VS Code</span>
            <span className="skill-tag">Antigravity</span>
          </div>
        </div>
        <div className="skill-card">
          <div className="skill-icon">Concepts</div>
          <div className="skill-name">Architecture</div>
          <div className="skill-tags">
            <span className="skill-tag">OOP</span>
            <span className="skill-tag">DSA</span>
            <span className="skill-tag">System Design</span>
            <span className="skill-tag">Microservices</span>
          </div>
        </div>
      </div>
    </section>
  );
};
