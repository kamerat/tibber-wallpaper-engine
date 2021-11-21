<template>
  <main :key="cacheKey">
    <div class="background" :style="`background-image: url('${imageSrc}')`" />
    <h1 v-if="!apiKey">Missing API key</h1>
    <template v-else>
      <TibberLive :api-key="apiKey" v-if="live" />
      <Tibber :graphs-to-display="graphsToDisplay" :api-key="apiKey" v-else />
    </template>
  </main>
</template>

<script>
import Tibber from '@/pages/Tibber.vue'
import TibberLive from '@/pages/TibberLive.vue'

const defaultImageSrc = () => 'img/pawel-czerwinski-sfs4Dr8R4o8-unsplash.jpg';

export default {
  name: 'App',
  components: {
    Tibber,
    TibberLive,
  },
   data: () => ({
      imageSrc: defaultImageSrc(),
      wallpaperEngineOptions: {},
      apiKey: '',
      error: '',
      live: false,
      graphsToDisplay: {
        consumption: true,
        cost: true,
        spot: false,
      },
      cacheKey: 0,
    }),
    created() {
        window.addEventListener('wallpaperEngine', this.onWallpaperEngineEvent);
    },
    destroyed() {
        window.removeEventListener('wallpaperEngine', this.onWallpaperEngineEvent);
    },
    mounted() {
        // Debug to show in browser preview
        if (!('wallpaperRequestRandomFileForProperty' in window) && process.env.VUE_APP_TIBBER_API_KEY) {
          this.apiKey = window.apiKey = process.env.VUE_APP_TIBBER_API_KEY;
        }
    },

    watch: {
        wallpaperEngineOptions: {
            deep: true,
            handler(newOptions) {
                if ('tibberapikey' in newOptions) {
                  this.apiKey = newOptions.tibberapikey.value;
                }

                if ('tibberplus' in newOptions) {
                  this.live = newOptions.tibberplus.value;
                }

                if ('showconsumption' in newOptions) {
                  this.graphsToDisplay.consumption = newOptions.showconsumption.value;
                }

                if ('showcost' in newOptions) {
                  this.graphsToDisplay.cost = newOptions.showcost.value;
                }

                if ('showspot' in newOptions) {
                  this.graphsToDisplay.spot = newOptions.showspot.value;
                }

                if ('image' in newOptions) {
                  if (newOptions.image.value !== '') {
                    this.imageSrc = `file:///${newOptions.image.value}`;
                  } else {
                    this.imageSrc = defaultImageSrc()
                  }
                }

                this.cacheKey += 1;
            }
        }
    },
    methods: {
        onWallpaperEngineEvent(event) {
            this.wallpaperEngineOptions = event.detail
            console.log({options: this.wallpaperEngineOptions});
        },
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

* {
    user-select: none;
}

html, body {
    overflow: hidden;
    background-color: #000;
    margin: 0;
}

body {
    margin: 0;
    position: fixed;
    width: 100%;
    height: 100%;
}

main {
    height: 100%;
}

.background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
}

.tibber {
    position: absolute;
    bottom: 40px;
    width: 100%;
}
</style>
