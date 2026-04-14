import type { ReactNode } from "react"
import type { WinId } from "./DragWin"

// ─── ABOUT ──────────────────────────────────────────────────
export const AboutContent = () => (
  <>
    <p className="sec-text">B.Tech CSE student at Amity University Punjab. I live somewhere between the terminal and the notebook — writing code by day, lost in thought by night.</p>
    <p className="sec-text">Driven by curiosity, philosophy, and the quiet ache of wanting to make something real.</p>
    <div className="now-badge">🔨 currently building: portfolio v2 + freelance skills</div>
  </>
)

// ─── PROJECTS ────────────────────────────────────────────────
export const ProjectsContent = ({ openWin }: { openWin: (id: WinId) => void }) => (
  <>
    <div className="card" onClick={() => openWin("proj_portfolio")}>
      <h3>Personal Portfolio Website</h3>
      <div className="tech-row">
        <span className="tech-tag">React</span>
        <span className="tech-tag">TypeScript</span>
        <span className="tech-tag">CSS</span>
      </div>
      <p>Window-based portfolio with clean UI and modular structure.</p>
      <span className="card-arrow">→</span>
    </div>
    <div className="card" onClick={() => openWin("proj_ideathon")}>
      <h3>Ideathon Winning Project</h3>
      <div className="tech-row">
        <span className="tech-tag">AI</span>
        <span className="tech-tag">Automation</span>
      </div>
      <p>AI-based solution that secured 1st place at RE-IGNITE 2.0.</p>
      <span className="card-arrow">→</span>
    </div>
  </>
)

// ─── PROJECT DETAILS ────────────────────────────────────────
export const PortfolioDetail = () => (
  <>
    <h2 className="detail-title">Personal Portfolio Website</h2>
    <div className="detail-sub">React · TypeScript · CSS · Netlify</div>
    <p className="detail-body">Built to reflect both technical skills and creative identity — something that feels like <em style={{ color: "var(--purple)" }}>me</em>.</p>
    <ul className="detail-list">
      <li>Draggable window navigation</li>
      <li>Lofi radio sidebar with live streams</li>
      <li>Deployed on Netlify via GitHub CI</li>
      <li>Responsive for mobile + desktop</li>
    </ul>
    <div className="detail-links">
      <a className="dlink" href="https://dulcet-genie-10ea34.netlify.app" target="_blank" rel="noreferrer">🌐 live site</a>
      <a className="dlink" href="https://github.com/nischix" target="_blank" rel="noreferrer">⌥ github</a>
    </div>
  </>
)

export const IdeathonDetail = () => (
  <>
    <h2 className="detail-title">RE-IGNITE 2.0 — Ideathon</h2>
    <div className="detail-sub">HRFY.ai × Amity University · 1st Place</div>
    <p className="detail-body">AI-driven solution to identify early childhood developmental risks. Won first place across multiple universities.</p>
    <ul className="detail-list">
      <li>Real-world problem in child development</li>
      <li>Intelligent automation & detection flow</li>
      <li>Pitched to industry judges from HRFY.ai</li>
      <li>Won inter-university competition</li>
    </ul>
  </>
)

// ─── ACHIEVEMENTS ───────────────────────────────────────────
export const AchievementsContent = ({ openWin }: { openWin: (id: WinId) => void }) => (
  <div className="ach-card" onClick={() => openWin("ach_ideathon")}>
    <h3>🏆 Winner — RE-IGNITE 2.0 Ideathon</h3>
    <p>Secured 1st position at an inter-university ideathon by HRFY.ai & Amity University.</p>
    <span className="card-arrow">→</span>
  </div>
)

export const AchIdeathonDetail = () => (
  <>
    <h2 className="detail-title">🏆 RE-IGNITE 2.0</h2>
    <div className="detail-sub">HRFY.ai × Amity University Punjab · Inter-university Ideathon</div>
    <p className="detail-body">Competed across multiple universities with an AI-driven solution for early childhood developmental risk identification.</p>
    <ul className="detail-list">
      <li>1st place — all competing teams</li>
      <li>Domain: child development & AI</li>
      <li>Organised by HRFY.ai × Amity University</li>
    </ul>
  </>
)

