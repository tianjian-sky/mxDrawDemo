
import Vue from 'vue';
import App from './App.vue';
import { loadCoreCode } from "mxdraw"
import store from "@/store"
import { Dialog, Input, Button, Checkbox, Slider, Tooltip, Icon } from 'element-ui';

Vue.use(Dialog)
Vue.use(Input)
Vue.use(Button)
Vue.use(Checkbox)
Vue.use(Slider)
Vue.use(Tooltip)
Vue.use(Icon)
loadCoreCode().then(() => {

    Vue.config.productionTip = false;
    new Vue({
        render: (h) => h(App),
        store
    }).$mount("#app");

})





