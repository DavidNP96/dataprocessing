/*
Name: David Pantophlet
Student Number: 12466638
This script visualizes consumerconfidence rates from several european countries
by means of a scatterplot
*/

var w = 700;
var h = 400;

window.onload = function() {

  d3.select("body")
    .append("h")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("consumer confidence per country");
  d3.select("body").append("p").text("name: David Pantphlet");
  d3.select("body").append("p").text("student number: 12466638");


  var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
  var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"

  var requests = [d3.json(womenInScience), d3.json(consConf)];

  Promise.all(requests).then(function(response) {

      var svg = createSVG(w,h)

      // makes json user friendly
      var wis = transformResponse(response[0]);
      var cConf = transformResponse(response[1]);

      // combines the two datasets to one usable dataset
      dataset = combine(cConf, wis)

      // create legend and labels
      createlegend(dataset)
      labels()

      // create initial list usable to plot scatter
      var plotList = selectYear("2007",dataset);

      // create initial scatter of 2007
      createScatter(plotList);

      // update scatter with selected year of dropdown menue
      d3.selectAll(".m")
        .on("click", function() {
          var year = this.getAttribute("value");
          updateScatter(year);
        })

  }).catch(function(e){
      throw(e);
  });
};

function transformResponse(data){
    t = data
    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                tempObj["country"] = t.structure.dimensions.series[1].values[Number(string.slice(-1))].name;
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}

function createSVG(w,h) {

  //Create SVG element
  var svg = d3.select("body")
              .append("svg")
              .attr("id", "svg")
              .attr("width", w)
              .attr("height", h);
  return svg;
}


function combine(dataset1, dataset2){
  // dataset = []
  // datapoint = []

  dict = {}

  // takes datapoint from one data set and combines it with another of the same year
  for (var i = 0; i < dataset1.length; i++) {
    for (var j = 0; j < dataset2.length; j++){
      if (dataset1[i]["Country"] == dataset2[j]["country"] && dataset1[i]["time"] == dataset2[j]["time"]){
        if (dict[dataset1[i]["time"]] == undefined){
          dict[dataset1[i]["time"]] = [];
        }
      // put data in desired dict format
      dict[dataset1[i]["time"]].push([dataset1[i]["Country"], dataset1[i]["datapoint"], dataset2[j]["datapoint"]]);
      }
    }
  }
    return dict;
}

function selectYear(year,data){
  datapoints = [];
  plotList = [];

  // gets list of desired datapoint from a selected year
  for (i = 0; i < data[year].length; i++){
      datapoints.push(data[year][i][2]);
      datapoints.push(data[year][i][1]);
      plotList.push(datapoints);
      datapoints = [];
  }
return plotList;
}

function labels() {

  svg = d3.selectAll("#svg")

  svg.append("text")
  .attr("x", -250)
  .attr("y", 20)
  .attr("transform", "rotate(-90)")
  .text("consumer confidence (index)")


  svg.append("text")
  .attr("x", 320 )
  .attr("y", 15 - h)
  .text("Womens in science compared to consumer confidence per country")

}

function createlegend(data) {
  data = data[2007]
  countries = d3.set(data.map(function(d ,i){
  return d[0]})
).values()

console.log(countries);

color = d3.scaleOrdinal(d3.schemeCategory10)

  let svg = d3.selectAll("#svg")

  // create legend elements
  var legend = svg.selectAll(".legend")
                  .data(countries)
                  .enter().append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d, i) {return "translate(10," + (i + 7) * 20 + ")";});

// create colored rectangles
  legend.append("rect")
        .attr("x", w - 120)
        .attr("y", -120)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d, i){
        return color(i)});

// append text to rectangles
  legend.append("text")
        .attr("x", w - 100)
        .attr("y", -110)
        // .attr("dy", ".35em")
        .style("text-anchor", "left")
        .text(function(d){return d;})
  }

function updateScatter(year) {

  //removes old dots ands axis
  d3.selectAll("#dots").remove()
  d3.selectAll(".axis").remove()

  // create new scatter
  plotList = selectYear(year,dataset);
  // console.log(plotList)
  createScatter(plotList);
}

function createScatter(data) {

  var padding = 50;

  let svg = d3.selectAll("#svg")

  // create x scale
  var xScale = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return d[0] - 1; }), d3.max(data, function(d) { return d[0]; }) + 1])
              .range([padding + 10 , w - padding]);

  // create yscale
  var yScale =  d3.scaleLinear()
                .domain([d3.max(data, function(d) { return d[1]; }) + 1, d3.min(data, function(d) { return d[1] - 1; })])
                .range([padding, h - padding]);

  // draw scatter dots
  circles =  svg.selectAll("circle")
             .data(data)
             .enter()
             .append("circle")
             .attr("id", "dots")
             .attr("cx", function(d) {
              return xScale(d[0]);
             })
             .attr("cy", function(d) {
                  return yScale(d[1]);
             })
             .attr("r", 5)
             .attr("fill", function(d, i){
               return color(i)
             });

   var xAxis = d3.axisBottom()
               .scale(xScale);

   var yAxis = d3.axisLeft()
              .scale(yScale);

  // draw x as
   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding + 5) + ")")
      .call(xAxis);

// draw y as
    svg.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(" + (padding + 10) + ",0)")
     .call(yAxis);
}
