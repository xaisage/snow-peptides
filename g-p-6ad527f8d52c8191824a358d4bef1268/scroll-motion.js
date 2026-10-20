const story = document.querySelector('[data-story]')
if (story && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const titles = ['Ein Label entsteht.', 'Details finden ihren Platz.', 'Die Marke wird sichtbar.']
  const descriptions = [
    'Einzelne grafische Elemente schweben auf die Vial zu.',
    'Farbe, Typografie und Details fügen sich zu einem Etikett zusammen.',
    'Ein klarer Markenentwurf entsteht Schritt für Schritt beim Scrollen.'
  ]
  let frame = -1
  let pending = false
  const update = () => {
    pending = false
    const travel = story.offsetHeight - window.innerHeight
    const progress = Math.max(0, Math.min(1, -story.getBoundingClientRect().top / Math.max(1, travel)))
    const stage = story.querySelector('.story-stage')
    stage.style.setProperty('--scroll-progress', progress.toFixed(3))
    stage.style.setProperty('--label-progress', progress.toFixed(3))
    stage.style.setProperty('--scene-progress', progress.toFixed(3))
    stage.style.setProperty('--scene-zoom', `${1.04 + progress * 0.08}`)
    stage.querySelector('.blue-vial').style.setProperty('--drift-y', `${(0.5 - progress) * 22}px`)
    stage.querySelector('.blue-vial').style.setProperty('--tilt', `${(progress - 0.5) * 2}deg`)
    stage.querySelector('.blue-vial').style.setProperty('--vial-scale', `${window.innerWidth <= 680 ? 0.76 + progress * 0.1 : 1.12 + progress * 0.14}`)
    stage.classList.toggle('is-late', progress > .32)
    stage.classList.toggle('is-final', progress > .67)
    const pieceMotion = {
      'label-piece-mark': [-35, -22, -28],
      'label-piece-title': [30, -12, 12],
      'label-piece-rule': [-28, 0, -12],
      'label-piece-copy': [-18, 16, 0],
      'label-piece-code': [30, 15, 0]
    }
    Object.entries(pieceMotion).forEach(([className, [x, y, angle]]) => {
      const piece = stage.querySelector(`.${className}`)
      const settle = 1 - progress
      piece.style.setProperty('--piece-x', `${x * settle}px`)
      piece.style.setProperty('--piece-y', `${y * settle}px`)
      piece.style.setProperty('--piece-r', `${angle * settle}deg`)
      piece.style.opacity = `${Math.max(0, Math.min(1, (0.72 - progress) / 0.3))}`
    })
    story.querySelector('.story-track i').style.width = `${progress * 100}%`
    const next = Math.min(2, Math.floor(progress * 3))
    if (next !== frame) {
      frame = next
      story.querySelector('#story-title').textContent = titles[frame]
      story.querySelector('#story-description').textContent = descriptions[frame]
      story.querySelector('#story-count').textContent = `0${frame + 1} / 03`
    }
  }
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(update) }
  }, { passive: true })
  window.addEventListener('resize', update)
  update()
}
