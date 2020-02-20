import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import createPersistedState from "vuex-persistedstate";
import {AuthFlow} from "./auth";

Vue.config.productionTip = false;
Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createPersistedState()]
});

// if authInfo is not in storage

// start authFlow

let openIdConfig = {
  openIdProvider: process.env.VUE_APP_OPENID_PROVIDER,
  clientConfig: {
    clientId: process.env.VUE_APP_OAUTH2_CLIENT_ID,
    redirectUri: process.env.VUE_APP_OAUTH2_REDIRECT_URI
  }
};

console.log(openIdConfig);
let authFlow = new AuthFlow(openIdConfig);
authFlow.startAuthorizationFlow();

// save token info in a variable

// initialize vue app with preset Data:({})

new Vue({
  render: h => h(App),
  store: store
}).$mount('#app');
