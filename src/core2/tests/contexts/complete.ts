import { registerContext } from "../../state/context"

const defaults = {
  a: 7
}

export const completeContext = registerContext('simple', defaults)
