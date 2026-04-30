import { useEffect, useState } from "react"

interface BootScreenProps {
  onComplete: () => void
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<"boot" | "enter" | "done">("boot")
  const [lines, setLines] = useState<string[]>([])
  const [fadeOut, setFadeOut] = useState(false)

  const BOOT_LINES = [
    "nischix.space [version 1.0.0]",
    "loading kernel modules...",
    "mounting filesystem...",
    "starting window manager...",
    "initializing desktop...",
    "welcome, visitor.",
  ]

  // Phase 1: reveal lines one by one (no char-by-char, just line pop-in)
  useEffect(() => {
    if (phase !== "boot") return
    let idx = 0
    const interval = setInterval(() => {
      if (idx < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[idx]])
        idx++
      } else {
        clearInterval(interval)
        setTimeout(() => setPhase("enter"), 500)
      }
    }, 320)
    return () => clearInterval(interval)
  }, [phase])

  // Phase 2: show enter line then fade out
  useEffect(() => {
    if (phase !== "enter") return
    const t1 = setTimeout(() => {
      setLines(prev => [...prev, "$ entering desktop..."])
    }, 150)
    const t2 = setTimeout(() => setFadeOut(true), 900)
    const t3 = setTimeout(() => {
      setPhase("done")
      onComplete()
    }, 1500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [phase, onComplete])

  if (phase === "done") return null

  return (
    <div className={`boot-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="boot-inner">

        {/* Logo */}
        <div className="boot-logo">
          <span className="boot-logo-bracket">[</span>
          <span className="boot-logo-name">nischix</span>
          <span className="boot-logo-bracket">]</span>
        </div>

        {/* Terminal lines */}
        <div className="boot-terminal">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`boot-line ${
                line.startsWith("$") ? "boot-line-cmd" : ""
              } ${
                line === "welcome, visitor." ? "boot-line-welcome" : ""
              }`}
            >
              {line}
              {i === lines.length - 1 && (
                <span className="boot-cur" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="boot-bar">
          <span>nischix.space</span>
          <span>v1.0.0</span>
        </div>

      </div>
    </div>
  )
}
