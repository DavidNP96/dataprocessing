var height = 200
var width = 700
var barPadding = 5;

d3.select("body")
  .append("h")
  .style("font-size", "20px")
  .style("text-decoration", "underline")
  .text("Amount renewable energy per Kilotonne of Oil Equivalent (KOTE) per country");
d3.select("body").append("p").text("name: David Pantphlet");
d3.select("body").append("p").text("student number: 12466638");

var svg = d3.select("body")
          .append("svg")
          .attr("height", height)
          .attr("width", width);


var values = []

d3.json("data.json").then(function(data){
  var countries = Object.keys(data)

  for (var i = 0; i < countries.length; i++){
    values.push(data[countries[i]]["Value"])
  }

  var tooltip = d3.select("body").append("div")
				.style('position','absolute')
				.style('background','#f4f4f4')
				.style('padding','5 15px')
				.style('border','1px #333 solid')
				.style('border-radius','5px')
				.style('opacity','0')

  // Drawing rects
  var rects = svg.selectAll("rect")
                 .data(values)
                 .enter()
                 .append("rect")
                 .attr("width", width / values.length - barPadding)
                 .attr("x", function(d, i) {
                    return 50 + i * ((width - 100) / values.length);
                  })
                 .attr("height", height)
                 .attr("y", function(d) {
                      return height - Math.log(d) * 10; //Height minus data value
                  })
                 .attr("fill", function(d, i) {
                    return "rgb(0, 0, " + ((d / 1000) * 10) + ")";
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
        			   })

      roundValues = []
      for (var i = 0; i< values.length; i++){
        roundValues.push(Math.round(values[i]))
      }
      values = roundValues

    svg.selectAll("text")
      .data(countries)
      .enter()
      .append("text")
      .style("font-size", "10px")
      // .attr("transform", "rotate(-90)")
      .text(function(d) {
        return d;
      })
      .attr("x", function(d, i) {
        return 50 + i * ((width - 115) / countries.length);
      })
      .attr("y", function(d) {
       return height - (d * 4);
      })


});
