import { useState, useEffect, useRef, useCallback } from "react"
import type { ReactNode } from "react"
import "./App.css"

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

const NAV: NavItem[] = [
  { id: "about", icon: "ℹ", label: "about" },
  { id: "projects", icon: "📁", label: "projects" },
  { id: "achievements", icon: "🏆", label: "achievements" },
  { id: "skills", icon: "⚡", label: "skills" },
  { id: "music", icon: "🎸", label: "music" },
  { id: "now", icon: "◎", label: "now" },
  { id: "contact", icon: "@", label: "contact" },
]

function Clock() {
  const [t, setT] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </>
  )
}

function TypingEffect({ phrases }: { phrases: string[] }) {

  const [text, setText] = useState("")
  const [pi, setPi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)

  useEffect(() => {

    const phrase = phrases[pi]

    const id = setTimeout(() => {

      if (!del) {

        if (ci < phrase.length) {
          setText(phrase.slice(0, ci + 1))
          setCi(c => c + 1)
        } else {
          setTimeout(() => setDel(true), 1600)
        }

      } else {

        if (ci > 0) {
          setText(phrase.slice(0, ci - 1))
          setCi(c => c - 1)
        } else {
          setDel(false)
          setPi(p => (p + 1) % phrases.length)
        }

      }

    }, del ? 40 : 70)

    return () => clearTimeout(id)

  }, [ci, del, pi, phrases])

  return (
    <>
      {text}
      <span className="cur" />
    </>
  )
}

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

function DragWin({
  id,
  title,
  width,
  initX,
  initY,
  zIdx,
  focused,
  onClose,
  onFocus,
  children
}: DragWinProps) {

  const [pos, setPos] = useState({ x: initX, y: initY })
  const dragging = useRef(false)
  const offset = useRef({ dx: 0, dy: 0 })

  const onBarDown = (e: React.MouseEvent) => {
    dragging.current = true
    offset.current = {
      dx: e.clientX - pos.x,
      dy: e.clientY - pos.y
    }
  }

  useEffect(() => {

    const move = (e: MouseEvent) => {

      if (!dragging.current) return

      setPos({
        x: e.clientX - offset.current.dx,
        y: e.clientY - offset.current.dy
      })

    }

    const up = () => dragging.current = false

    window.addEventListener("mousemove", move)
    window.addEventListener("mouseup", up)

    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseup", up)
    }

  }, [pos])

  return (
    <div
      className={`dwin ${focused ? "focused" : ""}`}
      style={{ left: pos.x, top: pos.y, width, zIndex: zIdx, position: "fixed" }}
      onMouseDown={() => onFocus(id)}
    >

      <div className="wbar draggable" onMouseDown={onBarDown}>

        <div className="wdots">
          <div className="wd r" onClick={() => onClose(id)} />
          <div className="wd y" />
          <div className="wd g" />
        </div>

        <span className="wtitle">{title}</span>

      </div>

      <div className="wbody">
        {children}
      </div>

    </div>
  )
}

const WINS: Record<WinId, WinMeta> = {

  about: { title: "about.txt", W: 460, C: () => <>about me</> },
  projects: { title: "projects/", W: 480, C: () => <>projects</> },
  achievements: { title: "achievements.log", W: 460, C: () => <>achievements</> },
  skills: { title: "skills.json", W: 500, C: () => <>skills</> },
  music: { title: "music.wav", W: 520, C: () => <>music</> },
  now: { title: "now.log", W: 400, C: () => <>now</> },
  contact: { title: "contact.link", W: 420, C: () => <>contact</> },
  proj_portfolio: { title: "portfolio", W: 480, C: () => <>portfolio</> },
  proj_ideathon: { title: "ideathon", W: 480, C: () => <>ideathon</> },
  ach_ideathon: { title: "achievement", W: 500, C: () => <>achievement</> },

}

function spawnPos(n: number) {
  return {
    x: window.innerWidth / 2 - 200 + n * 30,
    y: window.innerHeight / 2 - 170 + n * 30
  }
}

export default function App() {

  const [wins, setWins] = useState<WinState[]>([])
  const [focused, setFocused] = useState<WinId | null>(null)

  const zRef = useRef(20)

  const openWin = useCallback((id: WinId) => {

    zRef.current++
    const z = zRef.current

    setWins(ws => {

      const ex = ws.find(w => w.id === id)

      if (ex) {
        return ws.map(w => w.id === id ? { ...w, zIdx: z } : w)
      }

      return [...ws, { id, zIdx: z, spawnIdx: ws.length }]

    })

    setFocused(id)

  }, [])

  const closeWin = useCallback((id: WinId) => {
    setWins(ws => ws.filter(w => w.id !== id))
    setFocused(null)
  }, [])

  const focusWin = useCallback((id: WinId) => {

    zRef.current++
    const z = zRef.current

    setWins(ws =>
      ws.map(w => w.id === id ? { ...w, zIdx: z } : w)
    )

    setFocused(id)

  }, [])

  return (

    <>

      <div className="city-bg" />

      <div className="sbar">

        <div className="sbar-l">
          <div className="sdot" />
          <span>nischix.space</span>
        </div>

        <div className="sbar-r">
          <Clock />
        </div>

      </div>

      <div className="desktop">

        <div className="home-win">

          <div className="wbar">
            <span className="wtitle">home.exe — nischix</span>
          </div>

          <div className="wbody">

            <h1>
              Hi, I'm <span>Arnav Sood</span>
            </h1>

            <p className="home-typing">
              <TypingEffect
                phrases={[
                  "currently building cool things",
                  "AI/ML · CS · freelancing",
                  "reading books",
                  "listening to music"
                ]}
              />
            </p>

            <div className="icon-nav">

              {NAV.map(({ id, icon, label }) => (

                <div key={id} onClick={() => openWin(id)}>

                  <div>{icon}</div>
                  <span>{label}</span>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

      {wins.map(({ id, zIdx, spawnIdx }) => {

        const meta = WINS[id]
        const p = spawnPos(spawnIdx)

        return (

          <DragWin
            key={id}
            id={id}
            title={meta.title}
            width={meta.W}
            initX={p.x}
            initY={p.y}
            zIdx={zIdx}
            focused={focused === id}
            onClose={closeWin}
            onFocus={focusWin}
          >

            {meta.C(openWin)}

          </DragWin>

        )

      })}

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
