import styles from './css/buttonTray.module.css'
import {
  For,
  createMemo,
  JSX,
  createSignal,
  createEffect,
  children as resolveChildren
} from 'solid-js'
import { HorizontalSlide } from './horizontalSlide'

type Props = {
  buttons: JSX.Element[]
}

export function ButtonTray ({ buttons }: Props) {
  const [clickCounts, setClickCounts] = createSignal<Record<string, number>>({})
  const [originalOrder, setOriginalOrder] = createSignal<string[]>([])
  
  // Use children() utility to properly resolve children
  const resolvedChildren = resolveChildren(() => buttons)
  const childrenArray = () => resolvedChildren.toArray();

  createEffect(() => {
    // Get the resolved children array
    const childArray = childrenArray()
    
    if (originalOrder().length === 0 && childArray.length > 0) {
      // Initially set the original order
      const newKeys: string[] = childArray.map((_, index) => `btn-${index}`)
      setOriginalOrder(newKeys)
    }
  })

  /**
   * 
   */
  const handleClick = (key: string) => {
    setClickCounts(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }))
  }

  /**
   * 
   */
  const sortedIndices = createMemo(() => {
    const counts = clickCounts()
    const original = originalOrder();
    const hasClicks = Object.values(counts).some(v => v > 0)
    
    return hasClicks
      ? [...original].sort((a, b) => (counts[b] || 0) - (counts[a] || 0))
          .map(key => original.indexOf(key))
      : original.map((_, i) => i)
  })

  return (
    <HorizontalSlide>
      <For each={sortedIndices()}>
        {index => {
          const key = originalOrder()[index] as string
          return (
            <div
              class={styles['itemContainer']}
              onClick={() => handleClick(key)}
            >
              {childrenArray()[index]}
            </div>
          );
        }}
      </For>
    </HorizontalSlide>
  )
}