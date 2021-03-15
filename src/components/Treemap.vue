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
      widthViewPort: 1000,
      heightViewPort: 650,
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

      const colorScale = d3.scaleOrdinal()
        .domain(
          // dynamically add to domain
          this.gameData.children.map((d) => d.name),
        )
        .range(
          // built-in d3 colorscheme; see: https://github.com/d3/d3-scale-chromatic
          // d3 will cycle the colors if the domain is larger than the range
          d3.schemeTableau10,
        );

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

      // let's add titles for each group; using map constructor so that title is only displayed once
      //  per category, instead of once per group item
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
        .style('fill', (d) => colorScale(d.data.name));

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
        .style('fill', (d) => colorScale(d.parent.data.name));

      // add text within boxes
      blockGroup.append('text')
        .attr('class', 'tile-text')
        .attr('x', (d) => d.x0 + 5)
        .attr('y', (d) => d.y0 + 12)
        .text((d) => d.data.name);

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

.group-title {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 1rem;
}

.tile-text {
  font-size: 0.65rem;
  fill: #fff;
}
</style>
