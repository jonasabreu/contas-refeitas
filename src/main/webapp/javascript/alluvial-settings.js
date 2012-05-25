function drawAlluvial(json) {

	$("#slider").slider( "option", "max", json.maxChilds);
	
	var data = createAlluvialData(json);

	var nodeMap = createNodeMap(data);

	attachLinksToNodes(data, nodeMap);

	data = sortByValueAndCalculateOffsets(data);

	// calculate maxes
	var maxn = d3.max(data, function(t) { return t.length });
	var maxv = d3.max(data, function(t) { 
		return d3.sum(t, function(n) { 
			return n.nodeValue;
		});
	});

	/* Make Vis */

	// settings and scales
	var w = 1000,
	    h = 500,
	    padding = 15,
	    gapratio = .7,
	    delay = 1500,
	    x = d3.scale.ordinal()
	        .domain(d3.range(data.length))
	        .rangeBands([0, w + (w/(data.length-1))], gapratio),
	    y = d3.scale.linear()
	        .domain([0, maxv])
	        .range([0, h - padding * maxn]),
	    line = d3.svg.line()
	        .interpolate('basis');

	// root
	var vis = d3.select("#svg")
	  .append("svg:svg")
	    .attr("width", w)
	    .attr("height", h + 110 + (json.childs.length) * (padding + 18));

	var t = 0;

	t = update(true, data, t, vis, x, y, delay, padding, nodeMap, line);
	updateNext(t, data, vis, x, y, delay, padding, nodeMap, line);
}