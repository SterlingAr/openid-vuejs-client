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
  openIdConfig : {},
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
  },
  openIdConfig: (state) =>
  {
    return state.openIdConfig;
  }
};

let mutations = {
  forceCommit: (state, payload) => state.forceCommit = payload
};

let openIdConfig = {
  openIdProvider: process.env.VUE_APP_OPENID_PROVIDER,
  clientConfig: {
    clientId: process.env.VUE_APP_OAUTH2_CLIENT_ID,
    redirectUri: process.env.VUE_APP_OAUTH2_REDIRECT_URI
  }
};

state.openIdConfig = openIdConfig;

async function getUserInfo (accessToken)
{
  console.log("Fetching User info with token: " + accessToken);
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  const { data } = await axios.get(process.env.VUE_APP_OPENID_PROVIDER + '/userinfo');
  return data;
}

// login flow, it doesn't refresh tokens as that logic is superfluous for this example
async function appAuth() 
{

  let persistedStore = JSON.parse(localStorage.getItem(process.env.VUE_APP_STORAGE_VERSION));
  if (persistedStore !== null) 
  {
    if (!isEmpty(persistedStore.tokens) && !isEmpty(persistedStore.userInfo))
    {
      return;
    }
  }

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

  if (!isEmpty(authFlow.configuration)) 
  {
    state.openIdConfig.extra = authFlow.configuration;
  }
}

appAuth().then(() =>
{
  const store = new Vuex.Store({
    state: state,
    getters: getters,
    mutations: mutations,
    plugins: [createPersistedState({
      key: process.env.VUE_APP_STORAGE_VERSION
    })]
  });

  new Vue({
    render: h => h(App),
    store: store
  }).$mount('#app');

  store.commit("forceCommit", true);

});

