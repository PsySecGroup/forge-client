import Icon, { type IconProps } from './index'
import { cabin } from '@lucide/lab'

const CustomIcon = (props: IconProps) => (
  <Icon
    icon={cabin} // TODO what
    {...props}
  />
)

export default CustomIcon
