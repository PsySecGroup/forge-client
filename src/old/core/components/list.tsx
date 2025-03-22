import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { For, JSX } from 'solid-js'

import styles from './css/list.module.css'

type Props = {
  items: JSX.Element[] // TODO change this to props.children
  renderItem?: (item: JSX.Element, index: number) => JSX.Element
  emptyState?: JSX.Element
  style?: Style
  classes?: Class
  itemClasses?: Class
  emptyClasses?: Class
}

/**
 * 
 */
export default function List (props: Props = { items: [] }) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles['listContainer'],
    {
      background: theme.palette.primary.background, // TODO theme stuff
      color: theme.palette.primary.text // TODO theme stuff
    }
  )

  const { classes: itemClasses  } = mergeStyle({
      classes: props.itemClasses as Class
    }, 
    styles['listItem']
  )

  const { classes: emptyClasses } = mergeStyle({
      classes: props.emptyClasses as Class
    }, 
    styles['emptyState']
  )

  // State
  const defaultRenderItem = (item: JSX.Element, index: number) => <span>{index + 1}. {item}</span>

  const {
    items,
    emptyState = (<div>No items</div>),
    renderItem = defaultRenderItem
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
            // TODO change this to props.children
            renderItem(item, index())
          }</div>}
        </For>
      ) : (
        emptyState || <div class={emptyClasses}>No items available</div>
      )}
    </div>
  )
}
