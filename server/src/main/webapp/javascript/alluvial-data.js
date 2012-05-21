var createAlluvialData = (function() {
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
		var keys = [];
		for (var key in json)
			keys.push(key);
		    var nodes = d3.range(0, keys.length).map(function(n) {
				var key = keys[n];
				var value = json[key];
	        return {
	          id: counter++,
	          nodeName: "Node " + n,
	          nodeValue: value,
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
		  for (var x = 0; x < nextt.length - 1; x++) {
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
