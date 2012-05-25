var json;
var hystory = [];
var limit = 10;
var startAt = 0;

var buttonClick = function() { 
	$("ul.buttons button").live('click', function() {
  	$("article svg").remove();
	  var index = parseInt($(this).data("id"));
	  hystory.push(index);
	  var child = json;
	  for (var i = 0; i < hystory.length; i++) 
	  	child = child.childs[hystory[i] -1];
		drawAlluvial(child);
	});
};

var bindEvents = function() {
	qtipShow();
	buttonClick();
};

var registerTemplates = function() {
	$.templates({
		qtipTemplate: $("#tipTemplate").html()
	});
};

function loadAlluvial(url) {
	$.ajax({
	url: "/filtros/" + url + "?limit=" + limit + "&startAt=" + startAt,  
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
	loadAlluvial(); 
	setTimeout(bindEvents, 5000);
	registerTemplates();
  
  $('li.item a').click(function(){
	  $('li.item').removeClass('active');
	  $(this).parent().addClass('active');
	  limit = $(this).text();
	  $("article svg").remove();
	  loadAlluvial();
  });
  
  $('#slider').slider({
  		min: 0,
  		change: function(event, ui) {
  			startAt = $('#slider').slider('value');
  			$("article svg").remove();
  			loadAlluvial();
  		}
  });

});
