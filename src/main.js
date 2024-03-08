import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire, VueFireAuth } from 'vuefire'
import { getFirestore } from '@firebase/firestore';

import App from './App.vue'
import router from './router'
import { firebaseApp } from './utils/firebaseApp'
import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App)
const db = getFirestore(firebaseApp);

app.use(createPinia());
app.use(VueFire, {
    firebaseApp,
    modules:[
        VueFireAuth()
    ],
    includes:[db]
});
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCKP5fYA_yjsuNxZzEZOZsDMw20JSrOvys'
    }
});
app.use(router);
app.mount('#app');
