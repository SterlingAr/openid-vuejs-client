import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import createPersistedState from "vuex-persistedstate";
import {AuthFlow} from "./auth";

Vue.config.productionTip = false;
Vue.use(Vuex);

const axios = require('axios');
window.axios = axios;

const $ = require('jquery');
window.$ = $;

const isEmpty = require('lodash/isEmpty');
window.isEmpty = isEmpty;

let state = {
  tokens : {},
  userInfo: {}
};

let getters = {
  tokens: (state) =>
  {
    return state.tokens;
  },
  userInfo: (state) =>
  {
    return state.userInfo;
  }
};

async function getUserInfo (accessToken)
{
  console.log("Fetching User info with token: " + accessToken);
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  const { data } = await axios.get(process.env.VUE_APP_OPENID_PROVIDER + '/userinfo');
  return data;
}

async function appAuth() 
{
  let openIdConfig = {
    openIdProvider: process.env.VUE_APP_OPENID_PROVIDER,
    clientConfig: {
      clientId: process.env.VUE_APP_OAUTH2_CLIENT_ID,
      redirectUri: process.env.VUE_APP_OAUTH2_REDIRECT_URI
    }
  };

  let authFlow = new AuthFlow(openIdConfig);

  await authFlow.fetchTokensIfPossible();

  if (!isEmpty(authFlow.tokens))
  {
    console.log("Tokens are available: " + authFlow.tokens);
    state.tokens = authFlow.tokens;
    state.userInfo = await getUserInfo(authFlow.tokens.accessToken);
  }
  else
  {
    authFlow.startAuthorizationFlow();
  }
}

appAuth().then(() =>
{
  const store = new Vuex.Store({
    state: state,
    getters: getters,
    plugins: [createPersistedState()]
  });

  new Vue({
    render: h => h(App),
    store: store
  }).$mount('#app');
});

