import { type JSXElement, type ParentProps, Show, useContext } from 'solid-js'
import { ButtonTray } from './buttonTray'
import { NavigationContext } from '../../core'

type Props = {
  desktopStyleId: string | undefined
  optionsStyleId: string | undefined
  mobileActions: () => JSXElement[]
  desktopActions: JSXElement
  showOptions: () => boolean
  isMobile: () => boolean
}

export function MainArea ({
  children,
  desktopStyleId,
  optionsStyleId,
  mobileActions,
  showOptions,
  isMobile,
  desktopActions
}: ParentProps<Props>) {
  const [ navigation ] = useContext(NavigationContext)

  const canReturnHome = (): boolean => {
    return navigation.location !== ''
  }

  return (
    <>
      <div
        id="main-area"
        class={desktopStyleId}
      >
        {children}
      </div>

      <div
        style={{ top: showOptions() ? '0px' : '-32px' }}
        class={optionsStyleId}
      >
        <Show when={isMobile()}>
          <ButtonTray
            buttons={mobileActions}
            canReturnHome={canReturnHome}
          />
        </Show>
        <Show when={isMobile() === false && desktopActions !== undefined}>
          {desktopActions}
        </Show>
      </div>
    </>
  )
}
