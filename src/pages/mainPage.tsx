import { Switch, Match, useContext } from 'solid-js'
import { NavigationContext } from '../core'
import { Icon } from '../components/Icon'
import { BuyPage } from './buyPage'
import { SellPage } from './sellPage'
import { InventoryPage } from './inventoryPage'
import { NotesPage } from './notesPage'
import { ReportsPage } from './reportsPage'

export function MainPage () {
  const [ navigation ] = useContext(NavigationContext)
  
  return (
    <Switch fallback={<Icon name="clock" />}>
      <Match when={navigation.location === 'buy'}>
        <BuyPage />
      </Match>
      <Match when={navigation.location === 'sell'}>
        <SellPage />
      </Match>
      <Match when={navigation.location === 'inventory'}>
        <InventoryPage />
      </Match>
      <Match when={navigation.location === 'notes'}>
        <NotesPage />
      </Match>
      <Match when={navigation.location === 'reports'}>
        <ReportsPage />
      </Match>
    </Switch>
  )
}