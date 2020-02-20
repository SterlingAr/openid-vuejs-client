<template>
  <div class="hello">
    <h1>Auth Tokens</h1>
    <p><b>access_token:</b> {{tokens.accessToken}}</p>
    <p><b>refresh_token:</b>{{tokens.refreshToken}}</p>
    <p><b>issued_at:</b> {{tokens.issuedAt}}</p>
    <p><b>expires_in:</b> {{tokens.expiresIn}}</p>
    <p><b>scope:</b> {{tokens.scope}}</p>

    <h3>User Info</h3>
    <p><b>session_id:</b> {{userInfo.sid}}</p>
    <p><b>subject:</b> {{userInfo.sub}}</p>
    <p><b>email:</b> {{userInfo.email}}</p>

    <button @click="logOut">Logout</button>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'HelloWorld',
  computed: {
    ...mapGetters({
      openIdConfig: 'openIdConfig',
      tokens: 'tokens',
      userInfo: 'userInfo',
    })
  },
  methods: {
    logOut: function ()
    {
      let idToken = this.tokens.idToken;
      let url = window.location.href;
      url = url.split("/");
      let postLogoutRedirectTo = url[0] + "//" + url[2];
      console.log(postLogoutRedirectTo);
      let redirectTo = this.openIdConfig.extra.endSessionEndpoint + '?id_token_hint=' + idToken + '&post_logout_redirect_uri=' + postLogoutRedirectTo;
      // Simulate an HTTP redirect:
      localStorage.clear();
      window.location.replace(redirectTo);
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
