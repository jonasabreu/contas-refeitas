var json;
var hystory = [];
var limit = 10;
var startAt = 0;

$("rect").live('click', function() {
  $("article svg").remove();
  var index = parseInt($(this).data("id"));
  hystory.push(index);
  var child = json;
  for (var i = 0; i < hystory.length; i++) 
  child = child.childs[hystory[i] -1];
  drawAlluvial(child);
});

function loadAlluvial() {
	$.ajax({
	url: "/filtros/destino/natureza?limit=" + limit + "&startAt=" + startAt,  
    method: "GET",
    success: function(data) {
      json = data;
      drawAlluvial(data);
    }
  });
}

$(document).ready(function() {
  loadAlluvial(); 

  $("rect[data-description]").live('mouseover', function(element) {
    $(element.target).qtip({
      content: "OBAAAAAAAAAAAA"
//      content: $(this).data("description")
/*      position: 'topMiddle',
      hide: {
        fixed: true
      },
      style: {
        tip: true,
        height: 100,
        width: 277
      }*/
    });
  });
  
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
