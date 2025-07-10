import './css/pure-3.0.0.css'
import './css/pure-grids-responsive-3.0..0.css'
import styles from './css/index.module.css'
import { createEffect, createSignal, type JSXElement } from 'solid-js'
import { detectMobile } from '../../core/state/device'
import { AppBar } from './appBar'
import { LeftArea } from './leftArea'
import { MainArea } from './mainArea'

type Props = {
  appBar?: JSXElement
  left?: JSXElement
  main: JSXElement
  right?: JSXElement
  desktopActions: JSXElement
  mobileActions?: () => JSXElement[]
}

const mainStyle = `${styles['middle-column']} ${styles['inner-shadow']}`

export function ForgeLayout ({ appBar, left, right, main, desktopActions, mobileActions = () => [] }: Props) {
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
    
    <AppBar
      styleId={styles['app-bar']}
      title='Farad'
    >
      {appBar}
    </AppBar>

    <div class="pure-g">
      <LeftArea
        styleId={styles['left-column']}
      >
        {left}
      </LeftArea>
      
      <div class={getMainClasses()}>
        <MainArea
          desktopStyleId={styles['content']} 
          optionsStyleId={styles['options']}
          mobileActions={mobileActions}
          desktopActions={desktopActions}
          showOptions={() => (appBar === undefined)}
          isMobile={() => (isMobile() && mobileActions !== undefined)}
        >
          {main}
        </MainArea>
      </div>

      <LeftArea
        styleId={styles['right-column']}
      >
        {right}
      </LeftArea>

    </div>
    <p>Unrelated content</p>
   
  </div>)
}