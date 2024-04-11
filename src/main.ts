import { createApp } from 'vue'
import './assets/index.css'
import urql from '@urql/vue'
import { parseToRgb, toColorString } from 'polished'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import NoopVue from './components/Noop.vue'

window.SP_PAYWALL = {
  all: true,
  dismissible: false,
  clientId: 'D6RX98VXN',
  freeLimit: {
    interval: 7,
    quota: 3,
  },
  flags: {
    paywall: true,
    tracking: true,
  },
  pathPattern: undefined,
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/IDEO_2021_logo.svg/799px-IDEO_2021_logo.svg.png',
  title: "You've reached your weekly article limit",
  description:
    'Read one article per week. Submit your email to discover more news covering the intersection of Artificial Intelligence, technology and business.',
  primaryColor: toColorString(parseToRgb('rgb(29 78 216)')),
}

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: NoopVue,
    },
    {
      path: '/:slug',
      component: NoopVue,
    },
  ],
})

app.use(router)
app.use(urql, createClientOptions(window.SP_PAYWALL.clientId))

app.mount('#app')
