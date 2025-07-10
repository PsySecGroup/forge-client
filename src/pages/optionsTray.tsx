import { NavigationContext } from '../core'
import { useContext } from 'solid-js'
import { reportsButtons } from './reports/reportsActions'
import { alertButtons } from './alerts/alertActions'
import { ledgerButtons } from './ledger/ledgerActions'
import { minterButtons } from './minters/minterActions'
import { LeftSideButtons } from './leftActions'

export const OptionsTray = () => {
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
