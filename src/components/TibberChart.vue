<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    extends: Line,
    mixins: [reactiveProp],
    props: {
        live: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        gradients: {
            red: null,
            blue: null,
            yellow: null,
        }
    }),
    mounted () {
        this.createGradients()
        this.renderChart(this.chartData, this.chartjsOptions);
    },
    computed: {
        chartjsOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0,
                },
                legend: {
                    display: false
                },
                layout: {
                    padding: {
                        left: this.live ? -5 : -10,
                        bottom: -10
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            display: this.live,
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
                }
            };
        },
        // datasets() {
        //     const datasets = [];
        //     const sharedOptions = {
        //         pointRadius: 1,
        //         borderWidth: 1,
        //         pointBackgroundColor: 'black',
        //         pointBorderColor: 'white',
        //     }

        //     if (this.consumptionPoints && this.displaying.consumption) {
        //         datasets.push({
        //             ...sharedOptions,
        //             label: 'Consumption',
        //             borderColor: '#FC2525',
        //             backgroundColor: this.gradient,
        //             data: this.consumptionPoints
        //         })
        //     }

        //     if (this.costPoints && this.displaying.cost) {
        //         datasets.push({
        //             ...sharedOptions,
        //             label: 'Cost',
        //             borderColor: '#05CBE1',
        //             backgroundColor: this.gradient2,
        //             data: this.costPoints
        //         })
        //     }

        //     if (this.spotPoints && this.displaying.spot) {
        //         datasets.push({
        //             ...sharedOptions,
        //             label: 'Spot price',
        //             borderColor: '#ffeb00',
        //             backgroundColor: this.gradient3,
        //             data: this.spotPoints,
        //         })
        //     }

        //     return datasets;
        // }
    },
    // watch: {
    //     datasets: {
    //         handler(datasets) {
    //             this.renderChart({ labels: this.labels, datasets }, this.chartjsOptions);
    //         }
    //     }
    // },
    methods: {
        createGradients() {
            this.gradients = {
                red : this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450),
                blue : this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450),
                yellow : this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450),
            }

            this.gradients.red.addColorStop(0, 'rgba(255, 0,0, 0.5)') // #ff0000
            this.gradients.red.addColorStop(0.5, 'rgba(255, 0, 0, 0.25)');
            this.gradients.red.addColorStop(1, 'rgba(255, 0, 0, 0)');

            this.gradients.blue.addColorStop(0, 'rgba(0, 231, 255, 0.9)') // #00e7ff
            this.gradients.blue.addColorStop(0.5, 'rgba(0, 231, 255, 0.25)');
            this.gradients.blue.addColorStop(1, 'rgba(0, 231, 255, 0)');

            this.gradients.yellow.addColorStop(0, 'rgba(255, 235, 0, 0.9)') // #ffeb00
            this.gradients.yellow.addColorStop(0.5, 'rgba(255, 235, 0, 0.25)');
            this.gradients.yellow.addColorStop(1, 'rgba(255, 235, 0, 0)');

            this.$emit('gradients', this.gradients)
        },
    }
}
</script>