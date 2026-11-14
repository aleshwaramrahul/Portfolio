import React, { useState } from 'react';
import { VariableFontHoverWord } from './VariableFontHover';
import { StackCatchGame } from './StackCatchGame';

export const Skills: React.FC = () => {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <section id="skills">
      <div className="section-label reveal">02 / Skills</div>
      <h2 className="section-title reveal">
        <VariableFontHoverWord
          text="TECHNICAL"
          className="title-solid"
          fromWeight={400}
          toWeight={900}
          staggerDuration={35}
          staggerFrom="first"
        />
        <VariableFontHoverWord
          text="ARSENAL"
          className="title-outline"
          fromWeight={400}
          toWeight={900}
          staggerDuration={35}
          staggerFrom="first"
        />
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

      {/* Launcher Button placed exactly at the bottom-left of the Skills Grid */}
      <div className="skills-game-launcher-row reveal">
        <button
          type="button"
          className={`skills-game-launch-btn ${isGameOpen ? 'active' : ''}`}
          onClick={() => setIsGameOpen((prev) => !prev)}
          title="Play Stack Catch Mini-Game"
        >
          <span className="skills-game-launch-dot">●</span>
          <span>{isGameOpen ? 'CLOSE MINI-GAME ✕' : 'PLAY STACK CATCH 🎯'}</span>
          <span className="skills-game-launch-arrow">↗</span>
        </button>
      </div>

      {/* Embedded Game Section */}
      {isGameOpen && (
        <div className="skills-game-embed-wrap">
          <StackCatchGame onClose={() => setIsGameOpen(false)} />
        </div>
      )}
    </section>
  );
};
