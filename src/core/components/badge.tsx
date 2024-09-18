import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import styles from './css/badge.module.css'

type Props = {
  label: string | JSX.Element
  color?: 'primary' | 'secondary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
  disabled?: boolean
  count?: number
  position?: 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right'
  style?: Style
  classes?: Class
  positionClasses?: Class
}

/**
 * 
 */
export default function Badge (props: Props = {}) {
  // Styling
  const theme = useTheme()

  /**
   * 
   */
  const getColorStyle = () => {
    if (props.disabled) {
      return {
        backgroundColor: theme.palette.grey[300],
        color: theme.palette.grey[500]
      }
    }

    switch (props.color) {
      case 'primary':
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText
        }
      case 'secondary':
        return {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText
        }
      case 'success':
        return {
          backgroundColor: theme.palette.success.main,
          color: theme.palette.success.contrastText
        }
      case 'danger':
        return {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText
        }
      default:
        return {}
    }
  }

  /**
   * 
   */
  const getBadgeClass = () => {
    let baseClass = styles.badge
    if (props.size === 'small') baseClass += ` ${styles.small}`
    else if (props.size === 'large') baseClass += ` ${styles.large}`
    else baseClass += ` ${styles.medium}` // Default size is medium

    // if (props.className) baseClass += ` ${props.className}`

    return baseClass
  }

  /**
   * 
   */
  const getPositionClass = () => {
    switch (props.position) {
      case 'upper-left':
        return styles.upperLeft
      case 'upper-right':
        return styles.upperRight
      case 'lower-left':
        return styles.lowerLeft
      case 'lower-right':
        return styles.lowerRight
      default:
        return styles.upperRight // Default to upper-right
    }
  }

  const { style, classes } = mergeStyle(
    props,
    getBadgeClass(),
    getColorStyle()
  )

  const { classes: positionClasses  } = mergeStyle({
      classes: props.positionClasses
    }, 
    [styles.badgeCount, getPositionClass()]
  )

  // Rendering
  return (
    <div 
      class={classes} 
      style={style} 
      onClick={() => !props.disabled && props.onClick?.()}
    >
      {props.label}
      {props.count !== undefined && (
        <span class={positionClasses}>
          {props.count}
        </span>
      )}
    </div>
  )
}
