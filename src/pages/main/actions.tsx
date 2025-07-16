import { getNotificationActions, NotificationsContext } from '../../core'
import { NavButtonGenerator } from '../../components/NavButton'
import { useContext } from 'solid-js'

export const LeftSideButtons = () => {
  const { getUnseenCount } = getNotificationActions()
  const unseenCount = getUnseenCount()
  const unseenCountLabel = unseenCount === 0
    ? ''
    : ` (${unseenCount})`
  
  return [
    NavButtonGenerator('ledger', 'Ledger', 'book-open', true),
    NavButtonGenerator('minters', 'Minters', 'cpu', true),
    NavButtonGenerator('alerts', `Alerts${unseenCountLabel}`, 'alert-triangle', true),
    NavButtonGenerator('reports', 'Reports', 'pie-chart', true)
  ]
}

export function LeftSide () {
  useContext(NotificationsContext)

  return (<>
    {LeftSideButtons()}
  </>)
}
