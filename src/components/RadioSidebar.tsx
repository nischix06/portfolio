import { useState, useRef, useEffect } from "react"

// ─── DATA ────────────────────────────────────────────────────
// Using SomaFM streams — they're CORS-friendly and reliable
const STREAMS = [
  { name: "Groove Salad",      freq: "128k MP3", icon: "📻", url: "https://ice5.somafm.com/groovesalad-128-mp3" },
  { name: "Beat Blender",       freq: "128k MP3", icon: "🎧", url: "https://ice5.somafm.com/beatblender-128-mp3" },
  { name: "Secret Agent",       freq: "128k MP3", icon: "🌙", url: "https://ice5.somafm.com/secretagent-128-mp3" },
]

const PLAYLISTS = [
  { icon: "🎤", name: "Hip Hop Mix",  desc: "rap · trap · bars",           id: "37i9dQZF1EQnqst5TRi17F" },
  { icon: "🤘", name: "Rock Mix",     desc: "rock · alt · heavy",           id: "37i9dQZF1EQpj7X7UK8OOF" },
  { icon: "🎸", name: "Indie Mix",    desc: "indie · alternative · chill",  id: "37i9dQZF1EQqkOPvHGajmW" },
  { icon: "🇮🇳", name: "Nati Mix",   desc: "desi · indian · vernacular",   id: "37i9dQZF1EIVKUlCrzV0kA" },
  { icon: "🌊", name: "R&B Mix",      desc: "r&b · soul · smooth",          id: "37i9dQZF1EVHGWrwldPRtj" },
  { icon: "🎮", name: "Lofi Pokemon", desc: "lofi · chill · nostalgic",     id: "4Cs88ubDeFjs0b4xsVlb7M" },
]

type RadioStatus = "idle" | "loading" | "live" | "error"

export default function RadioSidebar() {
  const [open,    setOpen]    = useState(false)
  const [playing, setPlaying] = useState(true)
  const [vol,     setVol]     = useState(0.4)
  const [si,      setSi]      = useState(0)
  const [status,  setStatus]  = useState<RadioStatus>("loading")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Create audio element once on mount
  useEffect(() => {
    const a = new Audio()
    a.volume = vol
    a.onplaying = () => setStatus("live")
    a.onwaiting  = () => setStatus("loading")
    a.onerror    = () => setStatus("error")
    audioRef.current = a

    // Start playing initial station
    a.src = STREAMS[0].url
    a.play().catch(() => setStatus("error"))
    setStatus("loading")

    return () => { a.pause(); a.src = ""; a.load() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync volume
  useEffect(() => { if (audioRef.current) audioRef.current.volume = vol }, [vol])

  // Switch station when si changes (but not on initial mount)
  const siChanged = useRef(false)
  useEffect(() => {
    if (!siChanged.current) { siChanged.current = true; return }
    const a = audioRef.current; if (!a) return
    a.pause()
    a.src = STREAMS[si].url
    if (playing) {
      a.play().catch(() => setStatus("error"))
      setStatus("loading")
    }
  }, [si, playing]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const a = audioRef.current; if (!a) return
    if (playing) {
      a.pause(); a.src = ""; a.load()
      setPlaying(false); setStatus("idle")
    } else {
      a.src = STREAMS[si].url
      a.play().catch(() => setStatus("error"))
      setStatus("loading"); setPlaying(true)
    }
  }

  const pick = (i: number) => {
    if (i === si && playing) return
    setSi(i)
    if (!playing) setPlaying(true)
  }

  const isLive = status === "live"
  const airLabel: Record<RadioStatus, string> = {
    idle: "off air", loading: "connecting…", live: "● on air", error: "signal lost"
  }

  return (
    <>
      <div className="radio-tab" onClick={() => setOpen(o => !o)} role="button" aria-label="Toggle radio sidebar">
        <div className="radio-tab-icon">📻</div>
        <div className="radio-tab-label">radio</div>
        <div className={`rtab-dot ${playing && isLive ? "" : "off"}`} />
      </div>

      <div className={`radio-sidebar ${open ? "open" : ""}`}>
        <div className="rs-head">
          <div className="rs-head-title"><span>📻</span> nischix.radio</div>
          <button className="rs-close" onClick={() => setOpen(false)} aria-label="Close radio">✕</button>
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
            <button className={`rs-play-btn ${playing ? "on" : ""}`} onClick={toggle}
              aria-label={playing ? "Pause" : "Play"}>
              {status === "loading" ? "…" : playing ? "⏸" : "▶"}
            </button>
            <div className="rs-vol-row">
              <span>🔈</span>
              <input className="rs-vol" type="range" min="0" max="1" step="0.02"
                value={vol} onChange={e => setVol(+e.target.value)} aria-label="Volume" />
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
                  title={`${pl.name} playlist`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}