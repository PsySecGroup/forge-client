import { NavButtonGenerator } from '../components/NavButton'
import { ButtonTray } from '../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const ledgerButtons = () => [
  NavButtonGenerator('ledger', 'List', 'list'),
  NavButtonGenerator('ledger-new', 'Add', 'file-plus')
]

export function LedgerActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={ledgerButtons} />
  )
}
