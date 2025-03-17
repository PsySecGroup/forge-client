import { createSignal, createEffect } from 'solid-js';

export const createRoutingStore = () => {
  const [route, setRoute] = createSignal(window.location.pathname);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setRoute(path);
  };

  createEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  });

  return { route, navigate };
};

export const useRouting = () => createRoutingStore();
