
const table = {

    async init() {
        var svg = d3.select("visualiztion")  
                .append("svg")
                .attr("width", 1000)
                .attr("height", 500);
        
        var width = d3.scaleQuantize()
                .domain([10, 100])
                .range(["hello", "world"]);
    }
    


}