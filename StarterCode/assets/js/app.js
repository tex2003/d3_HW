// Step 1: Set up our chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 170,
  bottom: 60,
  left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3: Import and Parse Data
d3.csv("assets/data/data.csv", function(error, data) {
  if (error) throw error;
  data.forEach(function(d) {
    d.obesity= +d.obesity;
    d.smokes= +d.smokes;
  });    
  // Step 4: Create the scales for the chart - obesity vs smokes 
  var x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.date))
    .range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);

  // Step 5: Set up the y-axis domain
  var xMax = d3.max(data, d => d.smokes);
  var yMax = d3.max(data, d => d.obesity);
  var xMin = d3.min(data, d => d.smokes);  
  var yMin = d3.min(data, d => d.obesity);  
  // Use the yMax value to set the yLinearScale domain
  x.domain([xMin-2, xMax]);
  y.domain([yMin, yMax+ 3]);
     
  // Step 6: Create the axes
  var bottomAxis = d3.axisBottom(x);
  var leftAxis = d3.axisLeft(y);

  // Step 7: Append the axes to the chartGroup
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g").call(leftAxis);

  // Step 9: Load Data  
  var circlesGroup = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("r", 11)
    .attr("cx", function(d) { return x(d.smokes); })
    .attr("cy", function(d) { return y(d.obesity); })
    .classed("stateCircle",true)
   
  svg.selectAll()
    .data(data)
    .enter().append('text')
    .attr("r", 8)
    .attr("x", function(d) { return x(d.smokes); })
    .attr("y", function(d) { return y(d.obesity); })
    .text(function(d) { return d.abbr; })
    .classed("stateText", true);

  svg.append("text")
  .attr("transform", `translate(${(width / 2)+ 65}, ${margin.top + 5})`)
    .classed("title", true)
  .text("Correlation between Obesity and Smokers ");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .classed("aText", true)
    .attr("dy", "1em")
    .text("Obesity (%)");

  svg.append("text")
    .attr("transform", `translate(${(width / 2)+ 65}, ${height + margin.top + 40})`)
    .classed("aText", true)
    .text("Smokers (%)");

  // Step 1: Initialize Tooltip
  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .html(function(d) {
    return (`State: ${d.abbr}<br>Smoker: ${d.smokes}%, Obesity: ${d.obesity}%`);
  });

  // Step 2: Create the tooltip in chartGroup.
  chartGroup.call(toolTip);

  // Step 3: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
     toolTip.show(d, this);
  })
  // Step 4: Create "mouseout" event listener to hide tooltip
  .on("mouseout", function(d) {
    toolTip.hide(d);
  });

});
