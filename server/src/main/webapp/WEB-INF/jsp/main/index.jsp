<html>
<head>
	<title>Contas Refeitas</title>
	<script src="http://d3js.org/d3.v2.js"></script>
	<script src="/javascript/fake-data.js"></script>
	<script src="/bootstrap/js/bootstrap.js"></script>
	<script src="/bootstrap/js/bootstrap-modal.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	
	<link type="text/css" rel="stylesheet" media="screen" href="/bootstrap/css/bootstrap.css">
</head>

<style type="text/css">
	body {
	  margin:0px;
		font-family: Verdana;
	}
    
	.node {
	  stroke: #fff;
	  stroke-width: 2px;
	}

	.link {
	  fill: none;
	  stroke: #000;
	  opacity: .3;
	}
	.link.on {
	  stroke: #F00;
	  opacity: .7;
	}

	.node {
	    stroke: none;
	}
	
	header {
		background-color: #caeefc;
		padding: 50px 50px;
		height: 200px;
		width: 900px;
		margin: 0px auto;
		border-radius: 25px;
	}
	header h2 {
		font-size: 40px;
		font-weight: normal;
		display: block;
		float: right;
		line-height: 42px;
		width: 70%;
	}
	header h1 {
		display: block;
		float: left;
		width: 20%;
	}
	
	article {
		background-color: #EFEFEF;
   	border-radius: 25px 25px 25px 25px;
	  height: 500px;
	  margin: 0 auto;
	  padding: 50px;
    width: 1200px;
	}
</style>

<body>
	<header>
		<h1>Contas Refeitas</h1>
		<h2>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et.<h2>
	</header>
	<article>
	<script>
		var total = ${total};
	</script>
<script>
	
	var data = (function() {
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
	    })();

	/* Process Data */

	// make a node lookup map
	var nodeMap = (function() {
	    var nm = {};
	    data.times.forEach(function(nodes) {
	        nodes.forEach(function(n) {
	            nm[n.id] = n;
	            // add links and assure node value
	            n.links = [];
	            n.incoming = [];
	            n.nodeValue = n.nodeValue || 0;
	        })
	    });
	    return nm;
	})();

	// attach links to nodes
	data.links.forEach(function(link) {
	    nodeMap[link.source].links.push(link);
	    nodeMap[link.target].incoming.push(link);
	});

	// sort by value and calculate offsets
	data.times.forEach(function(nodes) {
	    var cumValue = 0;
	    nodes.sort(function(a,b) {
	        return d3.descending(a.nodeValue, b.nodeValue)
	    });
	    nodes.forEach(function(n, i) {
	        n.order = i;
	        n.offsetValue = cumValue;
	        cumValue += n.nodeValue;
	        // same for links
	        var lCumValue;
	        // outgoing
	        if (n.links) {
	            lCumValue = 0;
	            n.links.sort(function(a,b) {
	                return d3.descending(a.value, b.value)
	            });
	            n.links.forEach(function(l) {
	                l.outOffset = lCumValue;
	                lCumValue += l.value;
	            });
	        }
	        // incoming
	        if (n.incoming) {
	            lCumValue = 0;
	            n.incoming.sort(function(a,b) {
	                return d3.descending(a.value, b.value)
	            });
	            n.incoming.forEach(function(l) {
	                l.inOffset = lCumValue;
	                lCumValue += l.value;
	            });
	        }
	    })
	});
	data = data.times;

	// calculate maxes
	var maxn = d3.max(data, function(t) { return t.length }),
	    maxv = d3.max(data, function(t) { return d3.sum(t, function(n) { return n.nodeValue }) });

	/* Make Vis */

	// settings and scales
	var w = 1250,
	    h = 500,
	    gapratio = .7,
	    delay = 1500,
	    padding = 15,
	    x = d3.scale.ordinal()
	        .domain(d3.range(data.length))
	        .rangeBands([0, w + (w/(data.length-1))], gapratio),
	    y = d3.scale.linear()
	        .domain([0, maxv])
	        .range([0, h - padding * maxn]),
	    line = d3.svg.line()
	        .interpolate('basis');

	// root
	var vis = d3.select("article")
	  .append("svg:svg")
	    .attr("width", w)
	    .attr("height", h);


	var t = 0;
	function update(first) {
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
	          .append('svg:title')
	            .text(function(n) { return n.nodeName });
					console.log()
					nodes.append('svg:text')
						.attr('fill', '#FFFFFF')
            .attr('y', function(n, i) {
                return (y(n.offsetValue) + (i * padding) + 13 );
            })
						.attr('x', x.rangeBand() / 4)
						.text(function(n) { 
							console.log(n.nodeValue);
							var value = n.nodeValue.toFixed(2);
							var array = value.toString().split('.');
							var inteiro = array[0];
							var inteiro_legivel = "";
							var c = 1;
							for (var i=inteiro.length; i>0; i--) {
							  inteiro_legivel += inteiro[i-1];
							  if ( (c) % 3 == 0 && i > 1) {
							    inteiro_legivel += "."
							  }
							  c++;
							}
							var s = "";
							var i = inteiro_legivel.length;
							while (i>0) {
							  s += inteiro_legivel.substring(i-1,i);
							  i--;
							}
							return "R$" + s + "," + array[1];
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

	}

	function updateNext() {
	    if (t < data.length) {
	        update();
	        window.setTimeout(updateNext, delay)
	    }
	}
	update(true);
	updateNext();

	$('#myModal').click(function() {
		$('#myModal').modal({
		  keyboard: false
		});	
	});
	
</script>	
	</article>
	<footer>
	</footer>
	
	<a class="btn" data-toggle="modal" href="#myModal" >Launch Modal</a>
	
	<div class="modal" id="myModal">
	  <div class="modal-header">
	    <button class="close" data-dismiss="modal">×</button>
	    <h3>Junte-se a causa!</h3>
	  </div>
	  <div class="modal-body">
	    <p>
	      Os dados que deveriam existir aqui
	      <a href="http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm">
	        já deviam ter sido publicados pelo TCM
	      </a>, mas ainda não foram. <a href="https://www.causes.com/causes/766331-liberacao-dos-dados-pelo-tribunal-de-contas" target="_blank">
	      	Junte-se a essa causa!
	      </a>
	    </p>
	  </div>
	  <div class="modal-footer">
	    <a href="#" class="btn">Close</a>
	  </div>
	</div>
</body>
</html>