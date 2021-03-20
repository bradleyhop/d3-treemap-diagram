<script>
import Treemap from './components/Treemap.vue';
import Footer from './components/Footer.vue';

// json url, title, and description for all three given data sets for project
const treeData = {
  game: {
    url:
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
    title: 'Video Game Sales',
    desc: 'Top 100 Most Sold Video Games Grouped by Platform\n(In Millions of Units)',
  },
  movie: {
    url:
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
    title: 'Movie Sales',
    desc: 'Top 100 Highest Grossing Movies Grouped By Genre\n(In US Dollars)',
  },
  kickstarter: {
    url:
    'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
    title: 'Kickstarter Pledges',
    desc: 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category\n(In Us Dollars)',
  },
};

console.log(treeData.movie.desc);

export default {
  name: 'App',

  data() {
    return {
      // load page with default values showing the game treemap
      url: treeData.game.url,
      title: treeData.game.title,
      desc: treeData.game.desc,
    };
  },

  components: {
    Treemap,
    Footer,
  },

  methods: {
    changeVals(category) {
      switch (category) {
        case 'game':
          this.url = treeData.game.url;
          this.title = treeData.game.title;
          this.desc = treeData.game.desc;
          break;
        case 'movie':
          this.url = treeData.movie.url;
          this.title = treeData.movie.title;
          this.desc = treeData.movie.desc;
          break;
        case 'kickstarter':
          this.url = treeData.kickstarter.url;
          this.title = treeData.kickstarter.title;
          this.desc = treeData.kickstarter.desc;
          break;
        default:
          throw new Error(`Unknown button selection: ${category}`);
      }

      console.log(this.url);
    },
  },
};
</script>

<template>
  <div
    class="content"
    role="main"
  >

  <!-- user selects treemap (game shown by default) -->
  <div class="chart-select">
    <span
      @click="changeVals('game')"
      class="category-select">
      game
    </span>
    |
    <span
      @click="changeVals('movie')"
      class="category-select">
      movie
    </span>
    |
    <span
      @click="changeVals('kickstarter')"
      class="category-select">
      kickstarter
    </span>
  </div>

    <Treemap
      :dataUrl="url"
      :title="title"
      :desc="desc"
    />

  </div>

  <footer>
    <Footer />
  </footer>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  margin: 0;

  &::before {
    box-sizing: border-box;
  }

  &::after {
    box-sizing: border-box;
  }
}

body {
  background-color: $app-background;
}

#app {
  color: $text-default;
  display: flex; // boilerplate to keep footer down below
  flex-direction: column; // footer at the bottom ;)
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh; // needed to stick the footer to bottom
  text-align: center;
}

.content {
  flex: 1 0 auto; // grow page space to content
}

.chart-select {
  margin-top: 1rem;
}

.category-select {
  cursor: pointer;
  font-family: Roboto, Helvetica, Arial, sans-serif;

  &:hover {
    text-decoration: underline;
  }
}

footer {
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their
  content's default minimum size. */
  flex-shrink: 0;
}
</style>
