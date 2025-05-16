import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { NavigationContext } from '../core'
import { useContext } from 'solid-js'
import { buyButtons } from './buyActions'
import { sellButtons } from './sellActions'
import { inventoryButtons } from './inventoryActions'
import { notesButtons } from './notesActions'
import { reportsButtons } from './reportsActions'

export const LeftSideButtons = () => [
  <NavButton location='buy'>
    <Icon name="dollar-sign" />
    Buy
  </NavButton>,
  <NavButton location='sell'>
    <Icon name="x-circle" />
    Sell
  </NavButton>,
  <NavButton location='inventory'>
    <Icon name="package" />
    Inventory
  </NavButton>,
  <NavButton location='notes'>
    <Icon name="edit-3" />
    Notes
  </NavButton>,
  <NavButton location='reports'>
    <Icon name="bar-chart-2" />
    Reports
  </NavButton>
]

export const NavigationTree = () => {
  const [ navigation ] = useContext(NavigationContext)
  
  switch (navigation.location) {
    case 'buy':
      return buyButtons()
    case 'sell':
      return sellButtons()
    case 'inventory':
      return inventoryButtons()
    case 'notes':
      return notesButtons()
    case 'reports':
      return reportsButtons()
    default:
      return LeftSideButtons()
  }
}


export function LeftSide () {
  return LeftSideButtons()
}