import { useState, useRef, useCallback } from "react"
import type { ReactNode } from "react"
import "./App.css"

import DragWin, { type WinId } from "./components/DragWin"
import TypingEffect from "./components/TypingEffect"
import characterFrame from "./assets/character.jpg"
import {
  AboutContent, ProjectsContent, AchievementsContent, SkillsContent,
  MusicContent, NowContent, ContactContent, RadioContent,
  PortfolioDetail, IdeathonDetail, AchIdeathonDetail,
} from "./components/ContentWindows"

// ─── NAV DATA ─────────────────────────────────────────────────
interface NavItem { id: WinId; icon: string; label: string }

const NAV: NavItem[] = [
  { id: "about",        icon: "ℹ",  label: "about" },
  { id: "projects",     icon: "📁", label: "projects" },
  { id: "achievements", icon: "🏆", label: "achievements" },
  { id: "skills",       icon: "⚡", label: "skills" },
  { id: "music",        icon: "🎸", label: "music" },
  { id: "radio",        icon: "📻", label: "radio" },
  { id: "now",          icon: "◎",  label: "now" },
  { id: "contact",      icon: "@",  label: "contact" },
]

// ─── WINDOW REGISTRY ─────────────────────────────────────────
interface WinMeta {
  title: string
  W: number
  C: (openWin: (id: WinId) => void) => ReactNode
}

const WINS: Record<WinId, WinMeta> = {
  about:          { title: "about.txt",          W: 460, C: ()   => <AboutContent /> },
  projects:       { title: "projects/",          W: 480, C: (ow) => <ProjectsContent openWin={ow} /> },
  achievements:   { title: "achievements.log",   W: 460, C: (ow) => <AchievementsContent openWin={ow} /> },
  skills:         { title: "skills.json",        W: 500, C: ()   => <SkillsContent /> },
  music:          { title: "music.wav",          W: 520, C: ()   => <MusicContent /> },
  radio:          { title: "radio.exe",           W: 420, C: ()   => <RadioContent /> },
  now:            { title: "now.log",            W: 400, C: ()   => <NowContent /> },
  contact:        { title: "contact.link",       W: 420, C: ()   => <ContactContent /> },
  proj_portfolio: { title: "portfolio — detail", W: 480, C: ()   => <PortfolioDetail /> },
  proj_ideathon:  { title: "ideathon — detail",  W: 480, C: ()   => <IdeathonDetail /> },
  ach_ideathon:   { title: "RE-IGNITE 2.0",      W: 500, C: ()   => <AchIdeathonDetail /> },
}

// ─── HELPERS ─────────────────────────────────────────────────
function spawnPos(n: number): { x: number; y: number } {
  if (window.innerWidth < 640) return { x: 8, y: 38 }
  return {
    x: Math.min(window.innerWidth  / 2 - 200 + n * 30, window.innerWidth  - 520),
    y: Math.max(50, window.innerHeight / 2 - 170 + n * 30),
  }
}

// ─── APP ─────────────────────────────────────────────────────
interface WinState { id: WinId; zIdx: number; spawnIdx: number }

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
      {/* Background */}
      <div className="city-bg" />
      <div className="noise" />

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

      {/* Character — radio launcher */}
      <div className="char-spot" onClick={() => openWin("radio")}>
        <img src={characterFrame} alt="radio character" className="char-widget" />
      </div>

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
