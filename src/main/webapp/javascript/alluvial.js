window.used_fix_offset = 0;
function update(first, data, t, vis, x, y, delay, padding, nodeMap, line) {
    // update data
    var currentData = data.slice(0, ++t);

    // time slots
    var times = vis.selectAll('g.time')
        .data(currentData)
      .enter().append('svg:g')
        .attr('class', 'time')
        .attr("transform", function(d, i) { return "translate(" + (x(i) - x(0)) + ",0)" });

    // node bars
    var nodes = times.selectAll('g.node')
        .data(function(d) { return d })
      .enter().append('svg:g')
        .attr('class', 'node');
		
		var offsets = 0;
		var offsetMap = {};
		nodes.each(function(n) {
			var height = y(n.nodeValue);
			offsetMap[n.id] = 0;
			if (height < 18) {
				offsetMap[n.id] = offsets++;
			}
			console.log("OffsetMap: " + n.id + ":" + offsets);
		});
		
    setTimeout(function() {
        nodes.append('svg:rect')
            .attr('fill', '#333333')
            .attr('y', function(n, i) {
								console.log("offset => " + offsetMap[n.id]);
                return y(n.offsetValue) + (i * padding) + (padding * offsetMap[n.id]);
            })
            .attr('width', x.rangeBand())
            .attr('height', function(n) { 
							var height = y(n.nodeValue);
							if (height < 18) return 18;
							return height;
						})
						.attr('data-id', function(n) { return n.id })
            .attr('data-description', function(n) { return n.nodeName })
          .append('svg:title')
            .text(function(n) { return n.nodeName });
				nodes.append('svg:text')
					.attr('fill', '#FFFFFF')
          .attr('y', function(n, i) {
            var y_text = y(n.offsetValue) + (i * padding) + (padding * offsetMap[n.id]);
						var height = y(n.nodeValue);
						if (height <= 18) return y_text + 13;
						return y_text + height / 2 + 6;	
          })
					.attr('x', function(n) {
						var size = n.formattedValue.length;
						//if (size == 13) return x.rangeBand() / 4
						//else 
						return (x.rangeBand() / 2) - ((size * 7.5	) / 2)
					})
					.text(function(n) {
						return n.formattedValue;
					});
    }, (first ? 0 : delay));

    var linkLine = function(start) {
				var fixed_offset = 0;
        return function(l) {
            var source = nodeMap[l.source];
            var target = nodeMap[l.target];
            var gapWidth = x(0);
            var bandWidth = x.rangeBand() + gapWidth;
            var startx = x.rangeBand() - bandWidth;
            
						var sourcey = y(source.offsetValue) + 
                 source.order * padding +
                 y(l.outOffset) +
                 y(l.value)/2;
						if (target.h)
						
						console.log("spline offset => " + offsetMap[target.id]);

            var targety = y(target.offsetValue) + 
                 target.order * padding + 
                 y(l.inOffset) +
                 y(l.value)/2 + (padding * offsetMap[target.id]);
            var points = start ? 
                    [
                        [ startx, sourcey ], [ startx, sourcey ], 
												[ startx, sourcey ], [ startx, sourcey ] 
                    ] :
                    [
                        [ startx, sourcey ],
                        [ startx + gapWidth/2, sourcey ],
                        [ startx + gapWidth/2, targety ],
                        [ 0, targety ]
                    ];
            return line(points);
        }
    }

    // links
    var links = nodes.selectAll('path.link')
        .data(function(n) { return n.incoming || [] })
      .enter().append('svg:path')
        .attr('class', 'link')
        .style('stroke-width', function(l) { return y(l.value) })
        .attr('d', linkLine(true))
        .on('mouseover', function() {
            d3.select(this).attr('class', 'link on')
        })
        .on('mouseout', function() {
            d3.select(this).attr('class', 'link')
        })
      .transition()
        .duration(delay)
        .attr('d', linkLine());
		return t;
}

function updateNext(t, data, vis, x, y, delay, padding, nodeMap, line) {
    if (t < data.length) {
        update(undefined, data, t, vis, x, y, delay, padding, nodeMap, line);
        window.setTimeout(function() {
					updateNext(t, data, vis, x, y, delay, padding, nodeMap, line);
				}, delay);
    }
}
