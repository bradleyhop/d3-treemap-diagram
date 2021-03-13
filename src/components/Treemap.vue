<script>
import * as d3 from 'd3';

export default {
  name: 'Treemap',

  data() {
    return {
      loading: true, // conditional redning variable to show basic loading status to user
      // placeholder for the data set
      gameData: undefined,
      mapViewBox: '0, 0, 1200, 610', // position of BOTH state and county maps within the svg
      mapPosition: '120, 0', // offset for map position
    };
  },

  created() {
    console.log('hello');
    this.loading = false;
  },

  methods: {
    graphInit() {
      // remove loading message
      this.loading = false;

      const svg = d3.select('#choropleth')
        .append('svg')
        .attr('viewBox', this.mapViewBox);

      // svg group for the mapping of data; helps keep data graphics separate from axis
      const map = svg.append('g')
        .attr('id', 'map')
        .attr('class', 'map')
        .attr('transform', `translate(${this.mapPosition})`);

      // function declaration for tooltip div element
      const divTool = d3.select('#tooltip-container')
        .append('g')
        .attr('id', 'tooltip') // must be here to satisfy project requirement
        .style('visibility', 'hidden');

      // placeholders to quiet eslint
      map.append('g');
      divTool.append('g');
    },
  },
};
</script>

<template>
  <div class="conainter-choropleth">
    <!-- tooltip info displays on mouseover here; id is project requirement -->
    <div
      id="tooltip-container"
      class="tooltip-container"
      >
      <!-- show message to user that data is processing; once data is merged,
        drawing the map is quick -->
      <p
        class="loading-message"
        v-if="this.loading">
      Loading...
      </p>
    </div>
    <!-- d3 choropleth map is drawn at #choropleth -->
    <div
      class="choropleth"
      id="choropleth"
      >
    </div>
  </div>
</template>

<style lang="scss">
// DO NOT SCOPE THIS COMPONENT'S STYLE: D3 won't be able to see it

// set container width so that map scales with the viewport; in conjunction with svg attribute
//  viewBox
.choropleth {
  margin: auto;
  width: 65%;

  // scale for tablets and phones
  @media only screen and  (max-width: 800px) {
    width: 100%;
  }
}

.county:hover {
  fill: #fff;
  stroke: #616161;
}

.state {
  stroke: $app-background;
}

// legend tick
.tick text {
  font-size: 0.9rem;
}

.tooltip-container {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  height: 1.75rem;
  margin-top: 1.5rem;
}
</style>
