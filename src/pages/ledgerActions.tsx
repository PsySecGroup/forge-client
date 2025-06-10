import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { ButtonTray } from '../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const ledgerButtons = () => [
  <NavButton>
    <Icon name="list" />
    List
  </NavButton>,
  <NavButton>
    <Icon name="file-plus" />
    Add
  </NavButton>
]

export function LedgerActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={ledgerButtons} />
  )
}
