import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { For } from 'solid-js'

import styles from './css/breadcrumbs.module.css'

type Props = {
  links: { name: string, href: string }[]
  onLinkClick?: (href: string) => void
  style?: Style
  classes?: Class
  crumbClasses?: Class
  linkClasses?: Class
  separatorClasses?: Class
}

const defaultProps = {
  links: []
}

/**
 * 
 */
export default function BreadCrumbs (props: Props = defaultProps) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles['breadCrumbs'],
    {
      background: theme.palette.primary.background, // TODO theme stuff
      color: theme.palette.primary.text // TODO theme stuff
    }
  )

  const { classes: crumbClasses  } = mergeStyle({
      classes: props.crumbClasses as Class
    },
    styles['crumb']
  )

  const { classes: linkClasses  } = mergeStyle({
      classes: props.linkClasses as Class
    }, 
    styles['link']
  )

  const { classes: separatorClasses  } = mergeStyle({
      classes: props.separatorClasses as Class
    }, 
    styles['separator']
  )

  // State

  /**
   * 
   */
  const handleLinkClick = (href: string, event: MouseEvent) => {
    event.preventDefault()
    if (props.onLinkClick) props.onLinkClick(href)
  }

  // Rendering
  return (
    <nav
      class={classes}
      style={style}
    >
      <For each={props.links} fallback={<div>Loading...</div>}>
        {(link, index) => (
          <span class={crumbClasses}>
            <a
              href={link.href}
              class={linkClasses}
              onClick={(event) => handleLinkClick(link.href, event)}
            >
              {link.name}
            </a>
            {index() < props.links.length - 1 && <span class={separatorClasses}>/</span>}
          </span>
        )}
      </For>
    </nav>
  )
}
