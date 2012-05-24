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
	
	body {
		width: 1000px;
	  margin: 20px auto;
		font-family: Verdana;
	}
	
	header h2 { font-weight: normal; 
		float:right; 
		display:block; 
		width: 600px; 
		margin: 50px;
	}
	header h1 { 
		background-image: url('/images/logo.png');
		height: 293px; 
		width: 291px;
		text-indent: -999999px;
		float:left;
		display:block;
	 }
	
	header img#logo {
		height: 293px; 
		width: 291px;
	}
	article {
		
	}
</style>

<body>
	<header>
		<img id="logo" scr="/images/logo_big.png" alt="Contas Refeitas" />
		<h1><h1>
	</header>
	<article>
		<p>Apresenta&#231;&#227;o dos dados financeiros da c&#226;mara municipal para o 
		p&#250;blico interessado atrav&#233;s de navega&#231;&#227;o entre as divis&#245;es de gastos afim de expor dados de forma siplificada com textos e gr&#225;ficos.</p>
<script>
	var hystory = [];
	$(document).ready(function() {
		$.ajax({
			url: "/filtros/natureza/destino", //?limit=20
			method: "GET",
			success: function(data) {
				json = data;
				makeTheMagicHappen(data);
			}
		});
	});
	var json, data, total;
	$("rect").live('click', function() {
		$("article svg").remove();
		var index = parseInt($(this).data("id"));
		hystory.push(index);
		var child = json;
		for (var i = 0; i < hystory.length; i++) 
			child = child.childs[hystory[i] -1];
		makeTheMagicHappen(child);
	});
	
	function makeTheMagicHappen(json) {
		data = createAlluvialData(json);

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
		    .attr("height", h + 200);

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
	    <button class="close" data-dismiss="modal">�</button>
	    <h3>Junte-se a causa!</h3>
	  </div>
	  <div class="modal-body">
	    <p>
	      Os dados que deveriam existir aqui
	      <a href="http://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm">
	        j� deviam ter sido publicados pelo TCM
	      </a>, mas ainda n�o foram. <a href="https://www.causes.com/causes/766331-liberacao-dos-dados-pelo-tribunal-de-contas" target="_blank">
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