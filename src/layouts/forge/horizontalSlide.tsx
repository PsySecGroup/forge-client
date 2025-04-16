import styles from './css/buttonTray.module.css'
import { type ParentProps, createSignal, onMount, onCleanup, createEffect } from 'solid-js'

type Props = {}

export function HorizontalSlide ({ children }: ParentProps<Props>) {
  const [showLeftButton, setShowLeftButton] = createSignal(false)
  const [showRightButton, setShowRightButton] = createSignal(false)

  let isDragging = false
  let startX = 0
  let scrollLeftOffset = 0
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let containerRef!: HTMLDivElement

  // Check if scrolling is possible in either direction
  const checkScrollButtons = () => {
    if (!containerRef) {
      return
    }

    setShowLeftButton(
      containerRef.scrollLeft !== 0
    )
    
    setShowRightButton(
      containerRef.scrollLeft !== containerRef.scrollWidth - containerRef.clientWidth
    )
  }

  onMount(() => {
    // Check initial button visibility
    checkScrollButtons()
    
    // Set up scroll event listener
    if (containerRef) {
      containerRef.addEventListener('scroll', checkScrollButtons)
    }
    
    // Set up resize observer to recheck when container dimensions change
    const resizeObserver = new ResizeObserver(() => {
      checkScrollButtons()
    })
    
    if (containerRef) {
      resizeObserver.observe(containerRef)
    }
    
    onCleanup(() => {
      if (containerRef) {
        containerRef.removeEventListener('scroll', checkScrollButtons)
      }
      resizeObserver.disconnect()
    })
  })

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
      scrollLeftOffset = containerRef.scrollLeft
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
      checkScrollButtons()
    }
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

    containerRef.scrollLeft = scrollLeftOffset - walk
  }

  /**
   * Scroll the container left by one container width
   */
  const scrollLeft = () => {
    if (!containerRef) {
      return
    }
    
    const scrollDistance = containerRef.clientWidth
    const targetScroll = containerRef.scrollLeft - scrollDistance
    
    smoothScroll(targetScroll)
    checkScrollButtons()
  };

  /**
   * Scroll the container right by one container width
   */
  const scrollRight = () => {
    if (!containerRef) {
      return
    }
    
    const scrollDistance = containerRef.clientWidth
    const targetScroll = containerRef.scrollLeft + scrollDistance
    
    smoothScroll(targetScroll)
    checkScrollButtons()
  }

  const smoothScroll = (targetPosition: number) => {
    if (!containerRef) {
      return
    }
    
    // Ensure target is within bounds
    targetPosition = Math.max(0, Math.min(
      targetPosition, 
      containerRef.scrollWidth - containerRef.clientWidth
    ))
    
    containerRef.scrollTo({
      left: targetPosition,
      behavior: 'smooth'
    })
  }

  return (<div class={styles['horizontalSlide']}>
    <div class={styles['left']}>
      <button
        onClick={() => showLeftButton() && scrollLeft()}
        disabled={!showLeftButton()}
      >
        &lt;
      </button>
      <div class={styles['fade-right']} />
    </div>
    <div
      ref={el => (containerRef = el)}
      class={styles['middle']}
      style={{
        cursor: isDragging
          ? 'grabbing'
          : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      { children }
    </div>
    <div class={styles['right']}>
      <div class={styles['fade-left']} />
      <button 
        onClick={() => showRightButton() && scrollRight()}
        disabled={!showRightButton()}
      >
        &gt;
      </button>
    </div>
  </div>)
}
