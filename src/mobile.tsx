import { render } from 'solid-js/web'
import { App } from './app'
import { Capacitor } from '@capacitor/core'

if (Capacitor.isNativePlatform()) {
  console.log('Running inside Capacitor native app')
  // You can add mobile-specific logic here, e.g. plugins, native APIs...
}

render(() => <App />, document.getElementById('viewport')!)
