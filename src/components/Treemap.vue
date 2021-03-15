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
      widthViewPort: 1100,
      heightViewPort: 600,
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
        .attr('class', 'map');

      // Here the size of each leave is given in the 'value' field in input data
      const root = d3.hierarchy(this.gameData)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value); // arrange categories from largest to smallest

      d3.treemap()
        .size([this.widthViewPort - 50, this.heightViewPort - 50])
        // .padding(0.75)
        .paddingRight(2)
        .paddingTop(24) // this is the killer
        .paddingInner(2)(root);

      // puts text and rect into their own svg groups; NOTE: only entering data here is required
      const blockGroup = map.selectAll('.blockGroup')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('class', 'blockGroup');

      // let's add titles for each group
      map.selectAll('titles')
        .data(root.descendants().filter((d) => d.depth === 1))
        .enter()
        .append('text')
        .attr('class', 'group-title')
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0 + 20)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .text((d) => d.data.name)
        .attr('font-size', '16px')
        .attr('fill', 'black');

      // draw the boxes
      blockGroup.append('rect')
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
      blockGroup.append('text')
        .attr('x', (d) => d.x0 + 5)
        .attr('y', (d) => d.y0 + 12)
        .text((d) => d.data.name)
        .attr('font-size', '10px')
        .attr('fill', 'white');

      // tooltip will be on mouseon()
    },
  },
};
</script>

<template>
  <div class="conainter-treemap">
    <!-- show message to user that data is processing; once data is merged,
      drawing the map is quick -->
      <p
        class="loading-message"
        v-if="this.loading"
      >
      Loading...
      </p>
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

</style>
