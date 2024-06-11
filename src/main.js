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
import { getStorage } from 'firebase/storage'



const vuetify = createVuetify({
  components,
  directives
})

const firebaseConfig = {
  apiKey: "AIzaSyBDgPHYg6R8TvTWL35GMFG7P3DdcVitrbU",
  authDomain: "img-quiz-12fb7.firebaseapp.com",
  projectId: "img-quiz-12fb7",
  storageBucket: "img-quiz-12fb7.appspot.com",
  messagingSenderId: "770626092113",
  appId: "1:770626092113:web:6d183169a10abb71fecc70",
  measurementId: "G-VVXV77SN1C"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const fbStore = getFirestore(app);
const db = getFirestore(app);

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store)
  .use(vue3GoogleLogin, {
    clientId: '1087019280878-14af4iptsmtlk196jalmidqmp2pqladk.apps.googleusercontent.com'
  })
  .mount('#app')

  export { storage };