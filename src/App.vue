<template>
  <main>
    <div class="background" :style="`background-image: url('${imageSrc}')`" />
    <div class="tibber">
        <h1 v-if="!apiKey">Missing API key</h1>
        <h1 v-else-if="error">{{ error }}</h1>
        <tibber-chart
          v-else-if="loaded"
          :labels="tibberDataLabels"
          :consumption-points="tibberDataPoints"
          :cost-points="tibberDataPointsCost"
          :spot-points="tibberDataPointsSpot"
          :displaying="graphsToDisplay"
        />
    </div>
  </main>
</template>

<script>
import TibberChart from './components/TibberChart.vue'

const defaultImageSrc = () => 'img/taylor-smith-it0Pkba02FM-unsplash.jpg';

export default {
  name: 'App',
  components: {
    TibberChart,
  },
   data: () => ({
      imageSrc: defaultImageSrc(),
      tibber: {
        latest: []
      },
      loaded: false,
      wallpaperEngineOptions: {},
      apiKey: '',
      error: '',
      graphsToDisplay: {
        consumption: true,
        cost: true,
        spot: false,
      },
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
          this.apiKey = process.env.VUE_APP_TIBBER_API_KEY;
          this.fetchTibberData()
        }
    },
    computed: {
        tibberDataPoints() {
            return this.tibber.latest.map(point => point.consumption).filter(e => e !== null);
        },
        tibberDataPointsCost() {
            return this.tibber.latest.filter(e => e.consumption !== null).map(point => point.cost);
        },
        tibberDataPointsSpot() {
            return this.tibber.latest.filter(e => e.consumption !== null).map(point => point.unitPrice);
        },
        tibberDataLabels() {
            const labels = this.tibber.latest.filter(e => e.consumption !== null).map(point => {
                const start = new Date(point.from).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});
                const end = new Date(point.to).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit'});

                return start + ' – ' + end;
            });

            return labels;
        }
    },
    watch: {
        wallpaperEngineOptions: {
            deep: true,
            handler(newOptions) {
                if ('tibberapikey' in newOptions) {
                  this.apiKey = newOptions.tibberapikey.value;
                  this.fetchTibberData(this.apiKey);
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
            }
        }
    },
    methods: {
        onWallpaperEngineEvent(event) {
            this.wallpaperEngineOptions = event.detail
            console.log({options: this.wallpaperEngineOptions});
        },
        async fetchTibberData() {
            try {
                const request = await fetch('https://api.tibber.com/v1-beta/gql', {
                    method: 'post',
                    headers: new Headers({
                        'Authorization': `Bearer ${this.apiKey}`, 
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify({
                        query: "{ viewer { homes { consumption(resolution: HOURLY, last: 44) { nodes { from to cost unitPrice unitPriceVAT consumption consumptionUnit } } } }}",
                        variables: null
                    })
                });
                
                const response = await request.json();
                
                this.loaded = true;
                this.tibber.latest = response?.data?.viewer?.homes[0]?.consumption?.nodes;
                this.error = false;
            } catch (error) {
                this.error = 'Failed to load Tibber API'
            }
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
