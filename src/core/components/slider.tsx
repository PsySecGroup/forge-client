import type { Style, Class } from '../types/index'
import { mergeStyle } from '../utils/style'
import useTheme from '@suid/material/styles/useTheme'
import { Box } from '@suid/material'
import { batch, type JSX } from 'solid-js'
import { useStoreContext } from '../../core'

import styles from './css/slider.module.css'

type Props = {
  value: number
  min: number
  max: number
  name: string
  suffix?: string
  leftLabel?: string
  rightLabel?: string
  onUpdate?: () => void
  style?: Style
  classes?: Class
  sliderHeaderClasses?: Class
  sliderContainerClasses?: Class
  sliderClasses?: Class
  leftTextClasses?: Class
  rightTextClasses?: Class
}

/**
 * 
 */
export default function Slider (props: Props = {}): JSX.Element {
  // Styling
  const theme = useTheme()
  const { style, classes } = mergeStyle(
    props,
    styles.sliderComponent,
    {
      background: theme.palette.primary.background,
      color: theme.palette.primary.text
    }
  )

  const { classes: sliderHeaderClasses  } = mergeStyle({
      classes: props.sliderHeaderClasses
    }, 
    styles.sliderHeader
  )

  const { classes: sliderContainerClasses  } = mergeStyle({
      classes: props.sliderContainerClasses
    }, 
    styles.sliderContainer
  )

  const { classes: sliderClasses  } = mergeStyle({
      classes: props.sliderClasses
    }, 
    styles.slider
  )

  const { classes: leftTextClasses  } = mergeStyle({
      classes: props.leftTextClasses
    }, 
    styles.leftText
  )

  const { classes: rightTextClasses  } = mergeStyle({
      classes: props.rightTextClasses
    }, 
    styles.rightText
  )

  // State

  /**
   * 
   */
  const updateSlide = (e: any): void => {
    props.onUpdate(e.target.value)
  }

  const hasLabel = props.leftLabel !== undefined || props.rightLabel !== undefined
  const labelHeight = hasLabel
    ? '1em'
    : '0'

  return (
    <Box
      class={classes}
      style={style}
    >
      <div class={sliderHeaderClasses}>
        <span><b>{props.name}</b></span>
        <span>{0}{props.suffix ?? ''}</span>
      </div>
      <div class={sliderContainerClasses}>
        <input
          type='range'
          min={props.min}
          max={props.max}
          value={props.value}
          class={sliderClasses}
          onInput={updateSlide}
          id={`slider.${props.name}`}
        />
      </div>
      <div style={{ height: labelHeight }}>
        <span class={leftTextClasses}>{props.leftLabel ?? ''}</span>
        <span class={rightTextClasses}>{props.rightLabel ?? ''}</span>
      </div>
    </Box>
  )
}
