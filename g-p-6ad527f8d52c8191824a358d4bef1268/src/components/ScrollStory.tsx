import { useEffect, useState, type CSSProperties } from 'react'

const titles = ['Ein Label entsteht.', 'Details finden ihren Platz.', 'Die Marke wird sichtbar.']
const descriptions = [
  'Einzelne grafische Elemente schweben auf die Vial zu.',
  'Farbe, Typografie und Details fügen sich zu einem Etikett zusammen.',
  'Ein klarer Markenentwurf entsteht Schritt für Schritt beim Scrollen.',
]

export default function ScrollStory() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let pending = false
    const update = () => {
      pending = false
      const section = document.querySelector<HTMLElement>('[data-story]')
      if (!section) return
      const travel = section.offsetHeight - window.innerHeight
      setProgress(Math.max(0, Math.min(1, -section.getBoundingClientRect().top / Math.max(1, travel))))
    }
    const onScroll = () => {
      if (!pending) {
        pending = true
        window.requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [])
  const frame = Math.min(2, Math.floor(progress * 3))
  const style = {
    ['--scroll-progress' as string]: progress,
    ['--label-progress' as string]: progress,
    ['--scene-progress' as string]: progress,
    ['--scene-zoom' as string]: 1.04 + progress * 0.08,
  } as CSSProperties
  const vialStyle = {
    ['--drift-y' as string]: `${(0.5 - progress) * 16}px`,
    ['--tilt' as string]: `${(progress - 0.5) * 2}deg`,
    ['--vial-scale' as string]: `${window.innerWidth <= 680 ? 0.76 + progress * 0.1 : 1.12 + progress * 0.14}`,
  } as CSSProperties
  const pieceStyle = (x: number, y: number, angle: number): CSSProperties => {
    const settle = Math.max(0, 1 - progress)
    const visible = Math.max(0, Math.min(1, (0.72 - progress) / 0.3))
    return {
      ['--piece-x' as string]: `${x * settle}px`,
      ['--piece-y' as string]: `${y * settle}px`,
      ['--piece-r' as string]: `${angle * settle}deg`,
      opacity: visible,
    } as CSSProperties
  }
  return <section className="scroll-story" data-story aria-label="Scrollgesteuerte Markenanimation">
    <div className="story-sticky">
      <div className="story-copy">
        <p className="eyebrow">SCROLL MOMENT · LABEL STUDY</p>
        <h2>{titles[frame]}</h2>
        <p>{descriptions[frame]}</p>
        <div className="story-track"><i style={{ width: `${progress * 100}%` }} /></div>
        <span className="story-note">Konzeptanimation · keine Produktaufnahme · keine Anwendungshinweise</span>
      </div>
      <div className={`story-stage ${progress > .32 ? 'is-late' : ''} ${progress > .67 ? 'is-final' : ''}`} style={style}>
        <img className="story-background" src="/assets/molecular-world.png" alt="" aria-hidden="true" />
        <div className="scene-atmosphere" aria-hidden="true"><i /><b /><em /></div>
        <span className="story-index">ATELIER PEPTIDE <i>·</i> VISUAL STUDY 01</span>
        <div className="story-orbit orbit-a" /><div className="story-orbit orbit-b" />
        <div className="blue-vial" style={vialStyle}><div className="blue-cap" /><div className="blue-glass">
          <div className="label-piece label-piece-mark" style={pieceStyle(-35, -22, -28)}>A<span>+</span></div>
          <div className="label-piece label-piece-title" style={pieceStyle(30, -12, 12)}>ATELIER</div>
          <div className="label-piece label-piece-rule" style={pieceStyle(-28, 0, -12)} />
          <div className="label-piece label-piece-copy" style={pieceStyle(-18, 16, 0)}>RESEARCH<br />COLLECTION</div>
          <div className="label-piece label-piece-code" style={pieceStyle(30, 15, 0)}>STUDY 01 · CONCEPT</div>
          <div className="blue-label"><span className="label-mark">A<span>+</span></span><b>ATELIER</b><i /><small>RESEARCH COLLECTION</small><em>STUDY 01 · CONCEPT</em></div>
        </div></div>
        <span className="story-seal">FORM FOLLOWS SCIENCE</span>
        <span className="story-caption">SCROLL TO EXPLORE <b>↓</b></span>
        <span className="scene-number">01</span>
      </div>
    </div>
  </section>
}
