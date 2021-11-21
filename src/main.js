import Vue from 'vue'
import App from './App.vue'
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
Vue.use(VueApollo);

window.apiKey = null;

/**
 * Tries to fetch API key on window every 500ms
 * @returns {String} Tibber API key
 */
const waitforToken = () => {
  return new Promise((resolve) => {
    const retryFetchToken = setInterval(() => {
      if (window.apiKey !== null) {
        resolve(window.apiKey)
        clearInterval(retryFetchToken);
      }
    }, 500);
  })
}

// Create a WebSocket link:
const link = new WebSocketLink({
  uri: "wss://api.tibber.com/v1-beta/gql/subscriptions",
  options: {
    reconnect: true,
    timeout: 30000,
    // Since api-key is async, we need to wait for it here..
    connectionParams: async () => {
      const token = await waitforToken();

      return { token };
    },
  }
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true
  })
});

const apolloProvider = new VueApollo({
  defaultClient: client
});


Vue.config.productionTip = false

window.wallpaperPropertyListener = {
  applyUserProperties(properties) {
      const eventa = new CustomEvent('wallpaperEngine', { detail: properties });
      window.dispatchEvent(eventa);

      if (properties.tibberapikey) {
          window.apiKey = properties.tibberapikey.value;
      }
  },
};

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
