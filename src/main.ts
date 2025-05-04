import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './style.css';
import router from './router';

// Createa Vue app instance
const app = createApp(App);

// Register plugins
app.use(createPinia());
app.use(router);

// Mount the app
app.mount('#app');
