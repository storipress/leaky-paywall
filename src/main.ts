import { createApp } from 'vue'
import './assets/index.css'
import { devtools } from '@nanostores/vue/devtools'
import { parseToRgb, toColorString } from 'polished'
import App from './App.vue'
import { $config } from './stores/config'

window.SP_PAYWALL = {
  avatar: 'https://i.pravatar.cc/300?img=3',
  publicationLogo: 'https://i.pravatar.cc/300?img=5',
  title: 'Discover more from AI Supremacy',
  description:
    'News at the intersection of Artificial Intelligence, technology and business including Op-Eds, research summaries, guest contributions and valuable info about A.I. startups.',
  primaryColor: toColorString(parseToRgb('rgb(29 78 216)')),
}

const app = createApp(App)

app.use(devtools, { $config })

app.mount('#app')
