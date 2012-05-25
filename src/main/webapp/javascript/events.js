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
	url: "/filtros/destino/natureza?limit=10&startAt=0",  
    method: "GET",
    success: function(data) {
      json = data;
      drawAlluvial(data);
    }
  });

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
});
