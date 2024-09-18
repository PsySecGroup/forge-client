import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { For, JSX } from 'solid-js'

import styles from './css/list.module.css'

type Props<T> = {
  items: T[]
  renderItem?: (item: T, index: number) => JSX.Element
  emptyState?: JSX.Element
  style?: Style
  classes?: Class
  itemClasses?: Class
  emptyClasses?: Class
}

const defaultRenderItem = (item, index) => <span>{index + 1}. {item}</span>

/**
 * 
 */
export default function List<T> (props: Props<T> = {}) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.listContainer,
    {
      background: theme.palette.primary.background,
      color: theme.palette.primary.text
    }
  )

  const { classes: itemClasses  } = mergeStyle({
      classes: props.itemClasses
    }, 
    styles.listItem
  )

  const { classes: emptyClasses } = mergeStyle({
      classes: props.emptyClasses
    }, 
    styles.emptyState
  )

  // State
  const {
    items,
    emptyState = (<div>No items</div>),
    renderItem = defaultRenderItem,
    className = ''
  } = props

  // Rendering
  return (
    <div
      class={classes}
      style={style}
    >
      {items.length > 0 ? (
        <For each={items}>
          {(item, index) => <div class={itemClasses}>{
            renderItem(item, index())
          }</div>}
        </For>
      ) : (
        emptyState || <div class={emptyClasses}>No items available</div>
      )}
    </div>
  )
}
