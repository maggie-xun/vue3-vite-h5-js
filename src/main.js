import './assets/main.css'

// Vant 样式和组件
import 'vant/lib/index.css'
import { List, Cell, Tag, Button, Loading, PullRefresh } from 'vant'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 注册 Vant 组件
app.use(List)
app.use(Cell)
app.use(Tag)
app.use(Button)
app.use(Loading)
app.use(PullRefresh)

app.use(createPinia())
app.use(router)

app.mount('#app')