// ─── SKILLS ─────────────────────────────────────────────────
export const SkillsContent = () => (
  <div className="skills-grid">
    {[
      { t: "Programming", s: ["C / C++", "Python", "JavaScript", "TypeScript"] },
      { t: "Frontend",    s: ["React", "HTML & CSS", "Responsive Design"] },
      { t: "Tools",       s: ["Git & GitHub", "VS Code"] },
    ].map(({ t, s }) => (
      <div key={t} className="sk-card">
        <div className="sk-title">{t}</div>
        {s.map(x => <span key={x} className="sk-pill">{x}</span>)}
      </div>
    ))}
  </div>
)

// ─── MUSIC ───────────────────────────────────────────────────
export const MusicContent = () => {
  const PLAYLISTS = [
    { icon: "🎤", name: "Hip Hop Mix",  desc: "rap · trap · bars",           id: "37i9dQZF1EQnqst5TRi17F" },
    { icon: "🤘", name: "Rock Mix",     desc: "rock · alt · heavy",           id: "37i9dQZF1EQpj7X7UK8OOF" },
    { icon: "🎸", name: "Indie Mix",    desc: "indie · alternative · chill",  id: "37i9dQZF1EQqkOPvHGajmW" },
    { icon: "🇮🇳", name: "Nati Mix",   desc: "desi · indian · vernacular",   id: "37i9dQZF1EIVKUlCrzV0kA" },
    { icon: "🌊", name: "R&B Mix",      desc: "r&b · soul · smooth",          id: "37i9dQZF1EVHGWrwldPRtj" },
    { icon: "🎮", name: "Lofi Pokemon", desc: "lofi · chill · nostalgic",     id: "4Cs88ubDeFjs0b4xsVlb7M" },
  ]

  return (
    <>
      <div className="eq">{[1,2,3,4,5,6].map(i => <span key={i} />)}</div>
      <div className="music-sec-label">my playlists</div>
      <div className="playlist-grid">
        {PLAYLISTS.map(({ icon, name, desc }) => (
          <div key={name} className="pl-card">
            <div className="pl-icon">{icon}</div>
            <div>
              <div className="pl-name">{name}</div>
              <div className="pl-desc">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="music-sec-label">genres</div>
      <div className="genre-row">
        {["hip-hop", "rock", "indie", "desi", "r&b", "soul", "lofi", "atmospheric"].map(g => (
          <span key={g} className="genre-pill">♪ {g}</span>
        ))}
      </div>
      <div className="spotify-row">
        <span>🎵</span>
        <span>full library →</span>
        <a href="https://open.spotify.com/user/31ciw6jyjpo4adouaiztlawjjyce" target="_blank" rel="noreferrer">spotify profile</a>
      </div>
    </>
  )
}

// ─── NOW ─────────────────────────────────────────────────────
export const NowContent = () => (
  <ul className="now-list">
    {([
      ["📖", <><em>reading</em> — a good book, slowly</>],
      ["🎵", <><em>listening</em> — music, always</>],
      ["💻", <><em>building</em> — CS skills, AI/ML, freelance pipeline</>],
    ] as [string, ReactNode][]).map(([ico, txt], i) => (
      <li key={i} className="now-item">
        <span className="now-ico">{ico}</span>
        <span className="now-txt">{txt}</span>
      </li>
    ))}
  </ul>
)

// ─── CONTACT ─────────────────────────────────────────────────
export const ContactContent = () => (
  <div className="contact-links">
    {([
      ["📷 @nischix", "https://instagram.com/nischix"],
      ["✍️ substack", "https://nischix.substack.com"],
      ["⌥ github",   "https://github.com/nischix"],
      ["⌘ linkedin", "https://www.linkedin.com/in/arnav-sood-9131b4372/"],
    ] as [string, string][]).map(([l, h]) => (
      <a key={l} className="cbtn" href={h} target="_blank" rel="noreferrer">{l}</a>
    ))}
  </div>
)