import useTheme from '@suid/material/styles/useTheme'
import styles from './css/list.module.css'

import { For, JSX } from 'solid-js'

type ListProps<T> = {
  items: T[]
  renderItem: (item: T, index: number) => JSX.Element
  emptyState?: JSX.Element
  className?: string
}

export default function List<T> (props: ListProps<T>) {
  const theme = useTheme()
  const { items, renderItem, emptyState, className = '' } = props

  return (
    <div class={`${styles.listContainer} ${className}`}>
      {items.length > 0 ? (
        <For each={items}>
          {(item, index) => <div class={styles.listItem}>{
            renderItem(item, index())
          }</div>}
        </For>
      ) : (
        emptyState || <div class={styles.emptyState}>No items available</div>
      )}
    </div>
  )
}
