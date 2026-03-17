import { useState, useEffect, useRef, useCallback } from "react"
import type { ReactNode } from "react"
import "./App.css"

// ─── TYPES ───────────────────────────────────────────────────
type WinId =
  | "about" | "projects" | "achievements" | "skills"
  | "music" | "now" | "contact"
  | "proj_portfolio" | "proj_ideathon" | "ach_ideathon"

interface WinState { id: WinId; zIdx: number; spawnIdx: number }

interface NavItem { id: WinId; icon: string; label: string }

interface WinMeta {
  title: string
  W: number
  C: (openWin: (id: WinId) => void) => ReactNode
}

// ─── DATA ────────────────────────────────────────────────────
const STREAMS = [
  { name: "lofi hip hop radio", freq: "98.3 FM",  icon: "📻", url: "https://stream.zeno.fm/0r0xa792kwzuv" },
  { name: "chillhop radio",     freq: "101.7 FM", icon: "🍃", url: "https://stream.zeno.fm/fyn8eh3h5f8uv" },
  { name: "lofi girl — beats",  freq: "104.5 FM", icon: "🌙", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
]

const PLAYLISTS = [
  { icon: "🎤", name: "Hip Hop Mix",  desc: "rap · trap · bars",           id: "37i9dQZF1EQnqst5TRi17F" },
  { icon: "🤘", name: "Rock Mix",     desc: "rock · alt · heavy",           id: "37i9dQZF1EQpj7X7UK8OOF" },
  { icon: "🎸", name: "Indie Mix",    desc: "indie · alternative · chill",  id: "37i9dQZF1EQqkOPvHGajmW" },
  { icon: "🇮🇳", name: "Nati Mix",   desc: "desi · indian · vernacular",   id: "37i9dQZF1EIVKUlCrzV0kA" },
  { icon: "🌊", name: "R&B Mix",      desc: "r&b · soul · smooth",          id: "37i9dQZF1EVHGWrwldPRtj" },
  { icon: "🎮", name: "Lofi Pokemon", desc: "lofi · chill · nostalgic",     id: "4Cs88ubDeFjs0b4xsVlb7M" },
]

const NAV: NavItem[] = [
  { id: "about",        icon: "ℹ",  label: "about" },
  { id: "projects",     icon: "📁", label: "projects" },
  { id: "achievements", icon: "🏆", label: "achievements" },
  { id: "skills",       icon: "⚡", label: "skills" },
  { id: "music",        icon: "🎸", label: "music" },
  { id: "now",          icon: "◎",  label: "now" },
  { id: "contact",      icon: "@",  label: "contact" },
]

// ─── HELPERS ─────────────────────────────────────────────────
function Clock() {
  const [t, setT] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return <>{t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>
}

function TypingEffect({ phrases }: { phrases: string[] }) {
  const [text, setText] = useState("")
  const [pi, setPi]     = useState(0)
  const [ci, setCi]     = useState(0)
  const [del, setDel]   = useState(false)
  useEffect(() => {
    const phrase = phrases[pi]
    const id = setTimeout(() => {
      if (!del) {
        if (ci < phrase.length) { setText(phrase.slice(0, ci + 1)); setCi(c => c + 1) }
        else setTimeout(() => setDel(true), 1600)
      } else {
        if (ci > 0) { setText(phrase.slice(0, ci - 1)); setCi(c => c - 1) }
        else { setDel(false); setPi(p => (p + 1) % phrases.length) }
      }
    }, del ? 36 : 72)
    return () => clearTimeout(id)
  }, [ci, del, pi, phrases])
  return <>{text}<span className="cur" /></>
}

// ─── RADIO SIDEBAR ────────────────────────────────────────────
type RadioStatus = "idle" | "loading" | "live" | "error"

function RadioSidebar() {
  const [open,    setOpen]    = useState(false)
  const [playing, setPlaying] = useState(true)
  const [vol,     setVol]     = useState(0.4)
  const [si,      setSi]      = useState(0)
  const [status,  setStatus]  = useState<RadioStatus>("loading")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = "" }
    const a = new Audio()
    a.crossOrigin = "anonymous"
    a.volume = vol
    a.onplaying = () => setStatus("live")
    a.onwaiting  = () => setStatus("loading")
    a.onerror    = () => setStatus("error")
    audioRef.current = a
    if (playing) { a.src = STREAMS[si].url; a.play().catch(() => setStatus("error")); setStatus("loading") }
    return () => { a.pause(); a.src = "" }
  }, [si])

  // autoplay on first mount
  useEffect(() => {
    const a = audioRef.current
    if (a && playing) {
      a.src = STREAMS[0].url
      a.play().catch(() => setStatus("error"))
    }
  }, [])

  useEffect(() => { if (audioRef.current) audioRef.current.volume = vol }, [vol])

  const toggle = () => {
    const a = audioRef.current; if (!a) return
    if (playing) { a.pause(); a.src = ""; setPlaying(false); setStatus("idle") }
    else { a.src = STREAMS[si].url; a.play().catch(() => setStatus("error")); setStatus("loading"); setPlaying(true) }
  }

  const pick = (i: number) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = "" }
    setPlaying(false); setStatus("idle"); setSi(i)
  }

  const isLive = status === "live"
  const airLabel: Record<RadioStatus, string> = {
    idle: "off air", loading: "connecting…", live: "● on air", error: "signal lost"
  }

  return (
    <>
      <div className="radio-tab" onClick={() => setOpen(o => !o)}>
        <div className="radio-tab-icon">📻</div>
        <div className="radio-tab-label">radio</div>
        <div className={`rtab-dot ${playing && isLive ? "" : "off"}`} />
      </div>

      <div className={`radio-sidebar ${open ? "open" : ""}`}>
        <div className="rs-head">
          <div className="rs-head-title"><span>📻</span> nischix.radio</div>
          <button className="rs-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="rs-body">
          <div className="rs-air">
            <div className={`rs-air-dot ${isLive ? "" : "off"}`} />
            <span className={`rs-air-txt ${isLive ? "on" : ""}`}>{airLabel[status]}</span>
          </div>

          <div className="rs-nowplaying">
            <div className="rs-np-label">now playing</div>
            <div className="rs-track">{STREAMS[si].icon} {STREAMS[si].name}</div>
            <div className={`rs-waveform ${isLive ? "" : "off"}`}>
              {[1,2,3,4,5].map(i => <span key={i} />)}
            </div>
          </div>

          <div className="rs-controls">
            <button className={`rs-play-btn ${playing ? "on" : ""}`} onClick={toggle}>
              {status === "loading" ? "…" : playing ? "⏸" : "▶"}
            </button>
            <div className="rs-vol-row">
              <span>🔈</span>
              <input className="rs-vol" type="range" min="0" max="1" step="0.02"
                value={vol} onChange={e => setVol(+e.target.value)} />
              <span>🔊</span>
            </div>
          </div>

          {status === "error" && <div className="rs-err">⚠ stream down — try another</div>}

          <div>
            <div className="rs-st-label">stations</div>
            {STREAMS.map((s, i) => (
              <div key={i} className={`rs-station ${si === i ? "active" : ""}`} onClick={() => pick(i)}>
                <span className="rs-station-icon">{s.icon}</span>
                <div>
                  <div className="rs-st-name">{s.name}</div>
                  <div className="rs-st-freq">{s.freq}</div>
                </div>
                {si === i && playing && isLive &&
                  <span style={{ marginLeft: "auto", color: "var(--amber)", fontSize: "0.62rem" }}>▶</span>}
              </div>
            ))}
          </div>

          <div>
            <div className="rs-pl-label">my playlists</div>
            {PLAYLISTS.map(pl => (
              <div key={pl.id} className="rs-pl-item">
                <div className="rs-pl-name">{pl.icon} {pl.name}</div>
                <iframe
                  src={`https://open.spotify.com/embed/playlist/${pl.id}?utm_source=generator&theme=0`}
                  width="100%" height="80" frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  style={{ borderRadius: "8px", border: "none" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── DRAG WINDOW ─────────────────────────────────────────────
interface DragWinProps {
  id: WinId
  title: string
  width: number
  initX: number
  initY: number
  zIdx: number
  focused: boolean
  onClose: (id: WinId) => void
  onFocus: (id: WinId) => void
  children: ReactNode
}

function DragWin({ id, title, width, initX, initY, zIdx, focused, onClose, onFocus, children }: DragWinProps) {
  const [pos, setPos] = useState({ x: initX, y: initY })
  const dragging = useRef(false)
  const offset   = useRef({ dx: 0, dy: 0 })
  const posRef   = useRef(pos); posRef.current = pos

  const onBarDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("wd")) return
    dragging.current = true
    offset.current = { dx: e.clientX - posRef.current.x, dy: e.clientY - posRef.current.y }
    e.preventDefault()
  }

  const onBarTouch = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).classList.contains("wd")) return
    dragging.current = true
    offset.current = {
      dx: e.touches[0].clientX - posRef.current.x,
      dy: e.touches[0].clientY - posRef.current.y,
    }
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setPos({
        x: Math.max(0, Math.min(e.clientX - offset.current.dx, window.innerWidth - width)),
        y: Math.max(28, Math.min(e.clientY - offset.current.dy, window.innerHeight - 80)),
      })
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      e.preventDefault()
      setPos({
        x: Math.max(0, Math.min(e.touches[0].clientX - offset.current.dx, window.innerWidth - width)),
        y: Math.max(28, Math.min(e.touches[0].clientY - offset.current.dy, window.innerHeight - 80)),
      })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onUp)
    }
  }, [width])

  return (
    <div
      className={`dwin ${focused ? "focused" : ""}`}
      style={{ position: "fixed", left: pos.x, top: pos.y, width, zIndex: zIdx, pointerEvents: "all" }}
      onMouseDown={() => onFocus(id)}
      onTouchStart={() => onFocus(id)}
    >
      <div className="wbar draggable" onMouseDown={onBarDown} onTouchStart={onBarTouch}>
        <div className="wdots">
          <div className="wd r"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onClose(id) }} />
          <div className="wd y" onMouseDown={e => e.stopPropagation()} />
          <div className="wd g" onMouseDown={e => e.stopPropagation()} />
        </div>
        <span className="wtitle">{title}</span>
      </div>
      <div className="wbody">{children}</div>
    </div>
  )
}

