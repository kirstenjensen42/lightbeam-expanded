
const vennCode = {
// define sets and set set intersections

    async init(nodes, links) {

        this.links = links;
        this.nodes = nodes;

        var tempListAsStringToList = new Map([]);
        var tempListAsStringToCount = new Map([]);
        var tempStringToListOfTargets = new Map([]);


        for (const node of nodes) {
            if (node.firstParty) {
            var hostname = node.hostname.replace('www.','').replace('.com','').replace('.org','');
            tempListAsStringToList.set(hostname, [hostname]);
            tempListAsStringToCount.set(hostname, 2);
            tempStringToListOfTargets.set(hostname, []);
            }
        }

        var targetsToListOfSources = new Map([]);
        var sourceToTotalLinkCount = new Map([]);

        for (const link of this.links) {


            var sourceShortened = link.source.replace('www.','').replace('.com','').replace('.org','')

            if (!targetsToListOfSources.has(link.target)) {
                targetsToListOfSources.set(link.target, [sourceShortened])
            } else {
                var updateList = targetsToListOfSources.get(link.target);
                updateList.push(sourceShortened);
                updateList.sort();
            }

            if(!sourceToTotalLinkCount.has(sourceShortened)){
                sourceToTotalLinkCount.set(sourceShortened, 1)
            } else {
                sourceToTotalLinkCount.set(sourceShortened, sourceToTotalLinkCount.get(sourceShortened) + 1);
            }
        }

        targetsToListOfSources.forEach(function(value, key) {
            var tempList = '';
            for (v of value) {
                tempList +=v;
            }
            if (!tempListAsStringToList.has(tempList)) {
                tempListAsStringToList.set(tempList, value);
                tempListAsStringToCount.set(tempList, 1);
                tempStringToListOfTargets.set(tempList, [key]);
            } else {
                tempListAsStringToCount.set(tempList, tempListAsStringToCount.get(tempList) + 1);
                tempStringToListOfTargets.get(tempList).push(key);
            }
        });

        sets = [];
        tempListAsStringToList.forEach(function(value, key) {
            console.log(key + ':' + tempListAsStringToCount.get(key));
            var realCount = tempListAsStringToCount.get(key)
            var circleSize = realCount;
            if (value.length == 1) {
                var myLabel = value[0] + ":         " + sourceToTotalLinkCount.get(value[0]);
                sets.push({sets: value, size: circleSize, label: myLabel, keyToSetMap: key});
            } else {
                myLabel = realCount.toString();
                sets.push({sets: value, size: circleSize, label: myLabel});
            }
            
        });

        
        const element = document.getElementById("visualization");
        const { width, height } = element.getBoundingClientRect();
    

        var chart = venn.VennDiagram()
                            .width(width)
                            .height(height)
                            .normalize(false);
        g = document.createElement('div');
        g.setAttribute("id", "venn_div");
        document.getElementById("visualization").appendChild(g);

        var div = d3.select("#venn_div")
        div.datum(sets).call(chart)

        d3.selectAll("#venn_div .venn-circle path")
            .style("fill-opacity", .9);
            
            // add a tooltip
            var tooltip = d3.select("#visualization").append("div")
                .attr("class", "venntooltip")
                .attr("id", "myVennToolTip");
            
            div.selectAll("path")
            .style("stroke-opacity", 0)
            .style("stroke", "#fff")
            .style("stroke-width", 3)
            
            div.selectAll("g")
                .on("mouseover", function(d, i) {
                    // sort all the areas relative to the current item
                    venn.sortAreas(div, d);
            
                    // Display a tooltip with the current size
                    tooltip.transition().duration(400).style("opacity", .9);
                    var displayText = "<ul>";
                    for (li of tempStringToListOfTargets.get(d.keyToSetMap)) {
                        displayText= displayText + "<li>" + li + "</li>";
                    }
                    displayText= displayText + "</ul>";
                    document.getElementById('myVennToolTip').innerHTML = displayText;
                    

                    // highlight the current path
                    var selection = d3.select(this).transition("tooltip").duration(400);
                    selection.select("path")
                        .style("fill-opacity", d.sets.length == 1 ? .9 : .1)
                        .style("stroke-opacity", 1);
                })
            
                .on("mousemove", function() {
                    tooltip.style("left", (d3.event.pageX - 120) + "px")
                           .style("top", (d3.event.pageY - 150) + "px");
                })
            
                .on("mouseout", function(d, i) {
                    tooltip.transition().duration(400).style("opacity", 0);
                    var selection = d3.select(this).transition("tooltip").duration(400);
                    selection.select("path")
                        .style("fill-opacity", d.sets.length == 1 ? .7 : .0)
                        .style("stroke-opacity", 0);
                });
    },

    draw(nodes, links) {
        this.remove();
        this.init(nodes,links);

    },

    remove() {
        d3.select("#venn_div").remove();
    }

    
}