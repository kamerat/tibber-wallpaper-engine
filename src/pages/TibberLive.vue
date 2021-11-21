<template>
    <div class="tibber">
        <h1 v-if="error">{{ error }}</h1>
        <tibber-chart
          v-else-if="loaded"
          ref="tibberChart"
          live
          :chart-data="chartData"
          @gradients="gradients = $event"
        />
    </div>
</template>

<script>
import TibberChart from '@/components/TibberChart.vue'
import gql from "graphql-tag";

export default {
    components: {
        TibberChart,
    },
    props: {
        apiKey: {
            type: String,
            default: '',
        },
    },
    data: () => ({
        latestMeasurements: [],
        loaded: false,
        error: '',
        graphsToDisplay: {
            consumption: true,
            cost: true,
            spot: false,
        },
        gradients: {
            blue: null,
            red: null,
            yellow: null,
        },
    }),
    apollo: {
        // Subscriptions
        $subscribe: {
            // When a nomination is added
            nominations: {
                query: gql`
                subscription  getLiveMeasurement {
                    liveMeasurement(homeId:"b3e31326-4d67-443f-a107-767244d263ef") {
                        timestamp
                        power
                        accumulatedConsumption
                        accumulatedCost
                        currency
                        minPower
                        averagePower
                        maxPower
                    }
                }
                `,
                result (data) {
                    // Let's update the local data
                    const measurement = data.data.liveMeasurement
                    if (this.latestMeasurements.length >= 30) {
                        this.latestMeasurements.shift();
                    }

                    this.latestMeasurements.push(measurement)
                    this.loaded = true
                },
            },
        },
    },
    computed: {
        chartData() {
            return {
                labels: this.tibberDataLabels,
                datasets: [
                    {
                        label: 'Consumption',
                        borderColor: '#00e7ff',
                        backgroundColor: this.gradients.blue,
                        data: this.tibberPowerPoints,
                        pointRadius: 1,
                        borderWidth: 1,
                        pointBackgroundColor: 'black',
                        pointBorderColor: 'white',
                    },
                ]
            }
        },
        tibberPowerPoints() {
            return this.latestMeasurements.map(measurement => measurement.power);
        },
        tibberDataAccumulatedConsumption() {
            return this.latestMeasurements.map(point => point.accumulatedConsumption);
        },
        tibberDataAccumulatedCost() {
            return this.latestMeasurements.map(point => point.accumulatedCost);
        },
        tibberDataLabels() {
            const labels = this.latestMeasurements.map(measurement => {
                const measurementTime = new Date(measurement.timestamp).toLocaleTimeString('no-NO', {hour: '2-digit', minute: '2-digit', second: '2-digit'});

                return measurementTime;
            });

            return labels;
        }
    },
}
</script>

<style>

</style>