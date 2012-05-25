var json;
var hystory = [];
$("li.buttons button").live('click', function() {
  $("article svg").remove();
  var url = $(this).data("url");
	requestData(url, 10, 0);
  hystory.push(index);
  var child = json;
  for (var i = 0; i < hystory.length; i++) 
  	child = child.childs[hystory[i] -1];
	drawAlluvial(child);
});

var bindEvents = function() {
	qtipShow();
};

var registerTemplates = function() {
	$.templates({
		qtipTemplate: $("#tipTemplate").html()
	});
};

var requestData = function(filtros, limit, start_at) {
	$.ajax({
	url: filtros + "?limit=" + limit + "&startAt=" + start_at,  
    method: "GET",
    success: function(data) {
      json = data;
      drawAlluvial(data);
    }
  });
};

var qtipShow = function() {
	$("rect").qtip({
		content: { 
			text: function() { 
				var myData = {
					name: $(this).data("description"),
					percentage_parent: $(this).data("pp"),
					percentage_total: $(this).data("tp"),
					buttons: [
						{ name: "Natureza", url: "/filtros", "color": "primary" },
						{ name: "Destino", url: "/filtros", "color": "inverse" },
						{ name: "SubFun&ccedil;&atilde;o", url: "/filtros", "color": "info" }
					]
				};
				return $.render.qtipTemplate(myData);
			},
		},
		position: { at: 'bottom center', my: 'top center' },
    show: { event: 'click' },
		hide: { event: 'click' },
    style: {
			classes: 'ui-tooltip-light ui-tooltip-shadow'
		}
  });
};

$(document).ready(function() {
	
	setTimeout(bindEvents, 3000);
	registerTemplates();
});
