// (-->) Import new concept default states here
import { defaultState as uiDefaults } from './ui'
import { defaultState as navigationDefaults } from './navigation'

export default {
  // (-->) Add default states here
  ...uiDefaults,
  ...navigationDefaults
}
