import './css/pure-3.0.0.css'
import './css/pure-grids-responsive-3.0..0.css'
import styles from './css/index.module.css'
import { createEffect, createSignal, JSXElement, Show } from 'solid-js'
import { detectMobile } from '../../core/state/device'
import { ButtonTray } from './buttonTray'
import { NavButton } from '../../components/NavButton'

type Props = {
  appBar?: JSXElement
  left?: JSXElement
  main: JSXElement
  right?: JSXElement
}

const mainStyle = `${styles['middle-column']} ${styles['inner-shadow']}`

export function ForgeLayout ({ appBar, left, right, main }: Props) {
  const { checkMobile, isMobileWidth } = detectMobile()

  const [isMobile, setIsMobile] = createSignal(isMobileWidth)

  const getMainClasses = () => {
    if (left === undefined && right !== undefined) {
      return `${mainStyle} pure-u-md-4-5 pure-u-lg-7-8`
    } else if (left !== undefined && right === undefined) {
      return `${mainStyle} pure-u-md-4-5 pure-u-lg-7-8`
    } else if (left === undefined && right === undefined) {
      return `${mainStyle} pure-u-md-1 pure-u-lg-1`
    } else {
      return `${mainStyle} pure-u-md-3-5 pure-u-lg-3-4`
    }
  }

  
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
      <Show when={left !== undefined}>
        <div class={`${styles['left-column']} pure-u-md-1-5 pure-u-lg-1-8`}>
          <p>Left Column</p>
          {left}
        </div>
      </Show>
      
      <div class={getMainClasses()}>
        <div class={styles['content']}>
          <p>Content (80% height)</p>
          <p>{isMobile()
          ? "We're in mobile"
          : "We're in desktop"}</p>
          {main}
        </div>

        <div class={styles['options']}>
          <Show when={isMobile()}>
            <ButtonTray>
              <NavButton location={'beep'}>a</NavButton>
              <button style={{ width: '500px' }}>b</button>
              <button style={{ width: '500px' }}>c</button>
            </ButtonTray>
          </Show>
        </div>
      </div>

      <Show when={right !== undefined}>
        <div class={`${styles['right-column']} pure-u-md-1-5 pure-u-lg-1-8`}>
          <p>Right Column</p>
          {right}
        </div>
      </Show>
    </div>
  </div>)
}