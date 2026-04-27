import { useState, useRef, useEffect } from "react"
import type { ReactNode } from "react"

// ─── TYPES ───────────────────────────────────────────────────
type WinId =
  | "about" | "projects" | "achievements" | "skills"
  | "music" | "now" | "contact" | "radio"
  | "proj_portfolio" | "proj_ideathon" | "ach_ideathon"

export type { WinId }

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

// ─── COMPONENT ─────────────────────────────────────────────────
export default function DragWin({ id, title, width, initX, initY, zIdx, focused, onClose, onFocus, children }: DragWinProps) {
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
        y: Math.max(0, Math.min(e.clientY - offset.current.dy, window.innerHeight - 80)),
      })
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return
      e.preventDefault()
      setPos({
        x: Math.max(0, Math.min(e.touches[0].clientX - offset.current.dx, window.innerWidth - width)),
        y: Math.max(0, Math.min(e.touches[0].clientY - offset.current.dy, window.innerHeight - 80)),
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