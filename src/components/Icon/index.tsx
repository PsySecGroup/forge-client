import { icons } from 'feather-icons'

export type IconProps = {
  name: keyof typeof icons
}

export function Icon ({ name }: IconProps) {
  if (icons[name] === undefined) {
    throw new RangeError(`"${name}" is not a valid Feather Icon.  Please check https://feathericons.com/`)
  }

  return (
    <span
      innerHTML={icons[name].toSvg()}
    />
  )
}
