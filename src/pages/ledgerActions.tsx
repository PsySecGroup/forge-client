import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { ButtonTray } from '../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const ledgerButtons = () => [
  <NavButton location='ledger'>
    <Icon name="list" />
    List
  </NavButton>,
  <NavButton location='ledger-new'>
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
