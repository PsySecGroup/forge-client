import { type ParentProps, Show } from 'solid-js'

type Props = {
  styleId: string | undefined
}

export function RightArea ({ children, styleId }: ParentProps<Props>) {
  return (
    <Show when={children !== undefined}>
      <div
        id="left-area"
        class={`${styleId} pure-u-md-1-5 pure-u-lg-1-8`}
      >
        {children}
      </div>
    </Show>
  )
}