// ─── CONTENT COMPONENTS ──────────────────────────────────────
const AboutContent = () => (
  <>
    <p className="sec-text">B.Tech CSE student at Amity University Punjab. I live somewhere between the terminal and the notebook — writing code by day, lost in thought by night.</p>
    <p className="sec-text">Driven by curiosity, philosophy, and the quiet ache of wanting to make something real.</p>
    <div className="now-badge">🔨 currently building: portfolio v2 + freelance skills</div>
  </>
)

const ProjectsContent = ({ openWin }: { openWin: (id: WinId) => void }) => (
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

const PortfolioDetail = () => (
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

const IdeathonDetail = () => (
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

const AchievementsContent = ({ openWin }: { openWin: (id: WinId) => void }) => (
  <div className="ach-card" onClick={() => openWin("ach_ideathon")}>
    <h3>🏆 Winner — RE-IGNITE 2.0 Ideathon</h3>
    <p>Secured 1st position at an inter-university ideathon by HRFY.ai & Amity University.</p>
    <span className="card-arrow">→</span>
  </div>
)

const AchIdeathonDetail = () => (
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

const SkillsContent = () => (
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

const MusicContent = () => (
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

const NowContent = () => (
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

const ContactContent = () => (
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

// ─── WINDOW REGISTRY ─────────────────────────────────────────
const WINS: Record<WinId, WinMeta> = {
  about:          { title: "about.txt",          W: 460, C: ()   => <AboutContent /> },
  projects:       { title: "projects/",          W: 480, C: (ow) => <ProjectsContent openWin={ow} /> },
  achievements:   { title: "achievements.log",   W: 460, C: (ow) => <AchievementsContent openWin={ow} /> },
  skills:         { title: "skills.json",        W: 500, C: ()   => <SkillsContent /> },
  music:          { title: "music.wav",          W: 520, C: ()   => <MusicContent /> },
  now:            { title: "now.log",            W: 400, C: ()   => <NowContent /> },
  contact:        { title: "contact.link",       W: 420, C: ()   => <ContactContent /> },
  proj_portfolio: { title: "portfolio — detail", W: 480, C: ()   => <PortfolioDetail /> },
  proj_ideathon:  { title: "ideathon — detail",  W: 480, C: ()   => <IdeathonDetail /> },
  ach_ideathon:   { title: "RE-IGNITE 2.0",      W: 500, C: ()   => <AchIdeathonDetail /> },
}

function spawnPos(n: number): { x: number; y: number } {
  if (window.innerWidth < 640) return { x: 8, y: 38 }
  return {
    x: Math.min(window.innerWidth  / 2 - 200 + n * 30, window.innerWidth  - 520),
    y: Math.max(50, window.innerHeight / 2 - 170 + n * 30),
  }
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const [wins,    setWins]    = useState<WinState[]>([])
  const [focused, setFocused] = useState<WinId | null>(null)
  const zRef = useRef(20)

  const openWin = useCallback((id: WinId) => {
    zRef.current += 1; const z = zRef.current
    setWins(ws => {
      const ex = ws.find(w => w.id === id)
      if (ex) return ws.map(w => w.id === id ? { ...w, zIdx: z } : w)
      return [...ws, { id, zIdx: z, spawnIdx: ws.length }]
    })
    setFocused(id)
  }, [])

  const closeWin = useCallback((id: WinId) => {
    setWins(ws => ws.filter(w => w.id !== id))
    setFocused(f => f === id ? null : f)
  }, [])

  const focusWin = useCallback((id: WinId) => {
    zRef.current += 1; const z = zRef.current
    setWins(ws => ws.map(w => w.id === id ? { ...w, zIdx: z } : w))
    setFocused(id)
  }, [])

  return (
    <>
      {/* Sky background */}
      <div className="city-bg" />
      <div className="sky-cloud" style={{ width: 180, height: 38, top: 55,  left: "12%" }} />
      <div className="sky-cloud" style={{ width: 110, height: 28, top: 85,  left: "52%" }} />
      <div className="sky-cloud" style={{ width: 210, height: 46, top: 38,  left: "70%" }} />
      <div className="sky-cloud" style={{ width: 140, height: 32, top: 100, left: "34%" }} />
      <div className="noise" />

      {/* Status bar */}
      <div className="sbar">
        <div className="sbar-l">
          <div className="sdot" />
          <span>nischix.space</span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ color: "var(--amber)" }}>{focused ? focused + ".exe" : "home.exe"}</span>
        </div>
        <div className="sbar-r">
          <span>⚡ 94%</span>
          <span>▂▄▆</span>
          <Clock />
        </div>
      </div>

      {/* Home window — fixed centre */}
      <div className="desktop">
        <div className="home-win">
          <div className="wbar">
            <div className="wdots">
              <div className="wd r" style={{ opacity: 0.4, cursor: "default" }} />
              <div className="wd y" style={{ opacity: 0.4, cursor: "default" }} />
              <div className="wd g" style={{ opacity: 0.4, cursor: "default" }} />
            </div>
            <span className="wtitle">home.exe — nischix</span>
          </div>
          <div className="wbody">
            <h1 className="home-h1">Hi, I'm <span>Arnav Sood</span></h1>
            <p className="home-sub">aspiring computer engineer · @nischix</p>
            <p className="home-typing">
              <TypingEffect phrases={[
                "currently building cool things",
                "AI/ML · CS · freelancing",
                "reading books, thinking deeply",
                "listening to music, always",
              ]} />
            </p>
            <div className="icon-nav">
              {NAV.map(({ id, icon, label }) => (
                <div key={id} className="ic-item" onClick={() => openWin(id)}>
                  <div className="icbox">{icon}</div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Draggable windows */}
      {wins.map(({ id, zIdx, spawnIdx }) => {
        const meta = WINS[id]; if (!meta) return null
        const p = spawnPos(spawnIdx ?? 0)
        return (
          <DragWin
            key={id} id={id} title={meta.title} width={meta.W}
            initX={p.x} initY={p.y} zIdx={zIdx}
            focused={focused === id}
            onClose={closeWin} onFocus={focusWin}
          >
            {meta.C(openWin)}
          </DragWin>
        )
      })}

      {/* Animation placeholder */}
      <div className="char-spot">
        <div className="char-placeholder">
          <span className="c-ico">🎸</span>
          <span>animation</span>
          <span>coming soon</span>
        </div>
      </div>

      <RadioSidebar />

      {/* Dock */}
      <div className="dock">
        {NAV.map(({ id, icon, label }) => (
          <div
            key={id}
            className={`dock-item ${wins.find(w => w.id === id) ? "active" : ""}`}
            onClick={() => openWin(id)}
          >
            <div className="dock-box">{icon}</div>
            <span className="dock-label">{label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
map(({ id, icon, label }) => (
          <div
            key={id}
            className={`dock-item ${wins.find(w => w.id === id) ? "active" : ""}`}
            onClick={() => openWin(id)}
          >
            <div className="dock-box">{icon}</div>
            <span className="dock-label">{label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
