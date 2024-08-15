import { hydrate as hydrateSpace, type Space } from '../types/space'
import { hydrate as hydrateUi } from '../types/ui'
import { hydrate as hydrateValues, type Values } from '../types/values'
import { type GraphMessage } from '../types/graphMessage'

export const defaults = {
  ui: hydrateUi({}),
  setUi: () => undefined,
  spaces: [hydrateSpace({})],
  setSpaces: () => undefined,
  sources: [],
  setSources: () => undefined,
  updateFocusedSpace: (newValue: Partial<Space>) => undefined,
  getFocusedSpace: () => hydrateSpace({}),
  getFocusedSpaceIndex: () => -1,
  graphViews: [],
  registerGraphView: (spaceId: number, iframe: HTMLIFrameElement) => undefined,
  graphMessages: [],
  sendGraphMessage: (graphMessage: GraphMessage) => undefined,
  values: hydrateValues({}),
  setValues: (values: Partial<Values>) => undefined
}
