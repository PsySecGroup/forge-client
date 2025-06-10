import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { ButtonTray } from '../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const minterButtons = () => [
  <NavButton location='minters'>
    <Icon name="list" />
    List
  </NavButton>,
  <NavButton location='minters-new'>
    <Icon name="file-plus" />
    Add
  </NavButton>
]

export function MinterActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={minterButtons} />
  )
}
