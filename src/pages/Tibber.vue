<template>
    <div class="tibber">
        <h1 v-if="error">{{ error }}</h1>
        <tibber-chart
          v-else-if="loaded"
          :chart-data="chartData"
          @gradients="gradients = $event"
        />
    </div>
</template>

<script>
import TibberChart from '@/components/TibberChart.vue'

export default {
    components: {
        TibberChart,
    },
    props: {
        apiKey: {
            type: String,
            default: '',
        },
        graphsToDisplay: {
            type: Object,
            default: () => ({})
        },
    },
    data: () => ({
        tibber: {
            latest: []
        },
        loaded: false,
        error: '',
        gradients: {
            blue: null,
            red: null,
            yellow: null,
        },
    }),
    computed: {
        chartData() {
            const datasets = [];
            const shared = {
                pointRadius: 1,
                borderWidth: 1,
                pointBackgroundColor: 'black',
                pointBorderColor: 'white',
            }

            if (this.graphsToDisplay.spot) {
                datasets.push({
                    ...shared,
                    label: 'spot',
                    borderColor: '#ffeb00',
                    backgroundColor: this.gradients.yellow,
                    data: this.tibberDataPointsSpot,
                })
            }
            
            if (this.graphsToDisplay.consumption) {
                datasets.push({
                    ...shared,
                    label: 'Consumption',
                    borderColor: '#ff0000',
                    backgroundColor: this.gradients.red,
                    data: this.tibberDataPoints,
                })
            }

            if (this.graphsToDisplay.cost) {
                datasets.push({
                    ...shared,
                    label: 'cost',
                    borderColor: '#00e7ff',
                    backgroundColor: this.gradients.blue,
                    data: this.tibberDataPointsCost,
                })
            }

            return {
                labels: this.tibberDataLabels,
                datasets,
            }
        },
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
    mounted() {
        this.fetchTibberData();
    },
    methods: {
        async fetchTibberData() {
            try {
                const request = await fetch('https://api.tibber.com/v1-beta/gql', {
                    method: 'post',
                    headers: new Headers({
                        'Authorization': `Bearer ${this.apiKey}`, 
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify({
                        query: "{ viewer { homes { consumption(resolution: HOURLY, last: 39) { nodes { from to cost unitPrice unitPriceVAT consumption consumptionUnit } } } }}",
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

</style>