/*
  Builds and controls the matrix view
*/
const matrix = {

    async init(nodes, links) {
        // services.processServices();
        services.setThingsUp();

        this.nodes = nodes;
        this.links = links;

        const element = document.getElementById("visualization");
        const { width, height } = element.getBoundingClientRect();
        var div = document.createElement('div');
        div.setAttribute('id', 'matrix');
        console.log(height);
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

        var tableColumns = [{'title':'', 'field': 'url', sorter:"string"}].concat(primarySites).concat([{'title':'Total Links', 'field': 'totalLinks', sorter:"number"}]).concat({'title':'Category', 'field': 'category', sorter:"string"}).concat({'title':'Name', 'field': 'name', sorter:"string"});

        var table = new Tabulator("#matrix", {
            layout:"fitData",
            height:height,
            columns:tableColumns,
        });



        var data = [];
        targetSources.forEach(function(value, key) {
            var nameString = key.replace('www.','');
            var identified = services.getService(nameString);
            var category = '';
            var name = '';
            if (identified == undefined) {
                while (identified == undefined && nameString.length > 0) {
                    var iDot = nameString.indexOf('.');
                    if (iDot < 0) { break; }
                    nameString = nameString.substring(iDot+1,nameString.length);
                    identified = services.getService(nameString);
                }

            }
            if (identified != undefined) {
                category = identified.category;
                name = identified.name;
                if (category == 'Disconnect'){
                    if (identified.name == 'Google') {
                        var getFromGoogleObject = services.getGoogleService(nameString);
                        if (getFromGoogleObject != undefined) {
                            identified = getFromGoogleObject;
                            category = identified.category;
                        } else {
                            category = 'Social';
                        }
                    } else {
                        category = 'Social';
                    }
                }
            }
            var text = '{"url":"'+ key + '",' + value + ',"totalLinks":'+value.length+',"category":"'+ category + '","name":"'+ name + '"}';
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