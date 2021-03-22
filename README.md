# d3-treemap-diagram

Data Visualization Project for freeCodeCamp.org Data Visualization Project:
Visualize Data with a Treemap Diagram. This implementation uses Vue & D3 as the
main technology stacks.

## Project Info

See the [User
Stories](https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-treemap-diagram)
for project requirements.

I've added the feature of choosing between the three data sets provided by
freeCodeCamp.org by selecting the graph category on the top of the page.

## Integrated Testing Suite

freeCodeCamp.org offers a script that will test each User Story point. To test,
select the testing component (the green three-line-hamburger icon in the upper
left corner), choose 'D3 Treemap Diagram' from the drop-down menu, and hit 'Run
Tests'. Select the 'Tests' button after the script is finished to see details of
test. (Note: I've noticed the test will pass on initial page load. After
selecting a different graph, the test will not pass because the tooltips are not
being seen by the test anymore. I believe this to be a limitation of the testing
suite and not the project itself. Adding the feature of choosing graphs goes
beyond, but was in the demo, the project's specification.)

## Project Layout

I use [Vue CLI](https://cli.vuejs.org/) to build this project, which uses
various tools like webpack, babel, sass, and others to build a application
easily servable on github pages.  The main scaffolding of the app is in
`src/App.vue`. Here, the layout of the page and default data values for chosen
treemap category are stored. In `src/componenets/Treemap.vue`, we'll find all
the D3 code that draws the treemap, legend, and tooltips. In it, Vue calls the
code to download the json data, pass it to the graph drawing function, and watch
for updates to the chosen category to download the new json data, clear any
previous D3-generated elements, and draw the new treemap, legend, and tooltips.

## Take-Aways

This project was fairly simple to code (at least compared to the Choropleth Map
project). The most challenge I had was formatting: getting text within each cell
to not overflow out of its cell.  Grouping together the cell and the text with a
SVG `<g>` element was a good start, but didn't completely solve the issue.
Splitting the text by words with capital letters and stacking them vertically
helped convey the data presented and contain more of the text within the cell.
However, the text still overflows into the adjacent cells around it. The fix
came in realizing this text overflow is being obscured by the drawing of the
next group element. So, in keeping the padding between cells and groups of cells
small, one can hide the text overflow. Finally, putting a new svg element (here
is where our legend is drawn) hides any vertical overflow from the bottom cells.

### D3.js and You

While digging through articles and documentation to write this project, I came
across an interesting article about ["Why I no longer use D3.js" by Paul
Sweeney](https://medium.com/@PepsRyuu/why-i-no-longer-use-d3-js-b8288f306c9a).
Sweeney argues that advances in Canvas and HTML along with your favorite modern
javascript framework (Preact.js is demonstrated in the article), that D3.js is
usually overkill for simple projects and, because of D3's steep learning curve,
can be harder to maintain from developer to developer. I agree that the D3 is
not very beginner-friendly. D3.js will let me misspell methods all day long without a
peep, for example. In contrast, between my eslint configuration and Vue's error
messaging, I know exactly when I'm not using a certain feature correctly. I
finally figured out how to turn on the 'stop on exceptions' feature in my
browser's devtools, which helps in debugging D3.js features.

One  quote from the article really rang true with me: "What many people,
including myself do, is that we find an example online that roughly matches what
we’re looking for, and modify the example to suit our needs." I definitely did
this during my journey of completing my Data Visualization with D3.js
certification. However, perhaps this was the part of the intended skill set that
these projects intended to teach. If anything, I learned the power of writing
reusable code. The fetch'ing, the tooltips, the page layout, footer, and other
components were copied from previous projects cutting development time as a
result.

While past projects may have been written without using D3.js, this project
seems like a good candidate for utilizing the power in drawing a more complex
data visualization.


### Colors

For choosing colors, I stumbled upon [i want
hue](https://medialab.github.io/iwanthue/). This easy to use online tool made
generating a color scheme a breeze. I usually try to stick with a material
design aesthetic, but in this case I deferred to those who have more knowledge in
presenting data than I do. Explicitly, defining palettes with optimally distinct
colors.

### Vue
By extending this project with the option to choose between the three data sets
given for this project, I was able to utilize certain Vue.js features such as
text interpolation, passing down props, and watching changes in props to know
when to draw a new graph, title, and description.

With the completion of this project, I have earned my (Data Visualization with D3.js Certification)[https://www.freecodecamp.org/certification/bradleyhop/data-visualization].
