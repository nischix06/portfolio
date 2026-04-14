import { useState, useEffect } from "react"

export default function StatusBar({ focused }: { focused: string | null }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
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
        <span>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </div>
  )
}