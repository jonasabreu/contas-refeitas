var createAlluvialData = (function(json) {
  var times = [];
  var allLinks = [];
  var counter = 0;
	addRoot = function() {
	  var nodes = d3.range(0, 1).map(function(n) {
	    return {
	        id: counter++,
	        nodeName: "Node " + n,
	        nodeValue: total,
	        incoming: []
	    }
	  });
	  times.push(nodes);
	  return nodes;
  },
	addFirstIteration = function() {
    var nodes = d3.range(0, json.length - 1).map(function(n) {
		var list = json[n][1];
       return {
         id: counter++,
         nodeName: n,
         nodeValue: list[0],
         incoming: []
       };
   	});
	  times.push(nodes);
	  return nodes;
	},
	addNext = function() {
		var current = times[times.length-1];
		var nextt = addFirstIteration();
		// make links
		current.forEach(function(n) {
		  var links = {};
		  for (var x = 0; x < nextt.length; x++) {
				var target = nextt[x];
	      var link = {
	          source: n.id,
	          target: target.id,
	          value: target.nodeValue
	      };
	      links[target.id] = link;
	      allLinks.push(link);
		  }
		});
    // prune next
    times[times.length-1] = nextt.filter(function(n) { return n.nodeValue });
	}
	
	// initial set
	addRoot()
	
	// now add rest
	for (var t=0; t < 1; t++) {
	    addNext();
	}

	return {
	    times: times,
	    links: allLinks
	};
	
});
