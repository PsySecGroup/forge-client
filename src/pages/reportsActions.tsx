import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { ButtonTray } from '../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const reportsButtons = () => [
  <NavButton location='reports'>
    <Icon name="list" />
    List
  </NavButton>,
  <NavButton location='reports-new'>
    <Icon name="file-plus" />
    Add
  </NavButton>
]

export function ReportsActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={reportsButtons} />
  )
}
