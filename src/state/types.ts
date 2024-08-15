import { type Space } from '../types/space'
import { type Ui } from '../types/ui'
import { type SetStoreFunction } from 'solid-js/store'
import { type Source } from '../types/source'
import { type GraphMessage } from '../types/graphMessage'
import { type Values } from '../types/values'

export interface GraphView {
  spaceId: number
  iframe: HTMLIFrameElement | null
}

export interface StoreState {
  ui: Ui
  setUi: SetStoreFunction<Ui>
  spaces: Space[]
  setSpaces: SetStoreFunction<Space[]>
  sources: Source[]
  setSources: SetStoreFunction<Source[]>
  updateFocusedSpace: (newValue: Partial<Space>) => void
  getFocusedSpace: () => Space
  getFocusedSpaceIndex: () => number
  graphViews: GraphView[]
  registerGraphView: (spaceId: number, iframe: HTMLIFrameElement) => void
  graphMessages: GraphMessage[]
  sendGraphMessage: (graphMessage: GraphMessage) => void
  values: Values
  setValues: (newValue: Partial<Values>) => void
}
