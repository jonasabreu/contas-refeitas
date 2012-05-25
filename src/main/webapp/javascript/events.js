var json;
var hystory = [];
/*$("rect").live('click', function() {
  $("article svg").remove();
  var index = parseInt($(this).data("id"));
  hystory.push(index);
  var child = json;
  for (var i = 0; i < hystory.length; i++) 
  child = child.childs[hystory[i] -1];
drawAlluvial(child);
});*/

var bindEvents = function() {
	qtipShow();
};

var qtipShow = function() {
	$("rect").qtip({
		content: { text: function() { return $(this).data("description"); } },
		position: { at: 'bottom center', my: 'top center' },
    show: { event: 'click' },
		hide: { event: 'click' },
    style: { classes: 'ui-tooltip-light ui-tooltip-shadow' }
  });
};

$(document).ready(function() {
  $.ajax({
	url: "/filtros/destino/natureza?limit=10&startAt=0",  
    method: "GET",
    success: function(data) {
      json = data;
      drawAlluvial(data);
    }
  });

	setTimeout(bindEvents, 3000);
});
