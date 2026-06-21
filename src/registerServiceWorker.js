/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('Service worker has been registered.')
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
      if (!sessionStorage.getItem('serviceWorkerReloaded')) {
        sessionStorage.setItem('serviceWorkerReloaded', 'true')
        window.location.reload()
      }
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => registration.update())
      .catch(error => console.error('Error during service worker update:', error))
  }
}
