import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { NavigationContext } from '../core'
import { useContext } from 'solid-js'
import { reportsButtons } from './reportsActions'
import { alertButtons } from './alertActions'
import { ledgerButtons } from './ledgerActions'
import { minterButtons } from './minterActions'

export const LeftSideButtons = () => [
  <NavButton location='ledger'>
    <Icon name="book-open" />
    Ledger
  </NavButton>,
  <NavButton location='minters'>
    <Icon name="cpu" />
    Minters
  </NavButton>,
  <NavButton location='reports'>
    <Icon name="pie-chart" />
    Reports
  </NavButton>,
    <NavButton location='alerts'>
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
