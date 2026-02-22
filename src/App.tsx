import { useState } from "react"
import "./App.css"

type Section =
  | "home"
  | "about"
  | "projects"
  | "achievements"
  | "skills"
  | "contact"

export default function App() {
  const [active, setActive] = useState<Section>("home")
  const [modal, setModal] = useState<null | "portfolio" | "ideathon">(null)

  return (
    <div className="app">
      <img src="/bg/music-bg.png" className="bg-image" alt="" />

      {active === "home" && (
        <Window title="home">
          <h1>
            Hi, I’m <span>Arnav Sood</span>
          </h1>
          <p className="subtitle">aspiring computer engineer</p>

          <div className="icon-nav">
            <Icon label="about" icon="i" onClick={() => setActive("about")} />
            <Icon label="projects" icon="📁" onClick={() => setActive("projects")} />
            <Icon label="achievements" icon="🏆" onClick={() => setActive("achievements")} />
            <Icon label="skills" icon="⚡" onClick={() => setActive("skills")} />
            <Icon label="contact" icon="@" onClick={() => setActive("contact")} />
          </div>
        </Window>
      )}

      {active === "about" && (
        <Window title="about" onClose={() => setActive("home")}>
          <p className="section-text">
            I am a Computer Science undergraduate driven by curiosity for AI,
            software development, and problem-solving.
          </p>
          <p className="section-text">
            When I’m not coding, I explore creative expression through writing
            and music, bringing clarity and structure into everything I build.
          </p>
        </Window>
      )}

      {active === "projects" && (
        <Window title="projects" onClose={() => setActive("home")}>
          <div className="card clickable" onClick={() => setModal("portfolio")}>
            <h3>Personal Portfolio Website</h3>
            <p className="tech">React · TypeScript · CSS</p>
            <p>Window-based portfolio with clean UI and modular structure.</p>
          </div>

          <div className="card clickable" onClick={() => setModal("ideathon")}>
            <h3>Ideathon Winning Project</h3>
            <p className="tech">AI · Automation</p>
            <p>AI-based solution that secured 1st place.</p>
          </div>
        </Window>
      )}

      {active === "achievements" && (
        <Window title="achievements" onClose={() => setActive("home")}>
          <div className="card">
            <h3>🏆 Winner – RE-IGNITE 2.0 Ideathon</h3>
            <p>
              Secured <strong>1st position</strong> for designing an AI-driven
              solution at an inter-university ideathon organised by HRFY.ai &
              Amity University.
            </p>
          </div>
        </Window>
      )}

      {active === "skills" && (
        <Window title="skills" onClose={() => setActive("home")}>
          <SkillGroup title="Programming">
            <li>C / C++</li>
            <li>Python</li>
            <li>JavaScript / TypeScript</li>
          </SkillGroup>

          <SkillGroup title="Frontend">
            <li>React</li>
            <li>HTML & CSS</li>
            <li>Responsive Design</li>
          </SkillGroup>

          <SkillGroup title="Tools">
            <li>Git & GitHub</li>
            <li>VS Code</li>
          </SkillGroup>
        </Window>
      )}

      {active === "contact" && (
        <Window title="contact" onClose={() => setActive("home")}>
          <div className="contact-links">
            <a href="https://github.com/nischix" target="_blank">GitHub</a>
            <a href="https://www.linkedin.com/in/arnav-sood-9131b4372/" target="_blank">
              LinkedIn
            </a>
          </div>
        </Window>
      )}

      {modal === "portfolio" && (
        <Modal title="Personal Portfolio Website" onClose={() => setModal(null)}>
          <p>
            Built from scratch using React and TypeScript with a focus on clean UI,
            reusable components, and scalable architecture.
          </p>
          <ul>
            <li>Window-style navigation</li>
            <li>Dark, minimal interface</li>
            <li>Fully responsive layout</li>
          </ul>
        </Modal>
      )}

      {modal === "ideathon" && (
        <Modal title="Ideathon Winning Project" onClose={() => setModal(null)}>
          <p>
            Developed an AI-driven solution to identify early childhood
            developmental risks.
          </p>
          <ul>
            <li>Defined real-world problem</li>
            <li>Designed intelligent automation flow</li>
            <li>Secured 1st place</li>
          </ul>
        </Modal>
      )}
    </div>
  )
}

function Window({ title, onClose, children }: any) {
  return (
    <div className="window">
      <div className="window-bar">
        {title}
        {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
      </div>
      <div className="window-content">{children}</div>
    </div>
  )
}

function Icon({ icon, label, onClick }: any) {
  return (
    <div className="icon-item" onClick={onClick}>
      <div className="icon">{icon}</div>
      {label}
    </div>
  )
}

function Modal({ title, onClose, children }: any) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="window-bar">
          {title}
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="window-content">{children}</div>
      </div>
    </div>
  )
}

function SkillGroup({ title, children }: any) {
  return (
    <div className="skills-group">
      <h4>{title}</h4>
      <ul>{children}</ul>
    </div>
  )
}