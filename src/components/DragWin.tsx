import { useState, useEffect } from "react"
import type { ReactNode } from "react"

// ─── TYPES ───────────────────────────────────────────────────
type WinId =
  | "about" | "projects" | "achievements" | "skills"
  | "music" | "now" | "contact" | "radio"
  | "proj_portfolio" | "proj_ideathon" | "ach_ideathon"

export type { WinId }

interface TileWinProps {
  id: WinId
  title: string
  focused: boolean
  onClose: (id: WinId) => void
  onFocus: (id: WinId) => void
  children: ReactNode
}

// ─── COMPONENT ─────────────────────────────────────────────────
export default function DragWin({ id, title, focused, onClose, onFocus, children }: TileWinProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <div
      className={`dwin ${focused ? "focused" : ""} ${isMobile ? "dwin-mobile" : ""}`}
      onMouseDown={() => onFocus(id)}
      onTouchStart={() => onFocus(id)}
    >
      <div className="wbar">
        <div className="wdots">
          {isMobile ? (
            <div
              className="wd-back"
              onClick={e => { e.stopPropagation(); onClose(id) }}
            >
              ← Back
            </div>
          ) : (
            <>
              <div className="wd r"
                onMouseDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); onClose(id) }} />
              <div className="wd y" onMouseDown={e => e.stopPropagation()} />
              <div className="wd g" onMouseDown={e => e.stopPropagation()} />
            </>
          )}
        </div>
        <span className="wtitle">{title}</span>
      </div>
      <div className="wbody">{children}</div>
    </div>
  )
}