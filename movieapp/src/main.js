import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "bulma/css/bulma.css";
import VueSplide from '@splidejs/vue-splide';
import './assets/JS/all.js'
import App from './App.vue'
import router from './router'
import Config from "./config.json";

const app = createApp(App)

app.config.globalProperties.hostname  = Config.HOSTNAME
app.config.globalProperties.ordspath  = Config.ORDSPATH
app.config.globalProperties.customerCollection  = Config.CUSTOMERCOLLECTION
app.config.globalProperties.notificationCollection  = Config.NOTIFICATIONCOLLECTION
app.config.globalProperties.landingPage  = Config.LANDINGPAGE
app.config.globalProperties.movieDetailsCollection  = Config.MOVIEDETAILSCOLLECTION
app.config.globalProperties.learnMoreCollection  = Config.LEARNMORECOLLECTION

app.use(createPinia())
app.use(router)
app.use( VueSplide );
app.mount('#app')
