// Chart Params
var svgWidth = 1350;
var svgHeight = 600;

var margin = { top: 20, right: 550, bottom: 60, left: 20 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from an external CSV file
d3.csv("/static/Unemployment_Data.csv", function(error, ColoradoData) {
  if (error) throw error;

  console.log(ColoradoData);
  console.log([ColoradoData]);

  // Create a function to parse date and time
  var parseTime = d3.timeParse("%d-%b-%Y");

  // Format the data
  ColoradoData.forEach(function(data) {
    data.date = parseTime(data.date);
    data.US = +data.US;
    data.Colorado = +data.Colorado;
    data.Denver = +data.Denver;
  });

  var xTimeScale = d3.scaleTime()
  .domain(d3.extent(ColoradoData, d => d.date))
  .range([0, width]);

var yLinearScale = d3.scaleLinear().range([height, 0]);

// find the max of the US data
var USMax = d3.max(ColoradoData, d => d.US);

// find the max of the Colorado data
var ColoradoMax = d3.max(ColoradoData, d => d.Colorado);

var yMax;
if (USMax > ColoradoMax) {
  yMax = USMax;
}
else {
  yMax = ColoradoMax;
}

// Use the yMax value to set the yLinearScale domain
yLinearScale.domain([0, yMax]);


// Create the axes

var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%b-%y"));
var leftAxis = d3.axisLeft(yLinearScale);

// Add x-axis
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// Add y-axis
chartGroup.append("g").call(leftAxis);

// Line generator for US data
var line1 = d3.line()
  .x(d => xTimeScale(d.date))
  .y(d => yLinearScale(d.US));

// Line generator for Colorado data
var line2 = d3.line()
  .x(d => xTimeScale(d.date))
  .y(d => yLinearScale(d.Colorado));

var line3 = d3.line()
  .x(d => xTimeScale(d.date))
  .y(d => yLinearScale(d.Denver));

// Append a path for line1
chartGroup
  .append("path")
  .attr("d", line1(ColoradoData))
  .classed("line green", true);

// Append a path for line2
chartGroup
  .append("path")
  .attr("d", line2(ColoradoData))
  .classed("line orange", true);

  chartGroup
  .append("path")
  .attr("d", line3(ColoradoData))
  .classed("line blue", true);

  var circlesGroup1 = chartGroup.selectAll(".line.orange circle")
  .data(ColoradoData)
  .enter()
  .append("circle")
  .attr("cx", d => xTimeScale(d.date))
  .attr("cy", d => yLinearScale(d.Colorado))
  .attr("r", "3")
  .attr("fill", "orange")
  .attr("stroke-width", "1")
  .attr("stroke", "black");

  var dateFormatter1 = d3.timeFormat("%b-%y");

      // Append tooltip div
      var tooltip1 = d3.select("body")
      .append("div")
      .style("display", "none")
      .classed("tooltip", true);

    // Create "mouseover" event listener to display tooltip
    circlesGroup1.on("mouseover", function(d) {
      tooltip1.style("display", "block")
          .html(
            `<strong>${dateFormatter1(d.date)}<strong><hr>${d.Colorado}% Unemployment<strong><hr>
            ${d.Colorado_vs_Denver}% from Denver Rate<strong><hr>
            ${d.Colorado_vs_US}% from US Rate<strong><hr>${d.Colorado_Change}% Monthly Change`)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");
    })
      // Create "mouseout" event listener to hide tooltip
      .on("mouseout", function() {
        tooltip1.style("display", "none");
      });

var circlesGroup2 = chartGroup.selectAll(".line.green circle")
      .data(ColoradoData)
      .enter()
      .append("circle")
      .attr("cx", d => xTimeScale(d.date))
      .attr("cy", d => yLinearScale(d.US))
      .attr("r", "3")
      .attr("fill", "green")
      .attr("stroke-width", "1")
      .attr("stroke", "black");
    
  var dateFormatter2 = d3.timeFormat("%b-%y");
    
          // Append tooltip div
          var tooltip2 = d3.select("body")
          .append("div")
          .style("display", "none")
          .classed("tooltip", true);
    
        // Create "mouseover" event listener to display tooltip
        circlesGroup2.on("mouseover", function(d) {
          tooltip2.style("display", "block")
              .html(
                `<strong>${dateFormatter2(d.date)}<strong><hr>${d.US}% Unemployment<strong><hr>
                ${d.US_vs_Denver}% from Denver Rate<strong><hr>
                ${d.US_vs_Colorado}% from Colorado Rate<strong><hr>${d.US_Change}% Monthly Change`)
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY + "px");
        })
          // Create "mouseout" event listener to hide tooltip
          .on("mouseout", function() {
            tooltip2.style("display", "none");
          });

          var circlesGroup3 = chartGroup.selectAll(".line.blue circle")
          .data(ColoradoData)
          .enter()
          .append("circle")
          .attr("cx", d => xTimeScale(d.date))
          .attr("cy", d => yLinearScale(d.Denver))
          .attr("r", "3")
          .attr("fill", "blue")
          .attr("stroke-width", "1")
          .attr("stroke", "black");
        
      var dateFormatter2 = d3.timeFormat("%b-%y");
        
              // Append tooltip div
              var tooltip3 = d3.select("body")
              .append("div")
              .style("display", "none")
              .classed("tooltip", true);
        
            // Create "mouseover" event listener to display tooltip
            circlesGroup3.on("mouseover", function(d) {
              tooltip3.style("display", "block")
                  .html(
                    `<strong>${dateFormatter2(d.date)}<strong><hr>${d.Denver}% Unemployment<strong><hr>
                    ${d.Denver_vs_Colorado}% from Colorado Rate<strong><hr>
                    ${d.Denver_vs_US}% from US Rate<strong><hr>
                    ${d.Denver_Change}% Monthly Change`)
                  .style("left", d3.event.pageX + "px")
                  .style("top", d3.event.pageY + "px");
            })
              // Create "mouseout" event listener to hide tooltip
              .on("mouseout", function() {
                tooltip3.style("display", "none");
              });

          chartGroup.append("text")
          .attr("transform", `translate(${width + 85}, ${height + margin.top + -280})`)
            .classed("US-text text", true)
            .text("United States");
        
          chartGroup.append("text")
          .attr("transform", `translate(${width + 65}, ${height + margin.top + -218})`)
            .classed("Colorado-text text", true)
            .text("Colorado");

            chartGroup.append("text")
            .attr("transform", `translate(${width + 56}, ${height + margin.top + -197})`)
              .classed("Denver-text text", true)
              .text("Denver");

            chartGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 12))
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Colorado, Denver and US Unemployment Rates");
});







 