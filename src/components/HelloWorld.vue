<template>
  <div class="hello">
    <h1>Auth Tokens</h1>
    <p><b>access_token:</b> {{tokens.accessToken}}</p>
    <p><b>refresh_token:</b>{{tokens.refreshToken}}</p>
    <p><b>expires_in:</b> {{tokens.expiresIn}}</p>
    <p><b>scope:</b> {{tokens.scope}}</p>

    <h3>User Info</h3>
    <p><b>subject:</b> {{userInfo.sub}}</p>
    <p><b>email:</b> {{userInfo.email}}</p>
    <button>Logout</button>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

export default {
  name: 'HelloWorld',
  computed: {
    ...mapGetters({
      tokens: 'tokens',
      userInfo: 'userInfo',
    }),
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
