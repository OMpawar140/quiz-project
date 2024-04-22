import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import vue3GoogleLogin from 'vue3-google-login'
import store from './store'

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore} from '@firebase/firestore'


const vuetify = createVuetify({
  components,
  directives
})

const firebaseConfig = {
  apiKey: 'AIzaSyAa-rkk0WaD--a20SJ24KrBrLjzqw9klR0',
  authDomain: 'ctc-team.firebaseapp.com',
  projectId: 'ctc-team',
  storageBucket: 'ctc-team.appspot.com',
  messagingSenderId: '1087019280878',
  appId: '1:1087019280878:web:9c7eabf2784676238546ff',
  measurementId: 'G-M4V60C0Y5C'
}



const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const fbStore = getFirestore(app)
const db = getFirestore(app);

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .use(vue3GoogleLogin, {
    clientId: '1087019280878-14af4iptsmtlk196jalmidqmp2pqladk.apps.googleusercontent.com'
  })
  .mount('#app')
