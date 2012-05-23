var createNodeMap = (function(data) {
    var nm = {};
    data.times.forEach(function(nodes) {
        nodes.forEach(function(n) {
            nm[n.id] = n;
            // add links and assure node value
            n.links = [];
            n.incoming = [];
            n.nodeValue = n.nodeValue || 0;
        })
    });
    return nm;
});

var attachLinksToNodes = (function(data, nodeMap) {
    data.links.forEach(function(link) {
        nodeMap[link.source].links.push(link);
        nodeMap[link.target].incoming.push(link);
    });
});

var sortByValueAndCalculateOffsets = (function(data) {
    data.times.forEach(function(nodes) {
        var cumValue = 0;
        nodes.sort(function(a, b) {
            return d3.descending(a.nodeValue, b.nodeValue)
        });
        nodes.forEach(function(n, i) {
            n.order = i;
            n.offsetValue = cumValue;
            cumValue += n.nodeValue;
            // same for links
            var lCumValue;
            // outgoing
            if (n.links) {
                lCumValue = 0;
                n.links.sort(function(a, b) {
                    return d3.descending(a.value, b.value)
                });
                n.links.forEach(function(l) {
                    l.outOffset = lCumValue;
                    lCumValue += l.value;
                });
            }
            // incoming
            if (n.incoming) {
                lCumValue = 0;
                n.incoming.sort(function(a, b) {
                    return d3.descending(a.value, b.value)
                });
                n.incoming.forEach(function(l) {
                    l.inOffset = lCumValue;
                    lCumValue += l.value;
                });
            }
        })
    });
		return data.times;
});