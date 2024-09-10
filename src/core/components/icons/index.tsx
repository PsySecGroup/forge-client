import { Icon as LucideIcon } from 'lucide-solid'

export type IconProps = {
  icon: object
  color?: string
  size?: number
  strokeWidth?: number
  absoluteStrokeWidth?: boolean
  fill?: string
}

export default function Icon (props: IconProps) {
  return (
    <LucideIcon iconNode={props.icon} {...props} />
  )
}
