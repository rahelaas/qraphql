import * as d3 from 'd3';



export function createGraphs(name, dataArray) {
    d3.select(`${name}`).selectAll("*").remove();
    let margin = {top: 20, right: 30, bottom: 20, left: 40},
        width = 500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,
        data = dataArray;


    let svg = d3.select(`${name}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left+25}, ${margin.top})`)
        .style('background-color', 'black');

// Add X axis --> it is a date format
    let x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.createdAt; }))
        .range([ 0, width ])

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(d3.timeMonth.every(2)));
// Add Y axis
if (name === "#level-chart") {
    let y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.amount; }))
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));


    //add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.createdAt) })
            .y(function(d) { return y(d.amount) })
        )


// create a tooltip
    let Tooltip = d3.select("#level-chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#282828")
        .style("color", "darkgray")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "1px")
        .style("border-color", "hsla(160, 100%, 37%, 1)")
        .style("padding", "6px")
        .style("width", "fit-content")
        .style("height", "85px")

    // Three function that change the tooltip when user hover / move / leave a cell
    let mouseover = function(d) {
        Tooltip
            .style("opacity", 1)

    }
    let mousemove = function(event, d) {
        const formattedDate = d.createdAt.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        Tooltip
            .html("Level " + d.amount + "<br>" + "Project: " + d.object.name + "<br>" + "Completed: " + formattedDate)
            .style("left", (event.clientX - (event.clientX/1.4)) + "px")
    }
    let mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
    }

    // Add the points
    svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(d.createdAt) } )
        .attr("cy", function(d) { return y(d.amount) } )
        .attr("r", 4)
        .attr("fill", "#282828")
        .attr("stroke-width", 3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)



} else if (name === "#xp-chart") {
    // Add Y axis
    let y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.xpSum; }))
        .range([ height, 0 ]);
    svg.append("g")
        .call(d3.axisLeft(y));


    //add the line
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            //.curve(d3.curveBasis) // Just add that to have a curve instead of segments
            .x(function(d) { return x(d.createdAt) })
            .y(function(d) { return y(d.xpSum) })
        )

// create a tooltip
    let Tooltip = d3.select("#xp-chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "#282828")
        .style("color", "darkgray")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "1px")
        .style("border-color", "hsla(160, 100%, 37%, 1)")
        .style("padding", "5px")
        .style("width", "fit-content")
        .style("height", "85px")

    // Three function that change the tooltip when user hover / move / leave a cell
    let mouseover = function(d) {
        Tooltip
            .style("opacity", 1)

    }
    let mousemove = function(event, d) {

        const formattedDate = d.createdAt.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

        Tooltip
            .html(d.name + "<br>" + "XP points: " + (d.amount/1000).toFixed(1) + " kB" + "<br>" + "Completed: " + formattedDate)
            .style("left", (event.clientX - (event.clientX/1.4)) + "px")
    }
    let mouseleave = function(d) {
        Tooltip
            .style("opacity", 0)
    }


    // Add the points
    svg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(d.createdAt) } )
        .attr("cy", function(d) { return y(d.xpSum) } )
        .attr("r", 4)
        .attr("fill", "#282828")
        .attr("stroke-width", 2)
        // .attr("fill", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    }

}