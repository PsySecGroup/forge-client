import { registerContext } from "../../state/context"

const defaults = {
  a: 7
}

export const storesContext = registerContext('simple', defaults)
