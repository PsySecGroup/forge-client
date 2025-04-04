import './css/pure-3.0.0.css'
import './css/pure-grids-responsive-3.0..0.css'
import styles from './css/index.module.css'
import { createEffect, createSignal, JSXElement, Show } from 'solid-js'
import { detectMobile } from '../../core/state/device'

type Props = {
  appBar?: JSXElement
  left: JSXElement
  middle: JSXElement
  right: JSXElement
}

export function ForgeLayout ({ appBar, left, right, middle }: Props) {
  const { checkMobile, isMobileWidth } = detectMobile()

  const [isMobile, setIsMobile] = createSignal(isMobileWidth)
  
  createEffect(() => {
    checkMobile(setIsMobile)
  })

  return (<div class={styles['layout']}>
    <Show when={appBar !== undefined}>
      <div class="pure-g">
        <div class={`${styles['app-bar']} pure-u-1`}>
          <p>Top</p>
          {appBar}
        </div>
      </div>
    </Show>
    <div class="pure-g">
      <div class={`${styles['left-column']} pure-u-md-1-5 pure-u-lg-1-8`}>
        <p>Left Column</p>
        {left}
      </div>
      
      <div class={`${styles['middle-column']} ${styles['inner-shadow']} pure-u-md-3-5 pure-u-lg-3-4`}>
        <div class={styles['content']}>
          <p>Content (80% height)</p>
          <p>{isMobile()
          ? "We're in mobile"
          : "We're in desktop"}</p>
          {middle}
        </div>
        <div class={styles['options']}>
          <p>Options (20% height)</p>
        </div>
      </div>
      
      <div class={`${styles['right-column']} pure-u-md-1-5 pure-u-lg-1-8`}>
        <p>Right Column</p>
        {right}
      </div>
    </div>
  </div>)
}