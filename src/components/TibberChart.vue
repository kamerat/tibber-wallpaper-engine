<script>
import { Line } from 'vue-chartjs'

export default {
    extends: Line,
    props: {
        labels: {
            type: Array,
            default: () => []
        },
        displaying: {
            type: Object,
            default: () => ({
                consumption: true,
                cost: true,
                spot: true,
            })
        },
        consumptionPoints: {
            type: Array,
            default: () => []
        },
        costPoints: {
            type: Array,
            default: () => []
        },
        spotPoints: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        gradient: null,
        gradient2: null,
        gradient3: null,
        chartjsOptions: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            layout: {
                padding: {
                    left: -10,
                    bottom: -10
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: false,
                    },
                    gridLines: {
                        display: false
                    }
                }],
                xAxes: [{
                    ticks: {
                        display: false,
                    },
                    gridLines: {
                        display: false
                    }
                }]
            },
        }
    }),
    mounted () {
        this.createGradients();
    },
    computed: {
        datasets() {
            const datasets = [];
            const sharedOptions = {
                pointRadius: 1,
                borderWidth: 1,
                pointBackgroundColor: 'black',
                pointBorderColor: 'white',
            }

            if (this.consumptionPoints && this.displaying.consumption) {
                datasets.push({
                    ...sharedOptions,
                    label: 'Consumption',
                    borderColor: '#FC2525',
                    backgroundColor: this.gradient,
                    data: this.consumptionPoints
                })
            }

            if (this.costPoints && this.displaying.cost) {
                datasets.push({
                    ...sharedOptions,
                    label: 'Cost',
                    borderColor: '#05CBE1',
                    backgroundColor: this.gradient2,
                    data: this.costPoints
                })
            }

            if (this.spotPoints && this.displaying.spot) {
                datasets.push({
                    ...sharedOptions,
                    label: 'Spot price',
                    borderColor: '#ffeb00',
                    backgroundColor: this.gradient3,
                    data: this.spotPoints,
                })
            }

            return datasets;
        }
    },
    watch: {
        datasets: {
            handler(datasets) {
                this.renderChart({ labels: this.labels, datasets }, this.chartjsOptions);
            }
        }
    },
    methods: {
        createGradients() {
            this.gradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
            this.gradient2 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
            this.gradient3 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)

            this.gradient.addColorStop(0, 'rgba(255, 0,0, 0.5)')
            this.gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
            this.gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

            this.gradient2.addColorStop(0, 'rgba(0, 231, 255, 0.9)')
            this.gradient2.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)');
            this.gradient2.addColorStop(1, 'rgba(0, 231, 255, 0)');

            this.gradient3.addColorStop(0, 'rgba(255, 235, 0, 0.9)')
            this.gradient3.addColorStop(0.5, 'rgba(255, 235, 0, 0.25)');
            this.gradient3.addColorStop(1, 'rgba(255, 235, 0, 0)');

        },
    }
}
</script>