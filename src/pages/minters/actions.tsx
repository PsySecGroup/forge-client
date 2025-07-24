import { NavButtonGenerator } from '../../components/navButton'
import { ButtonTray } from '../../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const minterButtons = () => [
  NavButtonGenerator('minters', 'List', 'list'),
  NavButtonGenerator('minters-new', 'Add', 'file-plus')
]

export function MinterActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={minterButtons} />
  )
}
