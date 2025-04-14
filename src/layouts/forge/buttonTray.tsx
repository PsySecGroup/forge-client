// SortableScrollButtons.tsx
import {
  For,
  createMemo,
  JSX,
  createSignal,
  createEffect
} from 'solid-js'

type Props = {
  children: JSX.Element[]
}

export function ButtonTray (props: Props) {
  const [clickCounts, setClickCounts] = createSignal<Record<string, number>>({})
  const [originalOrder, setOriginalOrder] = createSignal<string[]>([])
  const [keyToButton, setKeyToButton] = createSignal<Record<string, JSX.Element>>({})

  let isDragging = false
  let startX = 0
  let scrollLeft = 0
  let lastX = 0
  let lastTime = 0
  let velocity = 0
  let containerRef!: HTMLDivElement

  createEffect(() => {
    if (originalOrder().length === 0 && props.children.length > 0) {
      // Keys have not been assigned yet, generate them
      const newKeys: string[] = []
      const newMap: Record<string, JSX.Element> = {}

      props.children.forEach((child, index) => {
        // Generate a key per button and its mapping
        const key = `btn-${index}`
        newKeys.push(key)
        newMap[key] = child
      })

      // Populate keys and the map
      setOriginalOrder(newKeys)
      setKeyToButton(newMap)
    }
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

  /**
   * A button has been clicked, iterate the click count to adjust most popular order
   */
  const handleClick = (key: string) => {
    setClickCounts(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }))
  }

  /**
   * Calculate the order of the buttons based on historical click activity
   */
  const sortedButtons = createMemo(() => {
    const counts = clickCounts();
    const original = originalOrder();
    const hasClicks = Object.values(counts).some(v => v > 0);

    return hasClicks
      // Sort buttons by most historical clicks
      ? [...original].sort((a, b) => (counts[b] || 0) - (counts[a] || 0))
      // Use the original order of the buttons
      : original;
  });

  return (
    <div
      ref={el => (containerRef = el)}
      style={{
        display: 'flex',
        'overflow-x': 'hidden',
        'user-select': 'none',
        'touch-action': 'pan-x',
        cursor: isDragging
          ? 'grabbing'
          : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      <For each={sortedButtons()}>
        {key => (
          <div
            style={{ 'margin-right': '1rem', flex: '0 0 auto' }}
            onClick={() => handleClick(key)}
          >
            {keyToButton()[key]}
          </div>
        )}
      </For>
    </div>
  )
}
