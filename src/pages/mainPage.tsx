import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { Icon } from '../components/Icon'
import { ReportsPage } from './reportsPage'
import { LedgerListPage } from './ledgerList'
import { MinterListPage } from './minterList'
import { AlertListPage } from './alertList'

export function MainPage () {
  const [ navigation ] = useContext(NavigationContext)
  
  return (
    <Switch fallback={<Icon name="clock" />}>
      <Match when={navigation.location === 'reports'}>
        <ReportsPage />
      </Match>
      <Match when={navigation.location === 'ledger'}>
        <LedgerListPage />
      </Match>
      <Match when={navigation.location === 'minters'}>
        <MinterListPage />
      </Match>
      <Match when={navigation.location === 'alerts'}>
        <AlertListPage />
      </Match>
    </Switch>
  )
}