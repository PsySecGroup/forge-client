import { NavButtonGenerator } from '../../components/NavButton'
import { ButtonTray } from '../../layouts/forge/buttonTray'

type Prop = {
  canReturnHome?: () => boolean
}

export const reportsButtons = () => [
  NavButtonGenerator('reports', 'List', 'list')
]

export function ReportsActions ({ canReturnHome = () => false }: Prop) {
  return (<ButtonTray
    favSort={false}
    canReturnHome={canReturnHome}
    buttons={reportsButtons} />
  )
}
