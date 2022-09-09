
import Vue from 'vue';
import App from './App.vue';
import Home from '@/components/Home.vue'
import DrawingCompare from '@/components/DrawingCompare.vue'
import { loadCoreCode } from "mxdraw"
import store from "@/store"
import VueRouter from 'vue-router'
import { Dialog, Input, Button, Checkbox, Slider, Tooltip, Icon, Select, Option } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(VueRouter)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Slider)
Vue.use(Tooltip)
Vue.use(Icon)
Vue.use(Select)
Vue.use(Option)

const router = new VueRouter({
    mode: 'history',
    base: '/',
    routes: [
        { path: '/', component: Home },
        { path: '/drawingCompare', component: DrawingCompare }
    ]
})

loadCoreCode().then(() => {

    Vue.config.productionTip = false;
    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount("#app");

})





