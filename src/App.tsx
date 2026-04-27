import { useState, useCallback, useMemo, useEffect } from "react"
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
  { id: "now",          icon: "◎",  label: "now" },
  { id: "contact",      icon: "@",  label: "contact" },
]

// ─── WINDOW REGISTRY ─────────────────────────────────────────
interface WinMeta {
  title: string
  C: (openWin: (id: WinId) => void) => ReactNode
}

const WINS: Record<WinId, WinMeta> = {
  about:          { title: "about.txt",          C: ()   => <AboutContent /> },
  projects:       { title: "projects/",          C: (ow) => <ProjectsContent openWin={ow} /> },
  achievements:   { title: "achievements.log",   C: (ow) => <AchievementsContent openWin={ow} /> },
  skills:         { title: "skills.json",        C: ()   => <SkillsContent /> },
  music:          { title: "music.wav",          C: ()   => <MusicContent /> },
  radio:          { title: "radio.exe",          C: ()   => <RadioContent /> },
  now:            { title: "now.log",            C: ()   => <NowContent /> },
  contact:        { title: "contact.link",       C: ()   => <ContactContent /> },
  proj_portfolio: { title: "portfolio — detail", C: ()   => <PortfolioDetail /> },
  proj_ideathon:  { title: "ideathon — detail",  C: ()   => <IdeathonDetail /> },
  ach_ideathon:   { title: "RE-IGNITE 2.0",      C: ()   => <AchIdeathonDetail /> },
}

// ─── BINARY SPLIT TREE ──────────────────────────────────────
type TileLeaf  = { type: "leaf";  id: WinId }
type TileSplit = { type: "split"; direction: "vertical" | "horizontal"; children: [TileNode, TileNode] }
type TileNode  = TileLeaf | TileSplit

/** Check if a window ID exists anywhere in the tree */
function containsId(node: TileNode, id: WinId): boolean {
  if (node.type === "leaf") return node.id === id
  return containsId(node.children[0], id) || containsId(node.children[1], id)
}

/** Collect all open window IDs from the tree */
function getOpenIds(node: TileNode | null): WinId[] {
  if (!node) return []
  if (node.type === "leaf") return [node.id]
  return [...getOpenIds(node.children[0]), ...getOpenIds(node.children[1])]
}

/** Get the depth of the shallowest leaf (largest tile) */
function shallowestLeafDepth(node: TileNode): number {
  if (node.type === "leaf") return 0
  return 1 + Math.min(
    shallowestLeafDepth(node.children[0]),
    shallowestLeafDepth(node.children[1])
  )
}

/** Insert a new window by splitting the largest (shallowest) leaf.
 *  Split direction alternates: even depth = vertical, odd = horizontal */
function insertTile(node: TileNode, id: WinId, depth: number = 0): TileNode {
  if (node.type === "leaf") {
    return {
      type: "split",
      direction: depth % 2 === 0 ? "vertical" : "horizontal",
      children: [node, { type: "leaf", id }],
    }
  }

  const leftDepth  = shallowestLeafDepth(node.children[0])
  const rightDepth = shallowestLeafDepth(node.children[1])

  if (leftDepth <= rightDepth) {
    return { ...node, children: [insertTile(node.children[0], id, depth + 1), node.children[1]] }
  }
  return { ...node, children: [node.children[0], insertTile(node.children[1], id, depth + 1)] }
}

/** Remove a window – its sibling absorbs the freed space */
function removeTile(node: TileNode, id: WinId): TileNode | null {
  if (node.type === "leaf") return node.id === id ? null : node

  const left  = removeTile(node.children[0], id)
  const right = removeTile(node.children[1], id)

  if (!left && !right) return null
  if (!left)  return right
  if (!right) return left

  return { ...node, children: [left, right] }
}

// ─── RECURSIVE TILE RENDERER ─────────────────────────────────
function TileRenderer({ node, focused, openWin, closeWin, focusWin }: {
  node: TileNode
  focused: WinId | null
  openWin:  (id: WinId) => void
  closeWin: (id: WinId) => void
  focusWin: (id: WinId) => void
}) {
  if (node.type === "leaf") {
    const meta = WINS[node.id]
    if (!meta) return null
    return (
      <DragWin
        id={node.id} title={meta.title}
        focused={focused === node.id}
        onClose={closeWin} onFocus={focusWin}
      >
        {meta.C(openWin)}
      </DragWin>
    )
  }

  return (
    <div className={`tile-split tile-${node.direction}`}>
      <div className="tile-half">
        <TileRenderer
          node={node.children[0]} focused={focused}
          openWin={openWin} closeWin={closeWin} focusWin={focusWin}
        />
      </div>
      <div className="tile-half">
        <TileRenderer
          node={node.children[1]} focused={focused}
          openWin={openWin} closeWin={closeWin} focusWin={focusWin}
        />
      </div>
    </div>
  )
}

// ─── MOBILE DETECTION ────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// ─── APP ─────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile()
  const [tree,    setTree]    = useState<TileNode | null>(null)
  const [focused, setFocused] = useState<WinId | null>(null)

  const openIds = useMemo(() => getOpenIds(tree), [tree])
  const activeApp = isMobile && openIds.length > 0 ? openIds[openIds.length - 1] : null

  const openWin = useCallback((id: WinId) => {
    setTree(t => {
      if (!t) return { type: "leaf", id }
      if (isMobile) {
        // Mobile: only one app at a time
        return { type: "leaf", id }
      }
      if (containsId(t, id)) return t          // already open — no-op
      return insertTile(t, id)
    })
    setFocused(id)
  }, [isMobile])

  const closeWin = useCallback((id: WinId) => {
    setTree(t => t ? removeTile(t, id) : null)
    setFocused(f => (f === id ? null : f))
  }, [])

  const focusWin = useCallback((id: WinId) => {
    setFocused(id)
  }, [])

  return (
    <>
      {/* Background */}
      <div className="city-bg" />
      <div className="noise" />

      {/* Home window — hidden on mobile when app is open */}
      <div className={`home-layer ${activeApp ? 'home-hidden' : ''}`}>
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

      {/* Tiling workspace — binary split tree (desktop only) */}
      {!isMobile && tree && (
        <div className="tile-workspace">
          <TileRenderer
            node={tree} focused={focused}
            openWin={openWin} closeWin={closeWin} focusWin={focusWin}
          />
        </div>
      )}

      {/* Mobile fullscreen windows */}
      {isMobile && tree && (
        <div className="mobile-workspace">
          <TileRenderer
            node={tree} focused={focused}
            openWin={openWin} closeWin={closeWin} focusWin={focusWin}
          />
        </div>
      )}

      {/* Character — radio launcher + hand-drawn callout (desktop only) */}
      {!isMobile && (
        <div className="char-spot" onClick={() => openWin("radio")}>
          <div className="char-note">
            <div className="char-text">
              <span>it's me :3</span>
              <small>click me</small>
            </div>
            <svg className="char-arrow" viewBox="0 0 70 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 45 C12 38, 20 15, 55 10" stroke="rgba(120,100,160,0.6)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M49 4 L58 10 L48 16" stroke="rgba(120,100,160,0.6)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <img src={characterFrame} alt="radio character" className="char-widget" />
        </div>
      )}

      {/* Dock (desktop only) */}
      {!isMobile && (
        <div className="dock">
          {NAV.map(({ id, icon, label }) => (
            <div
              key={id}
              className={`dock-item ${openIds.includes(id) ? "active" : ""}`}
              onClick={() => openWin(id)}
            >
              <div className="dock-box">{icon}</div>
              <span className="dock-label">{label}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
