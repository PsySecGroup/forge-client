import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'

import styles from './css/breadcrumbs.module.css'

type BreadCrumbsProps = {
  links: { name: string, href: string }[]
  onLinkClick?: (href: string) => void
  style?: Style
  classes?: Class
  crumbClasses?: Class
  linkClasses?: Class
  separatorClasses?: Class
}

export default function BreadCrumbs (props: BreadCrumbsProps) {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.breadCrumbs,
    {
      background: theme.palette.primary.background,
      color: theme.palette.primary.text
    }
  )

  const { classes: crumbClasses  } = mergeStyle({
      classes: props.crumbClasses
    }, 
    styles.crumb
  )

  const { classes: linkClasses  } = mergeStyle({
      classes: props.linkClasses
    }, 
    styles.link
  )

  const { classes: separatorClasses  } = mergeStyle({
      classes: props.separatorClasses
    }, 
    styles.separator
  )

  // State
  const handleLinkClick = (href: string, event: MouseEvent) => {
    event.preventDefault()
    if (props.onLinkClick) props.onLinkClick(href)
  }

  return (
    <nav
      class={classes}
      style={style}
    >
      {props.links.map((link, index) => (
        <span class={crumbClasses} key={index}>
          <a
            href={link.href}
            class={linkClasses}
            onClick={(event) => handleLinkClick(link.href, event)}
          >
            {link.name}
          </a>
          {index < props.links.length - 1 && <span class={separatorClasses}>/</span>}
        </span>
      ))}
    </nav>
  )
}
