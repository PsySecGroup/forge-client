import './css/pure-3.0.0.css'
import './css/pure-grids-responsive-3.0..0.css'
import styles from './css/index.module.css'
import { createEffect, createSignal, JSXElement, Show } from 'solid-js'
import { detectMobile } from '../../core/state/device'
import { ButtonTray } from './buttonTray'

type Props = {
  appBar?: JSXElement
  left?: JSXElement
  main: JSXElement
  right?: JSXElement
  desktopActions: JSXElement
  mobileActions?: JSXElement[]
}

const mainStyle = `${styles['middle-column']} ${styles['inner-shadow']}`

export function ForgeLayout ({ appBar, left, right, main, desktopActions, mobileActions = [] }: Props) {
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
          <p>Farad</p>
          {appBar}
        </div>
      </div>
    </Show>

    <div class="pure-g">
      <Show when={left !== undefined}>
        <div class={`${styles['left-column']} pure-u-md-1-5 pure-u-lg-1-8`}>
          {left}
        </div>
      </Show>
      
      <div class={getMainClasses()}>
        <div class={styles['content']}>
          {main}
        </div>

        <div
          style={{ top: appBar === undefined ? '0px' : '-32px' }}
          class={styles['options']}
        >
          <Show when={isMobile() && mobileActions !== undefined}>
            <ButtonTray buttons={mobileActions} />
          </Show>
          <Show when={isMobile() === false && desktopActions !== undefined}>
            {desktopActions}
          </Show>
        </div>
      </div>

      <Show when={right !== undefined}>
        <div class={`${styles['right-column']} pure-u-md-1-5 pure-u-lg-1-8`}>
          {right}
        </div>
      </Show>
    </div>
    <p>Unrelated content</p>
   
  </div>)
}