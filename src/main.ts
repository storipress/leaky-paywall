import { createApp } from 'vue'
import './assets/index.css'
import { devtools } from '@nanostores/vue/devtools'
import urql from '@urql/vue'
import { parseToRgb, toColorString } from 'polished'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { $config } from './stores/config'
import NoopVue from './components/Noop.vue'

window.SP_PAYWALL = {
  all: true,
  clientId: 'D6RX98VXN',
  freeLimit: 3,
  flags: {
    paywall: true,
    tracking: true,
  },
  pathPattern: undefined,
  avatar: 'https://i.pravatar.cc/300?img=3',
  publicationLogo: 'https://i.pravatar.cc/300?img=5',
  title: 'Discover more from AI Supremacy',
  description:
    'News at the intersection of Artificial Intelligence, technology and business including Op-Eds, research summaries, guest contributions and valuable info about A.I. startups.',
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

app.use(devtools, { $config })
app.use(router)
app.use(urql, createClientOptions(window.SP_PAYWALL.clientId))

app.mount('#app')
