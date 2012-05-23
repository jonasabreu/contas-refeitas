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

    setTimeout(function() {
        nodes.append('svg:rect')
            .attr('fill', '#333333')
            .attr('y', function(n, i) {
                return y(n.offsetValue) + i * padding;
            })
            .attr('width', x.rangeBand())
            .attr('height', function(n) { return y(n.nodeValue) })
						.attr('data-id', function(n) { return n.id })
          .append('svg:title')
            .text(function(n) { return n.nodeName });
				nodes.append('svg:text')
					.attr('fill', '#FFFFFF')
          .attr('y', function(n, i) {
              return (y(n.offsetValue) + (i * padding) + 13 );
          })
					.attr('x', x.rangeBand() / 4)
					.text(function(n) {
						return n.formattedValue;
					});
    }, (first ? 0 : delay));

    var linkLine = function(start) {
        return function(l) {
            var source = nodeMap[l.source],
                target = nodeMap[l.target],
                gapWidth = x(0),
                bandWidth = x.rangeBand() + gapWidth,
                startx = x.rangeBand() - bandWidth,
                sourcey = y(source.offsetValue) + 
                    source.order * padding +
                    y(l.outOffset) +
                    y(l.value)/2,
                targety = y(target.offsetValue) + 
                    target.order * padding + 
                    y(l.inOffset) +
                    y(l.value)/2,
                points = start ? 
                    [
                        [ startx, sourcey ], [ startx, sourcey ], [ startx, sourcey ], [ startx, sourcey ] 
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