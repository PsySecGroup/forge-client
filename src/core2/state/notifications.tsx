import { createSignal, createContext, useContext } from 'solid-js';

// NotificationContext
const NotificationContext = createContext();

export const NotificationProvider = (props) => {
  const [notifications, setNotifications] = createSignal([]);

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter(n => n.id !== id));
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {props.children}
      <NotificationList notifications={notifications()} />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

// NotificationList component to render all notifications
const NotificationList = ({ notifications }) => (
  <div>
    {notifications.map(n => (
      <div class={`notification ${n.type}`} key={n.id}>
        {n.message}
      </div>
    ))}
  </div>
);
