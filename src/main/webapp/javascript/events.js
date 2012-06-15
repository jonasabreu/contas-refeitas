var json;
var hystory = [];
var filters = "";
var limit = 10;
var startAt = 0;

function reset() {
	loadAlluvial(filters);
	$("article svg").remove();
}

var buttonClick = function() { 
	$("ul.buttons button").live('click', function() {
  	$("article svg").remove();
		var url = $(this).data("url");
		filters = url;
	  var index = parseInt($(this).data("id"));
	  hystory.push(index);
		loadAlluvial(url);
	});
};

function loadAlluvial(url) {
	if (!url)
		url = "";
	$.ajax({
		url: "/filtros" + url + "?limit=" + limit + "&startAt=" + startAt,  
    method: "GET",
    success: function(data) {
      json = data;
	  var child = json;	
	  for (var i = 1; i < hystory.length; i++) 
	  	child = child.childs[hystory[i] - 1];
    drawAlluvial(child);
    }
  });
};

var qtipShow = function() {
	$('rect').each(function(index, item){
		if ($(item).data("events")) {
			return;
		}
	
	var tipSettings = 	{
			content: { 
				text: function() { 
					var myData = {
						name: $(this).data("description"),
						percentage_parent: $(this).data("pp"),
						percentage_total: $(this).data("tp"),
						buttons: []
					};
					var buttons = [
						{ name: "Natureza", url: "/natureza", "color": "primary" },
						{ name: "Destino", url: "/destino", "color": "inverse" },
						{ name: "SubFun&ccedil;&atilde;o", url: "/subfuncao", "color": "info" }
					];

					for (var index in buttons) {
						var btn = buttons[index];
						if (filters.indexOf(btn.url) == -1) {
							btn.url = filters + btn.url;
							btn.id = $(this).data("id");
							myData.buttons.push(btn);
						}
					}

					return $.render.qtipTemplate(myData);
				},
			},
			position: { at: 'bottom center', my: 'top center' },
	    show: { event: 'click' },
			hide: { event: 'click' },
	    style: {
				classes: 'ui-tooltip-light ui-tooltip-shadow'
			}
	  };
	
	if ($(item).data("id") == 0 && filters == "")
		tipSettings.show.ready = true;
	
	$(item).qtip(tipSettings);
	
	});
};


var registerTemplates = function() {
	$.templates({
		qtipTemplate: $("#tipTemplate").html()
	});
};

$(document).ready(function() {
	loadAlluvial(); 
	registerTemplates();
	buttonClick();
  setTimeout(qtipShow, 1000);
  
  $('li.item a').click(function(e){
  	  e.preventDefault();
	  $('li.item').removeClass('active');
	  $(this).parent().addClass('active');
	  limit = $(this).text();
	  reset();
  });
  
  $('#slider').slider({
  		min: 0,
  		change: function(event, ui) {
  			event.preventDefault();
  			startAt = $('#slider').slider('value');
  			reset();
  		}
  });

});
