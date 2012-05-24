var json;
var hystory = [];
$("rect").live('click', function() {
	$("article svg").remove();
	var index = parseInt($(this).data("id"));
	hystory.push(index);
	var child = json;
	for (var i = 0; i < hystory.length; i++) 
		child = child.childs[hystory[i] -1];
	drawAlluvial(child);
});

$(document).ready(function() {
	$.ajax({
		url: "/filtros/natureza/destino", //?limit=20
		method: "GET",
		success: function(data) {
			json = data;
			drawAlluvial(data);
		}
	});
});