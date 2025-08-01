import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { Icon } from '../components/icon'
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
import { AlertConfigurePage } from './alerts/alertConfigure'

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
 * @param location 
 * @returns 
 */
function getLocationCheck(location: string) {
  return (slug: string) => {
    if (slug[slug.length - 1] === '*') {
    return location.startsWith(slug.slice(0, slug.length - 1))
  } else {
    return location === slug
  }
  }
}

/**
 * 
 */
export const MainPageRouter = () => {
  const [ navigation ] = useContext(NavigationContext)
  const navIs = getLocationCheck(navigation.location)

  return (<Switch fallback={<Icon name="clock" />}>
    <Match when={navIs('reports')}>
      <ReportsPage />
    </Match>
    <Match when={navIs('ledger')}>
      <LedgerListPage />
    </Match>
    <Match when={navIs('ledger-new')}>
      <LedgerEditorPage />
    </Match>
    <Match when={navIs('ledger-details-*')}>
      <LedgerDetailsPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navIs('ledger-edit-*')}>
      <LedgerEditorPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navIs('minters')}>
      <MinterListPage />
    </Match>
    <Match when={navIs('minters-new')}>
      <MinterEditorPage />
    </Match>
    <Match when={navIs('minters-details-*')}>
      <MinterDetailsPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navIs('minters-edit-*')}>
      <MinterEditorPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navIs('alerts')}>
      <AlertListPage />
    </Match>
    <Match when={navIs('alerts-new')}>
      <AlertEditorPage />
    </Match>
    <Match when={navIs('alerts-details-*')}>
      <AlertDetailsPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navIs('alerts-edit-*')}>
      <AlertEditorPage
        id={getId(navigation.location)}
      />
    </Match>
    <Match when={navIs('alerts-configure')}>
      <AlertConfigurePage />
    </Match>
  </Switch>)
}