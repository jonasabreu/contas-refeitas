var createAlluvialData = (function(json) {
  var times = [];
  var allLinks = [];
  var counter = 0;
	addRoot = function() {
		console.log("total: " + json.value);
	  var nodes = d3.range(0, 1).map(function(n) {
	    return {
	        id: counter++,
	        nodeName: json.label,
	        nodeValue: json.value,
	        incoming: [],
					formattedValue: json.formattedValue
	    }
	  });
	  times.push(nodes);
	  return nodes;
  },
	addFirstIteration = function() {
		var childs = json.childs;
	  var until = childs.length == 1 ? 1 : childs.length;
    var nodes = d3.range(0,  until).map(function(n) {
			console.log(n + ") value: " + childs[n].value);
      return {
        id: counter++,
        nodeName: childs[n].label,
        nodeValue: childs[n].value,
        incoming: [],
				formattedValue: childs[n].formattedValue
      };
   	});
		console.log("childs.length: " + childs.length);
		console.log("until: " + until);
		console.log("nodes: " + nodes.length);
	  times.push(nodes);
	  console.log("times: " + times[times.length-1].length);
	  return nodes;
	},
	addNext = function() {
		var current = times[times.length-1];
		var nextt = addFirstIteration();
		console.log("4: " + times[times.length-1].length);
		// make links
		current.forEach(function(n) {
		  for (var x = 0; x < nextt.length; x++) {
				var target = nextt[x];
	      var link = {
	          source: n.id,
	          target: target.id,
	          value: target.nodeValue
	      };
	      allLinks.push(link);
		  }
		});
    // prune next
		console.log("5: " + times[times.length-1].length);
    times[times.length-1] = nextt.filter(function(n) { return n.nodeValue });
		console.log("6: " + times[times.length-1].length);
	}
	
	// initial set
	addRoot();
	
	// now add rest
	for (var t=0; t < 1; t++) {
	    addNext();
	}

	return {
	    times: times,
	    links: allLinks
	};
	
});
