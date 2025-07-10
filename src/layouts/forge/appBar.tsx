import { type ParentProps, Show } from 'solid-js'

type Props = {
  title: string
  styleId: string | undefined
}

export function AppBar ({ title, children, styleId }: ParentProps<Props>) {
  return (
    <Show when={children !== undefined}>
      <div
        id="appBar-area"
        class="pure-g"
      >
        <div class={`${styleId} pure-u-1`}>
          <p>{title}</p>
          {children}
        </div>
      </div>
    </Show>
  )
}
