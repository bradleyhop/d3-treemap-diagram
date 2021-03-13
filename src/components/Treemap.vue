<script>
import * as d3 from 'd3';

export default {
  name: 'Treemap',

  data() {
    return {
      loading: true, // conditional redning variable to show basic loading status to user
      // placeholder for the data set
      dataUrl:
      'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
      gameData: undefined,
      widthViewPort: 1200,
      heightViewPort: 800,
      mapPosition: '0, 0', // offset for map position
    };
  },

  created() {
    fetch(this.dataUrl)
      .then((response) => response.json())
      .then((data) => {
        // store obj within vue; make non-reactive since this data isn't going to change; speedup
        this.gameData = Object.freeze(data);
      })
      .then(() => this.graphInit())
      .catch((error) => console.log(error));
  },

  methods: {
    graphInit() {
      // remove loading message
      this.loading = false;

      const svg = d3.select('#treemap')
        .append('svg')
        .attr('width', this.widthViewPort)
        .attr('height', this.heightViewPort);

      // svg group for the mapping of data; helps keep data graphics separate from axis
      const map = svg.append('g')
        .attr('id', 'map')
        .attr('class', 'map')
        .attr('transform', `translate(${this.mapPosition})`);

      const root = d3.hierarchy(this.gameData).sum((d) => d.value);

      d3.treemap().size([this.widthViewPort, this.heightViewPort]).padding(1)(root);

      // draw the boxes
      map.selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('class', 'tile') // project requirement
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        // next three attributes are project requirements
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .style('stroke', 'black')
        .style('fill', 'green');

      // add text within boxes
      map.selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
        .attr('x', (d) => d.x0 + 5)
        .attr('y', (d) => d.y0 + 12)
        .text((d) => d.data.name)
        .attr('font-size', '10px')
        .attr('fill', 'white');

      // function declaration for tooltip div element
      const divTool = d3.select('#tooltip-container')
        .append('g')
        .attr('id', 'tooltip') // must be here to satisfy project requirement
        .style('visibility', 'hidden');

      // placeholders to quiet eslint
      divTool.append('g');
    },
  },
};
</script>

<template>
  <div class="conainter-treemap">
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
    <!-- d3 treemap map is drawn at #treemap -->
    <div
      class="treemap"
      id="treemap"
      >
    </div>
  </div>
</template>

<style lang="scss">
// DO NOT SCOPE THIS COMPONENT'S STYLE: D3 won't be able to see it

.treemap {
  margin: auto;
  width: 85%;

  // scale for tablets and phones
  @media only screen and  (max-width: 800px) {
    width: 100%;
  }
}

.tooltip-container {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 24px;
  font-weight: bold;
  height: 1.75rem;
  margin-top: 1.5rem;
}
</style>
