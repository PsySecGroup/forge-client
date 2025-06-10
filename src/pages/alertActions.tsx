import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { ButtonTray } from '../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const alertButtons = () => [
  <NavButton>
    <Icon name="list" />
    List
  </NavButton>,
  <NavButton>
    <Icon name="file-plus" />
    Add
  </NavButton>
]

export function AlertActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={alertButtons} />
  )
}
