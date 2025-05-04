import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './style.css';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from '@tanstack/vue-query';

// Createa Vue app instance
const app = createApp(App);

// Register plugins
app.use(createPinia());
app.use(VueQueryPlugin);
app.use(router);

// Mount the app
app.mount('#app');
