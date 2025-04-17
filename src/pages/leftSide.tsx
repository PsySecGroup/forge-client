import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'

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

export function LeftSide () {
  return (<>
    <NavButton location='buy'>
    <Icon name="dollar-sign" />
    Buy
  </NavButton>
  <NavButton location='sell'>
    <Icon name="x-circle" />
    Sell
  </NavButton>
  <NavButton location='inventory'>
    <Icon name="package" />
    Inventory
  </NavButton>
  <NavButton location='notes'>
    <Icon name="edit-3" />
    Notes
  </NavButton>
  <NavButton location='reports'>
    <Icon name="bar-chart-2" />
    Reports
  </NavButton>
  </>
  )
}