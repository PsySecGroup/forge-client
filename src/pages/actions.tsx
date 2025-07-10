import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { ReportsActions } from './reports/reportsActions'
import { AlertActions } from './alerts/alertActions'
import { MinterActions } from './minters/minterActions'
import { LedgerActions } from './ledger/ledgerActions'

export function Actions () {
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