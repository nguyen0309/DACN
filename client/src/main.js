import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueSocketIO from "vue-socket.io";
import router from "./router";
import Vuex from "vuex";
import store from "./store";
import Vuelidate from "vuelidate";
import VueChatScroll from "vue-chat-scroll";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VueHead from 'vue-head'

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(VueChatScroll);
Vue.use(Vuelidate);
Vue.use(Vuex);
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(VueHead);
Vue.config.productionTip = false;

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "http://localhost:3002/",
  })
);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
