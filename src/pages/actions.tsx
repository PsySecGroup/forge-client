import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { BuyActions } from './buyActions'
import { SellActions } from './sellActions'
import { InventoryActions } from './inventoryActions'
import { NotesActions } from './notesActions'
import { ReportsActions } from './reportsActions'

export function Actions () {
  const [ navigation ] = useContext(NavigationContext)
  return (
    <Switch>
      <Match when={navigation.location === 'buy'}>
        <BuyActions />
      </Match>
      <Match when={navigation.location === 'sell'}>
        <SellActions />
      </Match>
      <Match when={navigation.location === 'inventory'}>
        <InventoryActions />
      </Match>
      <Match when={navigation.location === 'notes'}>
        <NotesActions />
      </Match>
      <Match when={navigation.location === 'reports'}>
        <ReportsActions />
      </Match>
    </Switch>
  )
}