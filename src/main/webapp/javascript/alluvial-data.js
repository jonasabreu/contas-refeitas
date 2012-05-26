var createAlluvialData = (function(json) {
  var times = [];
  var allLinks = [];
  var counter = 0;
	addRoot = function() {
	  var nodes = d3.range(0, 1).map(function(n) {
	    return {
	        id: counter++,
	        nodeName: json.label,
	        nodeValue: json.value,
	        incoming: [],
					formattedValue: json.formattedValue,
					parentPercent: json.rootPercent,
					totalPercent: json.percent
	    }
	  });
	  times.push(nodes);
	  return nodes;
  },
	addFirstIteration = function() {
		var childs = json.childs;
	  var until = childs.length == 1 ? 1 : childs.length;
    var nodes = d3.range(0,  until).map(function(n) {
      return {
        id: counter++,
        nodeName: childs[n].label,
        nodeValue: childs[n].value,
        incoming: [],
				formattedValue: childs[n].formattedValue,
				parentPercent: childs[n].rootPercent,
				totalPercent: childs[n].percent
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
    times[times.length-1] = nextt.filter(function(n) { return n.nodeValue });
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
