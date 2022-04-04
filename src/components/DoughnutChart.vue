<script>
import { Doughnut, mixins } from "vue-chartjs";

export default {
  name: "Chart",
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  props: ["chartData", "options"],

  mounted() {
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    options: {
      handler(newOption, oldOption) {
        this.$data._chart.destroy();
        this.renderChart(this.chartData, this.options);
      },
      deep: true,
    },
  },
};
</script>