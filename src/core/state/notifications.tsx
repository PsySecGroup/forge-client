import { type ParentProps, type JSX, createContext } from 'solid-js'
import { defineActions } from './actions'
import { StoreProvider } from './provider'
import { Dictionary, type UniqueRecord } from '../types/basic'
import { createStore } from 'solid-js/store'

export type Notification = UniqueRecord<{
  id: number
  type: string
  text: string
  isNew?: boolean
  createdAt?: Date
  seenAt?: Date
}>

const definition = {
  lastChecked: new Date(),
  messages: [] as Notification[]
}

export const store = createStore(definition)
const [ state, setState ] = store
type SetState = typeof setState

export const NotificationsContext = createContext(store)
export const NotificationsStore = store

export const getNotificationActions = defineActions(store, (set: SetState) => ({
  updateLastChecked: (datetime: Date = new Date()) => set('lastChecked', datetime ?? new Date()),

  addNotification: (notification: Notification) => set('messages', state.messages.length, {
    createdAt: new Date(),
    isNew: true,
    ...notification,
  }),

  updateNotification: (notification: Partial<Notification>) => {
    const index = state.messages.findIndex(record => record.id === notification.id)

    if (index === -1) {
      return
    }

    set('messages', index, (old) => ({
      ...old,
      ...notification
    }))
  },

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
      context={NotificationsContext}
      store={NotificationsStore}
    >
      {children}
    </StoreProvider>
  )
}
