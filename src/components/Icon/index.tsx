import { icons } from 'feather-icons'

type Props = {
  name: keyof typeof icons
}

export function Icon ({ name }: Props) {
  if (icons[name] === undefined) {
    throw new RangeError(`"${name}" is not a valid Feather Icon.  Please check https://feathericons.com/`)
  }

  return (
    <span
      innerHTML={icons[name].toSvg()}
    />
  )
}
