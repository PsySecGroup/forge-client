import { NavButtonGenerator } from '../components/NavButton'

export const LeftSideButtons = () => [
  NavButtonGenerator('ledger', 'Ledger', 'book-open', true),
  NavButtonGenerator('minters', 'Minters', 'cpu', true),
  NavButtonGenerator('alerts', 'Alerts', 'alert-triangle', true),
  NavButtonGenerator('reports', 'Reports', 'pie-chart', true)
]

export function LeftSide () {
  return LeftSideButtons()
}
