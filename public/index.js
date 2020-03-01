d3.select("body")
  .append("h1")
  .attr("id", "title")
  .text("Scatterplot Graph");

const margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;

const color = d3.scaleOrdinal(d3.schemeTableau10);

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleTime().range([0, height]);

const timeFormat = d3.timeFormat("%M:%S");

const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
const yAxis = d3.axisLeft(y).tickFormat(timeFormat);

const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const svg = d3
  .select("body")
  .append("div")
  .attr("id", "viz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "graph")
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then(data => {
    console.log(data);

    data.forEach(function(d) {
      const parsedTime = d.Time.split(":");
      console.log(parsedTime);
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    x.domain([d3.min(data, d => d.Year - 1), d3.max(data, d => d.Year + 1)]);
    y.domain(d3.extent(data, d => d.Time));

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

    svg
      .append("g")
      .attr("class", "y axis")
      .attr("id", "y-axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Best Time (minutes)");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -160)
      .attr("y", -44)
      .style("font-size", 18)
      .text("Time in Minutes");

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 6)
      .attr("cx", d => x(d.Year))
      .attr("cy", d => y(d.Time))
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => d.Time.toISOString())
      .style("fill", d => color(d.Doping != ""));
  })
  .catch(error => {
    console.error(error);
  });
