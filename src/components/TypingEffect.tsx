import { useState, useEffect } from "react"
import type { ReactNode } from "react"

export default function TypingEffect({ phrases }: { phrases: string[] }) {
  const [text, setText] = useState("")
  const [pi, setPi]     = useState(0)
  const [ci, setCi]     = useState(0)
  const [del, setDel]   = useState(false)

  // Use a simple interval-based approach
  useEffect(() => {
    const phrase = phrases[pi]
    let timeout: ReturnType<typeof setTimeout>

    if (!del) {
      if (ci < phrase.length) {
        timeout = setTimeout(() => {
          setText(phrase.slice(0, ci + 1))
          setCi(c => c + 1)
        }, 72)
      } else {
        timeout = setTimeout(() => setDel(true), 1600)
      }
    } else {
      if (ci > 0) {
        timeout = setTimeout(() => {
          setText(phrase.slice(0, ci - 1))
          setCi(c => c - 1)
        }, 36)
      } else {
        setDel(false)
        setPi(p => (p + 1) % phrases.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [ci, del, pi, phrases])

  return <>{text}<span className="cur" /></>
}