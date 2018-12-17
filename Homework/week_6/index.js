d3.select("body")
  .append("h")
  .style("font-size", "20px")
  .style("text-decoration", "underline")
  .style("font-family", "arial")
  .text("Meat consumption per country");
d3.select("body").append("p").attr("class", "text").text("name: David Pantphlet");
d3.select("body").append("p").attr("class", "text").text("student number: 12466638");
d3.select("body").append("p").append("a").attr("href", "https://data.oecd.org/agroutput/meat-consumption.htm").text("data source: oecd");


// create global garph dimension
dimGraph = {
  w : 1000,
  h : 400,
  topMargin : 0,
  bottomMargin : 50,
  leftMargin : 50,
  rightMargin : 200
}

total = [];

// read in data
d3.json("data.json").then(function(data){
  var countries = Object.keys(data)

  // get total meatconsumption per country
  for (var i = 0; i < countries.length; i++) {
    countryTotal = data[countries[i]].BEEF +  data[countries[i]].PIG + data[countries[i]].POULTRY + data[countries[i]].SHEEP;
    total.push(countryTotal);
  }
  createSVG(dimGraph.w, dimGraph.h);
  createBarchart(total, countries);
  labels()

  // updates piechart when clicked on barchart
  d3.selectAll(".rect")
    .on("click", function() {
      var index = this.getAttribute("value");
      pieData = Object.values(data)[index]
      createPie(pieData)
      svg = d3.select("#svg2");
      svg.select(".countryCode").remove()

      svg.append("text")
      .attr("class","countryCode")
      .data(countries)
      .attr("x", 500)
      .attr("y", 100)
      .attr("font-family", "arial")
      .text("country code: " + countries[index])
    })
});

function createSVG(w,h) {

  //Create SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("id", "svg")
              .attr("width", w)
              .attr("height", h)
  return svg;

}

function createBarchart(data, countries) {
  svg = d3.selectAll("#svg");


  // create xscale
  var xScale =  d3.scaleBand()
              .domain(countries)
              .range([dimGraph.leftMargin , dimGraph.w - dimGraph.rightMargin]);


  // create yscale
  var yScale =  d3.scaleLinear()
                .domain([d3.max(data), 0])
                .range([dimGraph.bottomMargin, dimGraph.h - dimGraph.topMargin]);

// create tooltip
  var tooltip = d3.select("body").append("div")
				.style('position','absolute')
				.style('background','#f4f4f4')
				.style('padding','5 15px')
				.style('border','1px #333 solid')
				.style('border-radius','5px')
				.style('opacity','0')

  // create bars of barchart
  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("class", "rect")
     .attr("value", function(d, i){return i})
     .attr("x", function(d, i) {
       return xScale(countries[i]);
      })
      .attr("y", function(d) {
        return yScale(d) - 50;
      })
     .attr("width", (dimGraph.w + dimGraph.leftMargin - dimGraph.rightMargin) / (data.length + 10))
     .attr("height", function(d) {
       return (dimGraph.h - dimGraph.topMargin) - yScale(d)
     })
     .attr("fill", function(d) {
      return "rgb( " + (d * 3) +", 0,0 )";
     })
     .on('mouseover', function(d){
    tooltip.transition()
      .style('opacity', 1)

  tooltip.html(d)
    .style('left', (d3.event.pageX)+ 'px')
    .style('top', (d3.event.pageY+ 'px'))

  d3.select(this).style('opacity', 0.5)
  })
   .on('mouseout', function(d){
    tooltip.transition()
      .style('opacity', 0)
    d3.select(this).style('opacity', 1)
  });

  // create xaxis
  var xAxis = d3.axisBottom(xScale)

  // create yaxis
  var yAxis = d3.axisLeft(yScale)

 // draw x as
  svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + (dimGraph.h - dimGraph.bottomMargin) + ")")
     .call(xAxis);

// draw y as
   svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + dimGraph.leftMargin + ", -50)")
    .call(yAxis);
}

function labels() {

  svg = d3.selectAll("#svg")

  // yaxis label
  svg.append("text")
  .attr("x", -300)
  .attr("y", 14)
  .attr("transform", "rotate(-90)")
  .attr("font-family", "sans-serif")
  .text("meat consumption (kg/capita)")

  // crate xaxis label
  svg.append("text")
  .attr("x", 300)
  .attr("y", 390)
  .attr("font-family", "sans-serif")
  .text("Countries")

  // create title
  svg.append("text")
  .attr("x", 250)
  .attr("y", 20)
  .attr("font-family", "sans-serif")
  .style("font-size", "20px")
  .text("meat consumption (kg/capita) per country")
}

  function createSVG2(w,h) {

    //Create SVG element
    var svg = d3.select("body")
                .append("svg")
                .attr("id", "svg2")
                .attr("width", w)
                .attr("height", h + 100)
    return svg;
}

function createPie(data){

    // clean svg
    d3.selectAll("#svg2").remove()

    // initiate new svg
    createSVG2(dimGraph.w ,dimGraph.h)

    // determine colors
    svg = d3.selectAll("#svg2")
    var colors = d3.scaleOrdinal(d3.schemeSet1);

    // transform data suitable for piechart
    values = []
    values = Object.values(data)
    animals = Object.keys(data)
    var angles = d3.pie().sort(null)(values);

    // create each segment of piechart
    var segments = d3.arc()
                     .innerRadius(0)
                     .outerRadius(200)
                     .padAngle(.05)
                     .padRadius(50);

    //  deteremine section for eacht part element
    var sections = svg.append("g")
                      .attr("class", "pie")
                      .attr("transform", "translate(250, 250)")
                      .selectAll("path").data(angles);

      //  give color to eacht section of piechart
      sections.enter().append("path")
              .attr("d", segments)
              .attr("fill", function(d){
        return colors(d.value);
        });


    var content = svg.select("g")
                    .selectAll("text")
                    .data(angles);
    // write values in eacht section of piechart
    content.enter().append("text")
          .classed("inside", true)
          .each(function(d){
                var center = segments.centroid(d);
                d3.select(this).attr("x",center[0]).attr("y", center[1])
                .text(Math.round(d.value))
            })

    // create legend
    var legends = svg.append("g")
                    .attr("transform", "translate(500, 300)")
                    .selectAll(".legend")
                    .data(angles);

    // create eacht bar of legend
    var legend = legends.enter()
                        .append("g")
                        .classed("legend", true)
                        .attr("transform", function(d, i){return "translate(0," + (i + 1) * 30 + ")";
                        });
    //  give right color to eacht legend
    legend.append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", function(d){
                return colors(d.value);
                });
    // append text to leend
    legend.append("text")
          .classed("label", true)
          .text(function(d, i){return animals[i]})
          .attr("x", 20)
          .attr("y", 12)

    // create title for piechart
    svg.append("text")
      .attr("x", 250)
      .attr("y", 20)
      .attr("font-family", "arial")
      .style("font-size", "20px")
      .text("meatconsumption of country per animal")
}
