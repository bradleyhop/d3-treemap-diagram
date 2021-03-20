<script>
import * as d3 from 'd3';

export default {
  name: 'Treemap',

  props: {
    dataUrl: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      widthTreeMap: 800,
      heightTreeMap: 500,
      legendHeight: 200, // room for legend at bottom
      // color scheme computed using https://medialab.github.io/iwanthue/ with the fancy (light
      //  background) preset; 20 colors chosen to cover all three data sets
      colorBand: ['#c6b9ff', '#edd88d', '#3ab9ee', '#f09288', '#57e1d7', '#f698bc', '#88f1cc',
        '#ffc2d2', '#a6f6c0', '#fcd8ff', '#a1b372', '#78e6ff', '#cda387', '#94fff4', '#f7ffc3',
        '#a5e0ff', '#c9ffc8', '#9ebed3', '#c1eeec', '#96beb4'],
    };
  },

  created() {
    // show default data on load
    this.getData(this.dataUrl);
  },

  methods: {
    // use javascript fetch to retrieve json data and pass it to graphInit
    getData(jsonUrl) {
      let thisData;
      fetch(jsonUrl)
        .then((response) => response.json())
        .then((data) => {
          thisData = data;
        })
        .then(() => this.graphInit(thisData))
        .catch((error) => console.log(error));
    },

    // draws treemap, legend, and tooltip
    graphInit(fetchData) {
      // main category groups
      const categories = fetchData.children.map((d) => d.name);

      const colorScale = d3.scaleOrdinal()
        .domain(
          // dynamically add to domain
          categories,
        )
        .range(
          this.colorBand,
        );

      // first remove any previously drawn map
      d3.select('#treemap > svg').remove();
      d3.select('#legend > svg').remove();

      const svg = d3.select('#treemap')
        .append('svg')
        .attr('width', this.widthTreeMap)
        .attr('height', this.heightTreeMap);

      // svg group for the mapping of data; helps keep data graphics separate from axis
      const map = svg.append('g')
        .attr('id', 'map')
        .attr('class', 'map');

      // Here the size of each leave is given in the 'value' field in input data
      const root = d3.hierarchy(fetchData)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value); // arrange categories from largest to smallest

      // tell D3 we want a treemap; set the size and padding
      d3.treemap()
        .size([this.widthTreeMap, this.heightTreeMap])
        .padding(0.4)(root);

      // puts text and rect into their own svg groups; NOTE: only entering data here is required
      //  set position here so word wrapping in text function works
      const blockGroup = map.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`) // set position of rect and text
        .attr('class', 'blockGroup');

      // draw the boxes
      blockGroup
        .append('rect')
        .attr('class', 'tile') // project requirement
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        // next three attributes are project requirements
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .style('fill', (d) => colorScale(d.parent.data.name));

      // add text within boxes
      blockGroup
        .append('text')
        .selectAll('tspan')
        // split data name to create individual tspan elements; title are given in typical title
        //  style with each the first letter of all major words capitalized
        .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
        .enter()
        .append('tspan') // how we get each word on own line
        .attr('class', 'tile-text')
        .attr('x', 4)
        .attr('y', (d, i) => 10 + (9 * i)) // y position for each tspan element
        .text((d) => d);

      // constructor for mouse over tooltip
      const divTool = d3.select('#treemap')
        .append('g')
        .style('opacity', 0);

      // hover to show value with tooltip as defined in divTool above
      //  this triggers on mouse over box or text in box!
      blockGroup
        .on('mouseover', (event, d) => {
          divTool
            .style('opacity', 1)
            .style('display', 'flex') // to align items vertically in css; also display
            .attr('id', 'tooltip') // project requirement
            .attr('class', 'tooltip')
            .attr('data-value', d.data.value) // project requirement
            .html(`<p>
            <span class="toolHeading">${d.data.name}</span><br/>
            <span>${d.data.category}</span><br/>
            <span>${d.data.value}</span>
          </p>`)
          // offsets for tooltip box
            .style('top', `${event.pageY - 80}px`)
            .style('left', `${event.pageX - 55}px`);
        })
        .on('mouseout', () => {
          divTool
            .style('opacity', 0)
            .style('display', 'none');
        });

      // setup legend area
      const legend = d3.select('#legend')
        .append('svg')
        .attr('width', this.widthTreeMap)
        .attr('height', this.legendHeight);

      // area of svg where our legend entries live
      const legendContainer = legend.append('g')
        .attr('id', 'legend')
        .attr('class', 'legend')
        // center the entries
        .attr('transform', `translate(${this.widthTreeMap / 3.5}, 0)`);

      // set position of each entry
      // see: https://stackoverflow.com/questions/51520596/spread-d3-js-legend-on-two-columns
      const legendEntries = legendContainer.selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr('transform', (d, i) => this.positionLegendColumns(i));

      const squareSize = 15;

      legendEntries.append('rect')
        .attr('width', squareSize)
        .attr('height', squareSize)
        .style('fill', (d) => colorScale(d))
        .attr('class', 'legend-item');

      legendEntries.append('text')
        // set x and y to set text next to rect, otherwise it gets drawn above
        .attr('x', 18)
        .attr('y', 12)
        .text((d) => d)
        .attr('class', 'legend-text')
        .attr('text-anchor', 'left')
        .style('alignment-baseline', 'middle');
    },

    // take in the index of entry item and return a position of that item in its set
    // see: https://stackoverflow.com/questions/51520596/spread-d3-js-legend-on-two-columns
    positionLegendColumns(index) {
      const cols = 3; // number of columns
      const height = 22; // height of entry, vertical space between entries
      const width = 150; // width of entry, horizontal space between entries
      const tx = 10; // tx and ty are essentially margin values
      const ty = 10;
      const x = (index % cols) * width + tx;
      const y = Math.floor(index / cols) * height + ty;

      return `translate(${x}, ${y})`;
    },
  },

  watch: {
    // draw new chart, title, and description on parent selection
    dataUrl(val) {
      this.getData(val);
    },
  },
};
</script>

<template>
  <h1
    class="project-title"
    id="title">
  {{ title }}
  </h1>
  <p
    class="description"
    id="description">
  {{ desc }}
  </p>

  <div class="conainter-treemap">
    <!-- d3 treemap map is drawn at #treemap -->
    <div
      class="treemap"
      id="treemap">
    </div>
    <!-- legend for treemap -->
    <div
      class="legend"
      id="legend">
    </div>
  </div>

</template>

<style lang="scss">
// NOTE: DO NOT SCOPE THIS COMPONENT'S STYLE: D3 won't be able to see it

.project-title {
  margin: 1rem 0 1rem 0;
}

.description {
  color: $text-default;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  // using vue text interpelation, so preserve whitespace
  white-space: pre;
}

.group-title {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 1rem;
}

.tile-text {
  font-size: 0.6rem;
  fill: $text-default;
  cursor: default;
}

.legend-text {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 0.75rem;
  fill: $text-default;
}

.tooltip {
  align-items: center;
  background: #757575;
  border-radius: 5px;
  border-style: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  color: #fff;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  padding: 0.5rem 0.6rem;
  position: absolute;
  text-align: left;

  & .toolHeading {
    font-weight: bold;
    font-size: 0.85rem;
  }
}
</style>
