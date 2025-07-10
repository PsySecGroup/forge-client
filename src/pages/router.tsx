import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { Icon } from '../components/Icon'
import { ReportsActions, reportsButtons } from './reports/actions'
import { AlertActions, alertButtons } from './alerts/actions'
import { MinterActions, minterButtons } from './minters/actions'
import { LedgerActions, ledgerButtons } from './ledger/actions'
import { LeftSideButtons } from './main/actions'
import { ReportsPage } from './reports/reportsPage'
import { LedgerListPage } from './ledger/ledgerList'
import { LedgerEditorPage } from './ledger/ledgerEditor'
import { LedgerDetailsPage } from './ledger/ledgerDetails'
import { MinterListPage } from './minters/minterList'
import { MinterEditorPage } from './minters/minterEditor'
import { MinterDetailsPage } from './minters/minterDetails'
import { AlertListPage } from './alerts/alertList'
import { AlertEditorPage } from './alerts/alertEditor'
import { AlertDetailsPage } from './alerts/alertDetails'

/**
 * 
 * @param slug 
 * @returns 
 */
function getId (slug: string) {
  const index = slug.lastIndexOf('-')
  return Number(slug.slice(index + 1))
}

/**
 * 
 */
export function DesktopTrayButtons () {
  const [ navigation ] = useContext(NavigationContext)

  return (
    <Switch>
      <Match when={navigation.location.startsWith('reports')}>
        <ReportsActions />
      </Match>
      <Match when={navigation.location.startsWith('alerts')}>
        <AlertActions />
      </Match>
      <Match when={navigation.location.startsWith('minters')}>
        <MinterActions />
      </Match>
      <Match when={navigation.location.startsWith('ledger')}>
        <LedgerActions />
      </Match>
    </Switch>
  )
}

/**
 * 
 */
export const MobileTrayButtons = () => {
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

/**
 * 
 */
export const MainPageRouter = () => {
  const [ navigation ] = useContext(NavigationContext)

  return (<Switch fallback={<Icon name="clock" />}>
    <Match when={navigation.location === 'reports'}>
      <ReportsPage />
    </Match>
    <Match when={navigation.location === 'ledger'}>
      <LedgerListPage />
    </Match>
    <Match when={navigation.location.startsWith('ledger-new')}>
      <LedgerEditorPage />
    </Match>
    <Match when={navigation.location.startsWith('ledger-details-')}>
      <LedgerDetailsPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navigation.location === 'minters'}>
      <MinterListPage />
    </Match>
    <Match when={navigation.location.startsWith('minters-new')}>
      <MinterEditorPage />
    </Match>
    <Match when={navigation.location.startsWith('minters-details-')}>
      <MinterDetailsPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navigation.location === 'alerts'}>
      <AlertListPage />
    </Match>
    <Match when={navigation.location.startsWith('alerts-new')}>
      <AlertEditorPage />
    </Match>
    <Match when={navigation.location.startsWith('alerts-details-')}>
      <AlertDetailsPage
        id={getId(navigation.location)}
      />
    </Match>
  </Switch>)
}