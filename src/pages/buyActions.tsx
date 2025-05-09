import { NavButton } from '../components/NavButton'
import { Icon } from '../components/Icon'
import { ButtonTray } from '../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: boolean
}

export const buyButtons = () => [
  <NavButton>
    <Icon name="file-plus" />
    Create
  </NavButton>,
  <NavButton>
    <Icon name="bar-chart-2" />
    Reports
  </NavButton>

]

export function BuyActions ({ canReturnHome = false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={buyButtons} />
  )
}
