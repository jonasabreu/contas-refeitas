<html>
<head>
	<title>Contas Refeitas</title>
	<script src="http://d3js.org/d3.v2.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="/bootstrap/js/bootstrap.js"></script>
	<script src="/bootstrap/js/bootstrap-modal.js"></script>
	<script src="/javascript/alluvial-data.js"></script>
	<script src="/javascript/alluvial-links.js"></script>
	<script src="/javascript/alluvial-settings.js"></script>
	<script src="/javascript/alluvial.js"></script>
	<script src="/javascript/events.js"></script>
	<script src="/qtip/js/jquery.qtip.min.js"></script>
	<link type="text/css" rel="stylesheet" media="screen" href="/bootstrap/css/bootstrap.css">
	<link type="text/css" rel="stylesheet" media="screen" href="/stylesheets/style.css">
  <link type="text/css" rel="stylesheet" media="screen" href="/qtip/css/jquery.qtip.min.css">
</head>
<body>
	<header>
		<img id="logo" src="/images/logo_big.png" alt="Contas Refeitas" />
		<h1>Contas Refeitas</h1>
		<a href="https://github.com/jonasabreu/contas-refeitas"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub"></a>
	</header>
	<article>
<script>

	var hystory = [];
	$(document).ready(function() {
		$.ajax({
			url: "/filtros/destino/subfuncao", //?limit=20
			method: "GET",
			success: function(data) {
				json = data;
				makeTheMagicHappen(data);
			}
		});
	});
	var json, data, total;
	$("rect[data-description]").live('click', function(element) {
    $(element.target).qtip({
      content: $(this).data("description"),
      position: 'topMiddle',
      hide: {
        fixed: true
      },
      style: {
        tip: true,
        height: 100,
        width: 277
      }
    });
  });
/*		$("article svg").remove();
		var index = parseInt($(this).data("id"));
		hystory.push(index);
		var child = json;
		for (var i = 0; i < hystory.length; i++) 
			child = child.childs[hystory[i] -1];
		makeTheMagicHappen(child); 
	}); */
	
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
	
	<section>
		<article>
			<ul>
				<li>
					<h1>O que &#233;?</h1>
				</li>
				<li>
					<p>Apresenta&#231;&#227;o dos dados financeiros da c&#226;mara municipal para o 
				p&#250;blico interessado atrav&#233;s de navega&#231;&#227;o entre as divis&#245;es de gastos afim de expor dados de forma siplificada com textos e gr&#225;ficos.</p>
				</li>
				<li>
					<h1>Por que?</h1>
				</li>
				<li>
					<p>Apresenta&#231;&#227;o dos dados financeiros da c&#226;mara municipal para o 
				p&#250;blico interessado atrav&#233;s de navega&#231;&#227;o entre as divis&#245;es de gastos afim de expor dados de forma siplificada com textos e gr&#225;ficos.</p>
				</li>
			</ul>
			
		</article>
	</section>
	<section>
		<article>
			<div id="svg"></div>
		</article>
	</section>
	<section>
		<article>
			<h1>Join the Cause!</h1>
		</article>
	</section>
	<footer>
		Todo o conte&#250;do deste site foi desenvolvido durante o Hackaton 2012 na C&#226;mara Municipal de S&#227;o Paulo por Jonas de Abreu, Juliano Alves e Raphael Molesim.
	</footer>

	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-32103647-1']);
	  _gaq.push(['_trackPageview']);
	
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>
</body>
</html>
