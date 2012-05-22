<html>
<head>
	<title>Contas Refeitas</title>
	<script src="http://d3js.org/d3.v2.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="/bootstrap/js/bootstrap.js"></script>
	<script src="/bootstrap/js/bootstrap-modal.js"></script>
	<script src="/javascript/alluvial-data.js"></script>
	<script src="/javascript/alluvial-links.js"></script>
	<script src="/javascript/alluvial.js"></script>
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
	$(document).ready(function() {
		$.ajax({
			url: "/filtros/destino/natureza",
			method: "GET",
			success: function(json) {
				makeTheMagicHappen(json);
			}
		});
	});
	
	function makeTheMagicHappen(json) {
		
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

		t = update(true, data, t, vis, x, y, delay, padding, nodeMap, line);
		updateNext(t, data, vis, x, y, delay, padding, nodeMap, line);
		
	}

	/*$('#myModal').click(function() {
		$('#myModal').modal({
		  keyboard: false
		});	
	});*/
	
</script>	
	</article>
	<footer>
	</footer>

	<!--
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
	    <p>
	      <div class='sbutton twitter'>
		    <a href="http://twitter.com/share" class="twitter-share-button" data-count="none" >Tweet</a>
	      </div>
	    </p>
	  </div>
	  <div class="modal-footer">
	    <a href="#" class="btn">Fechar</a>
	  </div>
	</div>
	-->
</body>
</html>