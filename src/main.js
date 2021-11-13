import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

window.wallpaperPropertyListener = {
  applyUserProperties(properties) {
      const eventa = new CustomEvent('wallpaperEngine', { detail: properties });
      window.dispatchEvent(eventa);

      if (properties.tibberapikey) {
          console.log(properties.tibberapikey);
      }
  },
};

new Vue({
  render: h => h(App),
}).$mount('#app')
