import { icons } from 'feather-icons'
import { For, createSignal, Show } from 'solid-js'
import { useContext } from 'solid-js'
import { NotificationsContext, getNotificationActions, Notification } from './store'

function timeAgo(date: Date) {
  const now = new Date().getTime()
  const diff = Math.floor((now - date.getTime()) / 1000) // seconds
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function FeatherIcon(props: { icon: keyof typeof icons; class?: string }) {
  // Get SVG string from feather-icons
  const svgString = icons[props.icon]?.toSvg({ class: props.class ?? '', width: 20, height: 20 }) || ''

  return (
    <span
      class={props.class}
      innerHTML={svgString}
      style={{
        display: 'inline-block',
        'vertical-align': 'middle'
      }}
    />
  )
}

// Map notification type to icon name and background color
const typeConfig: Record<string, { icon: keyof typeof icons; bgColor: string }> = {
  info: { icon: 'bell', bgColor: 'pure-u-1 pure-u-md-1-6 pure-bg-blue' },
  success: { icon: 'check-circle', bgColor: 'pure-u-1 pure-u-md-1-6 pure-bg-green' },
  warning: { icon: 'alert-circle', bgColor: 'pure-u-1 pure-u-md-1-6 pure-bg-yellow' },
  error: { icon: 'x-circle', bgColor: 'pure-u-1 pure-u-md-1-6 pure-bg-red' },
}

export function Notifications() {
  const [ state ] = useContext(NotificationsContext)
  const { updateNotification } = getNotificationActions()
  const [visibleCount, setVisibleCount] = createSignal(20)

  function handleClick(notification: Notification) {
    if (notification.isNew) {
      updateNotification({
        id: notification.id,
        isNew: false,
        seenAt: new Date()
      })
    }
  }

  return (
    <div class="pure-g" style={{
      margin: 'auto',
      padding: '1rem'
    }}>
      <ul class="pure-u-1" style={{
        'list-style': 'none',
        padding: 0
      }}>
        <For each={state.messages.slice(0, visibleCount())}>
          {(notification) => {
            const config = typeConfig[notification.type] || {
              icon: 'bell',
              bgColor: 'pure-bg-gray',
            }

            return (
              <li
                class={`pure-g notification-item ${notification.isNew ? 'notification-new' : ''}`}
                style={{
                  cursor: 'pointer',
                  'margin-bottom': '1rem',
                  padding: '0.75rem',
                  'border-radius': '6px',
                  'background-color': notification.isNew ? '#fff8dc' : '#fff',
                  border: notification.isNew ? '1px solid #f0e68c' : '1px solid #ddd',
                }}
                onClick={() => handleClick(notification)}
              >
                {/* Icon container */}
                <div
                  class="pure-u-1 pure-u-md-1-6"
                  style={{
                    'border-radius': '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    color: '#fff',
                    'margin-right': '1rem',
                    'flex-shrink': '0',
                    'background-color': (() => {
                      switch (notification.type) {
                        case 'info': return '#0078e7'
                        case 'success': return '#3eba6f'
                        case 'warning': return '#f2b01e'
                        case 'error': return '#e03e3e'
                        default: return config.bgColor.includes('pure-bg-') ? '' : config.bgColor
                      }
                    })()
                  }}
                >
                  <FeatherIcon icon={config.icon} />
                </div>

                {/* Message and time */}
                <div class="pure-u-1 pure-u-md-5-6" style={{ overflow: 'hidden' }}>
                  <div style={{
                    'font-size': '0.9rem',
                    color: '#333',
                    'white-space': 'nowrap',
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis'
                  }}>
                    {(notification.text || '').slice(0, 100)}
                    {(notification.text || '').length > 100 ? '...' : ''}
                  </div>
                  <div style={{
                    'font-size': '0.75rem',
                    color: '#666',
                    'margin-top': '0.25rem'
                  }}>
                    {notification.createdAt ? timeAgo(new Date(notification.createdAt)) : ''}
                  </div>
                </div>
              </li>
            )
          }}
        </For>
      </ul>

      <Show when={visibleCount() < state.messages.length}>
        <button
          class="pure-button pure-button-primary"
          style={{ 'margin-top': '1rem' }}
          onClick={() => setVisibleCount(visibleCount() + 20)}
        >
          Load More
        </button>
      </Show>
    </div>
  )
}
