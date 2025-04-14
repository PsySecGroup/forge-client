import styles from './css/buttonTray.module.css'
import { type ParentProps } from 'solid-js'

type Props = {}

export function HorizontalSlide ({ children }: ParentProps<Props>) {
  let isDragging = false
  let startX = 0
  let scrollLeft = 0
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let containerRef!: HTMLDivElement

/**
   * Mouse moves down, begin dragging and calculate click offset of the drag as
   * a reference point for the movement
   */
const handleMouseDown = (e: MouseEvent | TouchEvent) => {
  isDragging = true

  startX = (e as MouseEvent).pageX
    ?? (e as TouchEvent).touches[0]?.pageX
    ?? 0

  if (containerRef) {
    scrollLeft = containerRef.scrollLeft
  }

  lastX = startX
  lastTime = performance.now()

  // We add window listeners so that when the mouse leaves the container while down,
  // it doesn't end the drag
  window.addEventListener('mousemove', handleMouseMove as any)
  window.addEventListener('mouseup', handleMouseUp as any)
  window.addEventListener('touchmove', handleMouseMove as any, { passive: false })
  window.addEventListener('touchend', handleMouseUp as any)
}

/**
 * Mouse moves up, no longer dragging
 */
const handleMouseUp = () => {
  isDragging = false

  // Remove the window listeners
  window.removeEventListener('mousemove', handleMouseMove as any)
  window.removeEventListener('mouseup', handleMouseUp as any)
  window.removeEventListener('touchmove', handleMouseMove as any)
  window.removeEventListener('touchend', handleMouseUp as any)

  // Fling effect
  const friction = 0.95
  const animate = () => {
    if (Math.abs(velocity) < 0.1 || !containerRef) {
      return
    }

    containerRef.scrollLeft -= velocity * 50
    velocity *= friction
    requestAnimationFrame(animate)
  };
  requestAnimationFrame(animate)
}

/**
 * The mouse is moving while dragging, set the scroll left based on offsets
 */
const handleMouseMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging || !containerRef) {
    return
  }

  // Prepare values for fling calculations
  const now = performance.now()
  const x = (e as MouseEvent).pageX
    ?? (e as TouchEvent).touches[0]?.pageX
    ?? 0
  const walk = x - startX

  velocity = (x - lastX) / (now - lastTime)
  lastX = x
  lastTime = now

  containerRef.scrollLeft = scrollLeft - walk
}

  return (<div
    ref={el => (containerRef = el)}
    class={styles['tray']}
    style={{
      cursor: isDragging
        ? 'grabbing'
        : 'grab'
    }}
    onMouseDown={handleMouseDown}
    onTouchStart={handleMouseDown}
  >
    { children }
  </div>)
}