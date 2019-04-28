
const matrix = {

    async init(nodes, links) {
        this.nodes = nodes;
        this.links = links;

        const element = document.getElementById("visualization");
        const { width, height } = element.getBoundingClientRect();
        var div = document.createElement('div');
        div.setAttribute('id', 'matrix');
        div.setAttribute('style', 'width:95%; margin: 0 auto');
        element.appendChild(div);

        var primarySites = [];
        var columnIndexes = new Map([]);
        var targetSources = new Map([]);
        var i = 0;
        for (node of nodes) {
            if (node.firstParty) {
                primarySites.push({'title':node.hostname, 'field':i.toString(), headerVertical:true});
                columnIndexes.set(node.hostname, i.toString());
                i = i+1;
            } else {
                targetSources.set(node.hostname, []);
            }
        }

        for (const link of links) {
            targetSources.get(link.target).push('"'+ columnIndexes.get(link.source) +'":"👀"');
        }

        var tableColumns = [{'title':'', 'field': 'name', sorter:"string"}].concat(primarySites).concat([{'title':'Total Links', 'field': 'totalLinks', sorter:"number"}])

        var table = new Tabulator("#matrix", {
            layout:"fitData",
            height:height,
            columns:tableColumns,
        });



        var data = [];
        targetSources.forEach(function(value, key) {
            var text = '{"name":"'+ key + '",' + value + ',"totalLinks":'+value.length+'}';
            data.push(JSON.parse(text));
        });

        table.setData(data);

        // table.updateOrAddData(data);
    },
    
    draw(nodes, links) {
        this.remove();
        this.init(nodes,links);

    },

    remove () {
        document.getElementById("matrix").remove();

    }

}