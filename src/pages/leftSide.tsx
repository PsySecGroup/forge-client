import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { NavigationContext } from '../core'
import { useContext } from 'solid-js'
import { reportsButtons } from './reportsActions'
import { alertButtons } from './alertActions'
import { ledgerButtons } from './ledgerActions'
import { minterButtons } from './minterActions'

export const LeftSideButtons = () => [
  <NavButton location='ledger' prefixHighlight>
    <Icon name="book-open" />
    Ledger
  </NavButton>,
  <NavButton location='minters' prefixHighlight>
    <Icon name="cpu" />
    Minters
  </NavButton>,
  <NavButton location='reports' prefixHighlight>
    <Icon name="pie-chart" />
    Reports
  </NavButton>,
    <NavButton location='alerts' prefixHighlight>
    <Icon name="alert-triangle" />
    Alerts
  </NavButton>
]

export const NavigationTree = () => {
  const [ navigation ] = useContext(NavigationContext)
  
  switch (navigation.location) {
    case 'ledger':
      return ledgerButtons()
    case 'minters':
      return minterButtons()
    case 'alerts':
      return alertButtons()
      case 'reports':
      return reportsButtons()
    default:
      return LeftSideButtons()
  }
}

export function LeftSide () {
  return LeftSideButtons()
}
