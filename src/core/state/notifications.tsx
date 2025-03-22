import { type ParentProps, type JSX, createContext } from 'solid-js'
import { getActions } from './actions'
import { StoreProvider } from './provider'
import { Dictionary, type UniqueRecord } from '../types/basic'
import { createStore } from 'solid-js/store'

export type Notification = UniqueRecord<{
  id: number
  type: string
  text: Dictionary<string>
  isNew?: boolean
  createdAt?: Date
  seenAt?: Date
}>

const state = {
  lastChecked: new Date(),
  messages: [] as Notification[]
}

export const store = createStore(state)

type SetState = typeof store[1]

export const notificationsContext = createContext(store)
export const notificationsStore = store
export const getNotificationActions = getActions(store, (set: SetState) => ({
  updateLastChecked: (datetime: Date = new Date()) => set('lastChecked', datetime),
  addNotification: (notification: Notification) => set('messages', store[0].messages.length, {
    createdAt: new Date(),
    isNew: true,
    ...notification,
  }),
  updateNotification: (notification: Partial<Notification>) => set(
    'messages',
    store[0].messages.findIndex(record => record.id === notification.id),
    notification),
  removeNotification: (notification: Notification) => set('messages', (prevMessages) => {
    return prevMessages.filter(message => message.id !== notification.id)
  }),
  removeNotificationById: (id: number) => set('messages', (prevMessages) => {
    return prevMessages.filter(message => message.id !== id)
  })
}))

export function NotificationsProvider (
  { children }: ParentProps
): JSX.Element {
  return (
    <StoreProvider
      context={notificationsContext}
      store={notificationsStore}
    >
      {children}
    </StoreProvider>
  )
}
