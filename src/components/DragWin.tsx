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
  minimized?: boolean
  onClose: (id: WinId) => void
  onFocus: (id: WinId) => void
  onMinimize?: (id: WinId) => void
  children: ReactNode
}

// ─── COMPONENT ─────────────────────────────────────────────────
export default function DragWin({ id, title, focused, minimized, onClose, onFocus, onMinimize, children }: TileWinProps) {
  return (
    <div
      className={`dwin ${focused ? "focused" : ""} ${minimized ? "minimized" : ""}`}
      onMouseDown={() => onFocus(id)}
      onTouchStart={() => onFocus(id)}
    >
      <div className="wbar">
        <div className="wdots">
          <div className="wd r"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onClose(id) }} />
          <div className="wd y"
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMinimize?.(id) }} />
          <div className="wd g" onMouseDown={e => e.stopPropagation()} />
        </div>
        <span className="wtitle">{title}</span>
      </div>
      <div className="wbody">{children}</div>
    </div>
  )
}