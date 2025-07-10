import { NavButtonGenerator } from '../../components/NavButton'
import { ButtonTray } from '../../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const alertButtons = () => [
  NavButtonGenerator('alerts', 'List', 'list'),
  NavButtonGenerator('alerts-new', 'Add', 'file-plus')
]

export function AlertActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={alertButtons} />
  )
}
