import style from './css/mainPage.module.css'
import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { Icon } from '../components/Icon'
import { ReportsPage } from './reportsPage'
import { LedgerListPage } from './ledgerList'
import { MinterListPage } from './minterList'
import { AlertListPage } from './alertList'
import { LedgerDetailsPage } from './ledgerDetails'
import { LedgerEditorPage } from './ledgerEditor'
import { MinterEditorPage } from './minterEditor'
import { MinterDetailsPage } from './minterDetails'
import { AlertEditorPage } from './alertEditor'
import { AlertDetailsPage } from './alertDetails'

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