# 🔔 @PsySecGroup/forge-notifications

A lightweight, reactive notification system for SolidJS featuring multiple notification types, timestamps, icons (using Feather icons), and load-more pagination.

---

## ⚡ Features

- Support for `info`, `success`, `warning`, and `error` notification types  
- Automatic "time ago" timestamps  
- Mark notifications as seen on click  
- Load more notifications incrementally  
- Feather icons for notification visuals  
- Reactive store with add/update/remove notification actions  
- Easy to integrate with SolidJS apps via context provider  

---

## 📦 Installation

```bash
npm install @PsySecGroup/forge-notifications
```

or with pnpm:

```bash
pnpm add @PsySecGroup/forge-notifications
```

---

## 🚀 Usage

### 1. Wrap your app with `NotificationsProvider`

```tsx
import { NotificationsProvider } from '@PsySecGroup/forge-notifications'

function App() {
  return (
    <NotificationsProvider>
      {/* your app components */}
    </NotificationsProvider>
  )
}
```

### 2. Add the `Notifications` component where you want the list to appear

```tsx
import { Notifications } from '@PsySecGroup/forge-notifications'

function NotificationList() {
  return <Notifications />
}
```

### 3. Use notification actions to add, update, or remove notifications

```tsx
import { getNotificationActions } from '@PsySecGroup/forge-notifications'

const { addNotification, updateNotification, removeNotificationById } = getNotificationActions()

// Add a new notification
addNotification({
  id: Date.now(),
  type: 'success',
  text: 'Your action was successful!',
})

// Mark notification as seen or update text
updateNotification({ id: 123, isNew: false })

// Remove notification
removeNotificationById(123)
```

---

## 📋 API Reference

### Components

| Component           | Description                                   |
| ------------------- | ---------------------------------------------|
| `NotificationsProvider` | Context provider for notifications store     |
| `Notifications`          | Notification list UI with icons and time ago |

### Store Types

```ts
type Notification = {
  id: number
  type: string
  text: string
  isNew?: boolean
  createdAt?: Date
  seenAt?: Date
}
```

### Notification Actions

| Action               | Description                                         |
| -------------------- | --------------------------------------------------|
| `addNotification(notification: Notification)`         | Adds a new notification (auto marks as new with timestamp) |
| `updateNotification(notification: Partial<Notification>)` | Updates existing notification by `id`                  |
| `removeNotification(notification: Notification)`      | Removes notification by object                           |
| `removeNotificationById(id: number)`                  | Removes notification by ID                               |
| `updateLastChecked(datetime?: Date)`                  | Updates the last checked timestamp                       |
| `getUnseenCount()`                                     | Returns count of unseen notifications                    |

---

## 🎨 Styling

The component uses basic inline styles and `pure-css` grid classes for layout. You can customize by overriding:

- `.notification-item` (notification row)  
- `.notification-new` (highlight new notifications)  
- Button and container styles  

Icons come from `feather-icons` with default sizing 20x20 px.
