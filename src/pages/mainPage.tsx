import style from './css/mainPage.module.css'
import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { Icon } from '../components/Icon'
import { ReportsPage } from './reports/reportsPage'
import { LedgerListPage } from './ledger/ledgerList'
import { MinterListPage } from './minters/minterList'
import { AlertListPage } from './alerts/alertList'
import { LedgerDetailsPage } from './ledger/ledgerDetails'
import { LedgerEditorPage } from './ledger/ledgerEditor'
import { MinterEditorPage } from './minters/minterEditor'
import { MinterDetailsPage } from './minters/minterDetails'
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

export function MainPage () {
  const [ navigation ] = useContext(NavigationContext)
  
  return (
    <div class={style['centered']} >
      <Switch fallback={<Icon name="clock" />}>
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
      </Switch>
    </div>
  )
}