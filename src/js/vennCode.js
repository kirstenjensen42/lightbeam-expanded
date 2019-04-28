
const vennCode = {
// define sets and set set intersections

    async init(nodes, links) {

        this.links = links;
        this.nodes = nodes;
        if (nodes.length == 0) {
            console.log("Nothing to report");
            return;
        }

        var tempListAsStringToList = new Map([]);
        var tempListAsStringToCount = new Map([]);

        for (const node of nodes) {
            if (node.firstParty) {
            var hostname = node.hostname.replace('www.','').replace('.com','').replace('.org','');
            tempListAsStringToList.set(hostname, [hostname]);
            tempListAsStringToCount.set(hostname, 2);
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
            } else {
                tempListAsStringToCount.set(tempList, tempListAsStringToCount.get(tempList) + 1);
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
            .style("fill-opacity", .7);
            
    },

    draw(nodes, links) {
        this.remove();
        this.init(nodes,links);

    },

    remove() {
        d3.select("#venn_div").remove();
    }

    
}