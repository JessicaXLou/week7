'use strict';

(function() {

  window.onload = function() {

    let width = 500;
    let height = 500;
    let svgContainer = d3.select("body")
      .append("svg")
      .attr("height", height)
      .attr("width", width);
    let g = svgContainer.append("g");

    d3.json("json/neighborhoods.json")
      .then((neighborhoods) => {
        let projection = d3.geoAlbers()
          .scale(140000)
          .rotate([71.057, 0])
          .center([0, 42.313])
          .translate([250, 250]);
        let geopath = d3.geoPath()
          .projection(projection);
        
        g.selectAll("path")
          .data(neighborhoods.features)
          .enter()
          .append("path")
          .attr("fill", "gray")
          .attr("stroke", "white")
          .attr("d", geopath);

        d3.json("json/points.json")
          .then((points) => {
            g.selectAll("circle")
              .data(points.features)
              .enter()
              .append("path")
              .attr("r", 3)
              .attr("class", "coord")
              .attr("fill", "black")
              .attr("d", geopath);

            let string = [];
            for (let i = 1; i < points.features.length; i++) {
                let x = projection(points.features[i - 1].geometry.coordinates);
                let y = projection(points.features[i].geometry.coordinates);
                string.push({
                    type: "LineString",
                    coordinates: [[x[0], x[1]], [y[0], y[1]]]
                });
            }
            
            let path = svgContainer.append("g");
            path.selectAll("line")
              .data(string)
              .enter()
              .append("line")
              .attr("id", (temp, num) => {
                return "line" + num;
              })
              .attr("stroke", "white")
              .attr("x1", point=>point.coordinates[0][0])
              .attr("x2", point=>point.coordinates[1][0])
              .attr("y1", point=>point.coordinates[0][1])
              .attr("y2", point=>point.coordinates[1][1]);
            path.selectAll("line")
              .style("opacity", 0);
            d3.selectAll("line")
              .style("opacity", "1");
            d3.selectAll("line")
              .each((temp, num) => {
                let length = d3.select("#line" + num)
                  .node()
                  .getTotalLength();
                d3.select("#line" + num)
                  .attr("stroke-dashoffset", length)
                  .attr("stroke-dasharray", length + " " + length)
                  .transition()
                  .duration(750)
                  .delay(750 * num)
                  .ease(d3.easeLinear)
                  .style("stroke-width", 5)
                  .attr("stroke-dashoffset", 0);
              });
            });
      });
  }
})();