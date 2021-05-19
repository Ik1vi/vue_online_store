import { createApp } from 'vue';
import App from './App.vue';

import { data } from './data/data';
import alertMessage from './data/alertMessage';

createApp(App).mount('#app');

alertMessage(data.helloMessage);
alertMessage(data.startMessage);
