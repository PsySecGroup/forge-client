import {
  Divider
} from "@suid/material"
import useTheme from "@suid/material/styles/useTheme"

export default function ListDividers() {
  const theme = useTheme();
  return (
    <div>
      <Divider />
      <Divider light />
    </div>
  )
}
