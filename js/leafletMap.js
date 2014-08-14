//Class for customizing icons on zoom
var LeafIcon = L.Icon.extend({
    options: {
        //shadowUrl: 'img/shadow.png',
        iconSize:     [15, 23],
        //iconAnchor:   [20, 90],
        popupAnchor:  [0, -15]
    }
});
L.icon = function (options) {
    return new L.Icon(options);
};

function detectBoundaries(tipBounds, elem){
    tipBounds.left = (tipBounds.left + $(elem).width()) > window.innerWidth ? tipBounds.left - $(elem).width() - 30 : tipBounds.left;
    tipBounds.left = (tipBounds.left - $(elem).width()) < 0 ? $(elem).width() : tipBounds.left;

    tipBounds.top = (tipBounds.top + $(elem).height()) > window.innerHeight ? tipBounds.top - $(elem).height() + 10 : tipBounds.top;
    tipBounds.top = tipBounds.top < 0 ? $(elem).height() : tipBounds.top;

    return tipBounds;
}

function numberWithCommas(x) {
    if(x){
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else{
      return "No Data";
    }     
}

//initialize map
function initMap(){
    // Added for stamen tiles
    var layer = new L.StamenTileLayer("toner");
    var map = new L.Map('map', {
        layers: [layer],
        center: new L.LatLng(38.16112, -111.61795), // 50.51343, -103.0957
        zoom: 4,
        fullscreenControl: true,
        fullscreenControlOptions: { // optional
            title:"Fullscreen"
        }
    });
    map.addLayer(layer);
    map.scrollWheelZoom.disable();

    return map;
}

function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function zoomToFeature(e) {           
    map.fitBounds(e.target.getBounds());
}

function barChartToolTip(textData){
    $("#barchartPopup").show().html(textData);

    // Grab the height of the generated tooltip
    var tmPopHeight = $("#barchartPopup").height();
    var tmPopWidth = $("#barchartPopup").width();
    var tipBounds = {};

    // Position the tooltip based on mouse position     
    $(document).mousemove(function(e){
      tipBounds = e.pageX;
      tipBounds = detectBoundaries(tipBounds, "#mapdiv");
      //$("#barchartPopup").css({"left":e.pageX - tmPopWidth + "px","top":e.pageY - tmPopHeight-40 + "px", "opacity":0.9, "padding":"5px"}); //if chart is ontop

      if(tipBounds > 1135){
        $("#barchartPopup").css({"right":0,"top":e.pageY - tmPopHeight-570 + "px", "opacity":0.9, "padding":"5px"});
      }else if(tipBounds < 318){
        $("#barchartPopup").css({"left":0,"top":e.pageY - tmPopHeight-570 + "px", "opacity":0.9, "padding":"5px"});
      }else{
        $("#barchartPopup").css({"left":e.pageX - tmPopWidth-150 + "px","top":e.pageY - tmPopHeight-570 + "px", "opacity":0.9, "padding":"5px"});
      }
    });        
}

function xAxisTooltip(e){
  // Grab the height of the generated tooltip
  var tmPopHeight = $(".leaflet-top.leaflet-right").height();
  var tmPopWidth = $(".leaflet-top.leaflet-right").width() / 2; 
  var tipBounds = {};
      tipBounds = e.pageX -305;

  tipBounds = detectBoundaries(tipBounds, "#mapdiv");

  if(tipBounds > 500){
    $(".leaflet-top.leaflet-right").css({
      "right":0, "width":"300px",
      "top":0, "opacity":0.9, "padding-bottom":"15px"
    });
  }else if(tipBounds < -10){
    $(".leaflet-top.leaflet-right").css({
      "left":0, "width":"300px",
      "top":0, "opacity":0.9, "padding-bottom":"15px"
    });
  }else{
    $(".leaflet-top.leaflet-right").css({
      "left":tipBounds, "width":"300px",
      "top":0, "opacity":0.9, "padding-bottom":"15px"
    });
  }  
  
  $("body").mouseover(function(e){
    $(".leaflet-top.leaflet-right").css("left", "");
    $(".leaflet-top.leaflet-left").css("top","");
  });
}

function forceClusterToolTip(data, threshold){
  var total;
  if(data.cluster > 0){
    total = data.radius * threshold;
  }else{
    total = data.radius;
  }

  $("#forceClusterPopup").show().html( "<strong>"+capitaliseFirstLetter(data.type) +"</strong>: <br />"+
      "Inspection: "+numberWithCommas(Math.floor(total))
  );

  // Grab the height of the generated tooltip
  var tmPopHeight = $("#forceClusterPopup").height();
  var tmPopWidth = $("#forceClusterPopup").width() / 2;

  // Position the tooltip based on mouse position
  $(document).mousemove(function(e){
    $("#forceClusterPopup").css({"left":e.pageX - tmPopWidth + "px","top":e.pageY - tmPopHeight-40 + "px", "opacity":0.9, "padding":"7px"});
  });
}

function forceCluster(data,stateName){
    //console.log(data);
    
    var width = 680,
        height = 330,
        padding = 1.5, // separation between same-color circles
        clusterPadding = 6, // separation between different-color circles
        maxRadius = 12;

    var n = 13, // total number of circles
        m = 2, // number of distinct clusters
        threshold = 10;

    var color = d3.scale.category10()
        .domain(d3.range(m));

    // The largest node for each cluster.
    var clusters = new Array(m);

    var nodes = data;
      nodes.forEach(function(d) { 
        clusters[d.cluster] = d; 
      });

      var force = d3.layout.force()
          .nodes(nodes)
          .size([width, height])
          .gravity(.02)
          .charge(0)
          .on("tick", tick)
          .start();

      var svg = d3.select("#stateStats").append("svg")
          .attr("width", width)
          .attr("height", height);

      var circle = svg.selectAll("circle")
          .data(nodes)
        .enter().append("circle")
          .attr("r", function(d) { return d.radius; })
          .style("fill", function(d) { return color(d.cluster); })
          .call(force.drag);

      circle.on("mouseover", function (d) {
        var data = d;

        forceClusterToolTip(data, threshold);
      });
      circle.on("mouseout", function(d){ $('#forceClusterPopup').hide(); });

      function tick(e) {
        circle
            .each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
      }

      // Move d to be adjacent to the cluster node.
      function cluster(alpha) {
        return function(d) {
          var cluster = clusters[d.cluster];
          if (cluster === d) return;
          var x = d.x - cluster.x,
              y = d.y - cluster.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + cluster.radius;
          if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            cluster.x += x;
            cluster.y += y;
          }
        };
      }

      // Resolves collisions between d and all other circles.
      function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) {
          var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
              nx1 = d.x - r,
              nx2 = d.x + r,
              ny1 = d.y - r,
              ny2 = d.y + r;
          quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
              var x = d.x - quad.point.x,
                  y = d.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y),
                  r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
              if (l < r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          });
        };
      }

    //}); //end retrieveClusterData retrieve
}

function stackedCharts(statesData){//D3
    var margin = {top: 5, right: 0, bottom: 7, left: 0},
        width = 990,
        height = 115;
    var mapPolyId;

    var y = d3.scale.linear()
        .range([height, 0]);

    var chart = d3.select(".chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    var data = statesData.features;

    var filterData = data.filter(function(d){
        if(d.properties){
          if(d.properties.value || d.properties.inspections){
            if(d.properties.value > 1) return d;
          }
        }
    });
                
    d3.select("#sort").on("click", sortBars);
    d3.select("#reset").on("click", reset);
    var sortOrder = false;
    
    var xScale = d3.scale.ordinal()
        .domain(d3.range(filterData.length))
        .rangeRoundBands([0, width], -0.6); 

    y.domain([0, d3.max(filterData, function(d) {
        var total = d.properties.value;          
        return total;    
    })]);
      
    var barWidth = (width / filterData.length) -1;
      
    var bar = chart.selectAll("rect")
      .data(filterData)
      .enter().append("rect")
      .attr("x", function(d, i) {
        return xScale(i);
       }); 

    bar.attr("y", function(d) { 
      var total = d.properties.value;
      return y(total) -3;
    })
    .attr("height", function(d) {          
      return d.properties.value;
    })
    .on("mouseover", function (d) { 
        mapPolyId = '.'+d.properties.name.replace(/[\W\s]/g,"");

        var textData = d.properties.name +": <br />"+
            "<strong>"+capitaliseFirstLetter(activityType)+":</strong> "+d.properties.value

        barChartToolTip(textData);

        //add chart to map functionality
        /*d3.select(".leaflet-zoom-animated").selectAll(mapPolyId)
          .attr("stroke-width",3.5)
          .attr("fill-opacity","1.0")
          .attr("stroke","#ccc"); */
        $(mapPolyId).css("fill-opacity", "1.0").css("stroke","#ccc");
    })
    .on("mouseout", function(d){
        mapPolyId = '.'+d.properties.name.replace(/[\W\s]/g,"");

        //add chart to map functionality
        /*d3.select("svg").selectAll(mapPolyId)
         .attr("fill-opacity","0.7")
         .attr("stroke","")
         .attr("stroke-width",0.7);*/
         $(mapPolyId).css("fill-opacity", "0.7").css("stroke","");
    })
    .attr("width", barWidth - 1)
    .attr("class", "bar")
    .attr("id", function(d){
        return d.properties.name.replace(/[\W\s]/g,"");
    });

    bar.on("click", function(d){
        var stateName = d.properties.name;

        $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php/welcome/update_force_cluser",
        data: {state_name: stateName},
        success: function(data) {
            forceCluster(data,stateName);
        } // end success function
    }); //end ajax

    if($("#stateStats"))
        $("#stateStats").remove();
    
    d3.select("body").append("div").attr("id", "stateStats")
    .attr("title", stateName)
    .append("div").attr("id", "stateVis");      
      
    $( "#stateStats" ).dialog({
      autoOpen: false,
      height: 400,
      width: 700,
      show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
      scroller: false
    });

    $( "#stateStats" ).dialog( "open" );
});

    function sortBars(){
        sortOrder = !sortOrder;

        sortItems = function (a, b) {
            if (sortOrder) {
                return b.properties.value - a.properties.value;
            }
            return b.properties.value - a.properties.value;
        };
        
        d3.select(".chart").selectAll("rect")
            .sort(sortItems)
            .transition()
            .delay(function (d, i) {
                return i * 50;
            })
            .duration(1000)
            .attr("x", function (d, i) {  
                return xScale(i);
        });
    }

    function reset() {
        d3.select(".chart").selectAll("rect")
            .sort(function(a, b){
                return d3.ascending(a.properties.name, b.properties.name);
            })
            .transition()
            .delay(function (d, i) {
                return i * 50;
            })
            .duration(1000)
            .attr("x", function (d, i) {
                return xScale(i);
            }
        );                    
    }
}//end D3 Vis  

function getStates(statesData, activityType, geoType, agencyType, pointsBucket){
    function getColorStates(d) {

        return d > 6000 ? '#800026' :
           d > 4000  ? '#BD0026' :
           d > 2000  ? '#E31A1C' :
           d > 1000  ? '#FC4E2A' :
           d > 500   ? '#FD8D3C' :
           d > 250   ? '#FEB24C' :
           d > 150   ? '#FED976' :
           d > 10    ? '#FFEDA0':
           isNaN(d) == true  ? '#ccc':
           d == 0 ?    '#ccc':
                      '#FFEDA0';            
    }

    function style(feature) {
        return {
            fillColor: getColorStates(feature.properties.value),
            weight: 2,
            opacity: .7,
            color: getColorStates(feature.properties.value),
            //dashArray: '3',
            fillOpacity: 0.7,
            className: feature.properties.name.replace(/[\W\s]/g,"")
        };
    }  

    function highlightFeature(e) {
        var layer = e.target;
        var mapPolyId = '#'+layer.feature.properties.name.replace(/[\W\s]/g,"");

        layer.setStyle({
            weight: 3,
            color: '#ccc',
            fillOpacity: 0.9
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        //Hover text update
        info.update(e.target.feature.properties);
        
        d3.select(".chart").selectAll(mapPolyId)
            .attr("stroke","#ccc")
            .style("fill", "#3d3d3d")
            .attr("stroke-width",1);
    }

    function resetHighlight(e) {
        var layer = e.target;
        var mapPolyId = '#'+layer.feature.properties.name.replace(/[\W\s]/g,"");

        geojson.resetStyle(e.target);

        info.update();

        d3.select(".chart").selectAll(mapPolyId)
            .attr("stroke","")
            .style("fill", "")
            .attr("stroke-width",1);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            //click: zoomToFeature
            click: stateBox
        });
    }

    function stateBox(e){
      var state = e.target.feature.properties;

      if ($(".geoRegionBox").length < 1){
        $("#mapdiv").append("<div class='geoRegionBox'></div>");
      }

      $(".geoRegionBox").show();
      $(".geoRegionBox").addClass("info").html(
        "<h4>"+state.name+"</h4>"+
          capitaliseFirstLetter(activityType)+": "+numberWithCommas(state.value)+"<br />"+
          "Search Results: <a href='http://ogesdw.dol.gov/views/search.php' target='new'>View</a>"+"<br />"+
          "Download Data: <a href='http://ogesdw.dol.gov/views/data_catalogs.php' target='new'>XML</a> | "+
            "<a href='http://ogesdw.dol.gov/views/data_catalogs.php' target='new'>CSV</a>"
        );
      //console.log(state);
    }

    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend'),grades;
            grades = [10, 150, 250, 500, 1000, 2000, 4000, 6000];

        div.innerHTML +='<i style="background:#ccc"></i>No Data<br>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorStates(grades[i] + 1) + '"></i> ' +
                numberWithCommas(grades[i]) + (grades[i + 1] ? '&ndash;' + numberWithCommas(grades[i + 1]) + '<br>' : '+');
        }
        return div;              
    };
    legend.addTo(map);

    geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);  

    this.info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed - '+timeFrame+'
    info.update = function (state) { 
        this._div.innerHTML = '<h4>360 Day OSHA '+capitaliseFirstLetter(activityType)+'</h4>';  
        if(state){
           this._div.innerHTML += '<b>' + state.name + '</b><br /> '+capitaliseFirstLetter(activityType)+': ' + numberWithCommas(state.value)
        }else{
            this._div.innerHTML += 'Hover over state.';         
        }
    };
    info.addTo(map);
    
    violations = new LeafIcon({iconUrl: 'js/img/violations.png'});      
    //An array of JSON objects
  
    map.on('zoomend', function(e){
        if(map.getZoom() >= 8){
            map.removeLayer(geojson); 
            $(".legend").hide();    
        }
        if(map.getZoom() < 8){
            $(".info").show();
        }
        if(map.getZoom() > 8){
            $(".info").hide();
        }
    });
    //END Layer Construction    
        
    function onMapClick(e) {//Coordinate pop up
        popup.setLatLng(e.latlng)
        .setContent("Coordinates clicked are: " + e.latlng.toString())
        .openOn(map);
    }  
    //map.on('click', onMapClick);
}

function getCounties(countyData){
    geoType = 2; agencyType = "osha";

    function getColorCounties(d) {
        return d > 500 ? '#800026' :
               d > 300  ? '#BD0026' :
               d > 200  ? '#E31A1C' :
               d > 100  ? '#FC4E2A' :
               d > 50   ? '#FD8D3C' :
               d > 25   ? '#FEB24C' :
               d > 15   ? '#FED976' :
               d > 1    ? '#FFEDA0':
               isNaN(d) == true  ? '#ccc':
               d == 0 ?    '#ccc':
                          '#FFEDA0';
    }

    function styleCounties(feature) {      
        return {
            fillColor: getColorCounties(feature.properties.value),
            weight: 2,
            opacity: .7,
            color: getColorCounties(feature.properties.value),
            //dashArray: '3',
            fillOpacity: 0.7,
            className: feature.properties.name.replace(/[\W\s]/g,"")
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#ccc',
            fillOpacity: 0.9
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        //Hover text update
        county_info.update(e.target.feature.properties);
    }

    function resetHighlight(e) {
        geojsonCounties.resetStyle(e.target);
        county_info.update();
    }        

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            //click: zoomToFeature
            click:countyBox
        });
    }

    function countyBox(e){
      var county = e.target.feature.properties;

      if ($(".geoRegionBox").length < 1){
        $("#mapdiv").append("<div class='geoRegionBox'></div>");
      }

      $(".geoRegionBox").show();

      $(".geoRegionBox").addClass("info").html(
        "<h4>"+county.name+" County</h4>"+
          capitaliseFirstLetter(activityType)+": "+numberWithCommas(county.value)+"<br />"+
          "Search Results: <a href='#'>View</a>"+"<br />"+
          "Download Data: <a href='#'>PDF</a> | <a href='#'>CSV</a>"
        );
    }

    geojsonCounties = L.geoJson(countyData, {
        style: styleCounties,
        onEachFeature: onEachFeature
    });
    $("#loadingText").remove();
    $("#dataSwitchButton").show();
    $(".ui-slider").show();
    $(".dashboardA").show();

    var county_info = L.control();
    county_info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info2'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed - '+timeFrame+'
    county_info.update = function (state) { 

        this._div.innerHTML = '<h4>360 Day OSHA '+capitaliseFirstLetter(activityType)+'</h4>';  
        if(state){
          this._div.innerHTML += '<b>' + state.name + ' County, </b><br /> '+capitaliseFirstLetter(activityType)+': ' + numberWithCommas(state.value)
        }else{
          this._div.innerHTML += 'Hover over county.';
        }
    };
    county_info.addTo(map);

    var legend2 = L.control({position: 'bottomright'});
    legend2.onAdd = function () { 
        var div = L.DomUtil.create('div', 'legend2'),grades;
        grades = [1, 15, 25, 50, 100, 200, 300, 500];

        div.innerHTML +='<i style="background:#ccc"></i>No Data<br>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColorCounties(grades[i] + 1) + '"></i> ' +
                numberWithCommas(grades[i]) + (grades[i + 1] ? '&ndash;' + numberWithCommas(grades[i + 1]) + '<br>' : '+');
        }
        return div;
    };
    legend2.addTo(map);

    $(".legend2").hide();
    $(".info2").hide();

    map.on('zoomend', function(e){  
        if(map.getZoom() <= 5){
            map.addLayer(geojson);
        }//order matters
        if( map.getZoom() > 5 && map.getZoom() < 8){ 
            map.removeLayer(geojson); 
            $("#dashboardA").fadeOut(4000); 
            $(".legend2").show(); $(".info2").show(); $(".legend").hide(); $(".info").hide();

            map.addLayer(geojsonCounties);   
        }
         
        if(map.getZoom() <= 5){
            map.removeLayer(geojsonCounties);

            $(".info").show(); $(".legend").show(); 
            $(".legend2").hide(); $(".info2").hide();
            $("#dashboardA").fadeIn(4000); 
        } 
        if(map.getZoom() > 8){
          map.removeLayer(geojsonCounties);
          $(".legend").hide(); $(".info").hide();
        }         
    });
}

function getPoints(pointsBucket){
  //$('.search-button').remove();
  $('.leaflet-control-search').remove();
  var markers = L.markerClusterGroup();
  
  violations = new LeafIcon({iconUrl: baseUrl+'js/img/inspections.png'});

  function populate(pointsBucket){
    var controlSearch = new L.Control.Search({layer: markers, initial: false, zoom:13});
    
    controlSearch.on('search_locationfound', function(e) {      
      //e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
      //console.log(e.layer);
      if(e.layer._popup)
        e.layer.openPopup();
    });

    map.addControl(controlSearch);

    for(w=0; w < pointsBucket.length; w++){
      var loc = pointsBucket[w].geometry.coordinates,
      title = pointsBucket[w].properties.name;

      var marker = new L.Marker(new L.latLng(loc),
          {title: title}, 
          {icon: violations}
        )   
        .bindPopup(
            "<strong>"+agencyType.toUpperCase()+" 90 days</strong><br />"
            +"<a href='#'>"+pointsBucket[w].properties.name+"</a><br />"
            +pointsBucket[w].properties.address+"<br />"
            +pointsBucket[w].properties.city+","
            +pointsBucket[w].properties.state+", "
            +pointsBucket[w].properties.zip+"<br />"
            +"Inspections:NA, Violations: NA <br />"
            +"Current Penalty: NA <br />"
            +"<a href='#'>View Establishment History</a>"
      );                   
      markers.addLayer(marker);
    }

    map.removeLayer(markers);
    map.on('zoomend', function(e){
        if(map.getZoom() >= 8){
            map.addLayer(markers);     
        }
        if(map.getZoom() < 8){
            map.removeLayer(markers);
        }
    });
    return false;
  }
  
  //Begin Layer 2 and 3 Intigration
  /*var jsonPoint = L.geoJson(pointsBucket, {
      filter: function(feature, layer) {
          return feature.properties.show_on_map;
      },
  });*/
  populate(pointsBucket);  
}

var popup = L.popup();
var map = initMap(), activityType = "inspections", timeFrame = "90", geoType, agencyType;
var baseUrl = "http://dev-enforce-web-02.dol.gov/mapPrototypeCI/";
var beginDay, endDay;

//$("#"+activityType).addClass("activeButton");
//$(".switchButton:contains('OSHA')").addClass("activeButton"); //what are we doing here???

geoType = 1; agencyType = "osha";

//These are set in the map_console.php file
statesData = choropleth_data; 
countyData = county_choropleth_data;
pointsBucket = points_data;
//nodes = cluster_nodes;

$("#mapdiv").mousemove(function(e){ xAxisTooltip(e); });

$(".legend2").hide(); $(".info2").hide();

/*$("li.switchButton").click(function(e) { 
  $("li.switchButton").removeClass("activeButton");
  $(".switchButton:contains('"+$(this).html()+"')").addClass("activeButton");

  //More code to retrieve agency data
});

$( "#slider-range" ).slider({
  //orientation: "horizontal",
  range: true,
  min: 0,
  max: 360,
  values: [ 1, 31 ],
  slide: function( event, ui ) {
    $( "#amount" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ]+" Days" );
    beginDay = ui.values[ 0 ];
    endDay = ui.values[ 1 ]           
  }
});
$( "#amount" ).val($( "#slider-range" ).slider( "values", 0 ) +
  " - " + $( "#slider-range" ).slider( "values", 1 ) +" Days Ago" );
*/

//Need to pass beginDay and endDay to functions?
getStates(statesData, activityType, geoType, agencyType, pointsBucket);
stackedCharts(statesData);
getCounties(countyData);
getPoints(pointsBucket);


//get data with days slider
/*
$(".ui-slider-handle").mouseup(function(){
  day_range.length = 0;

  $("#dataSwitchButton").hide(); $(".ui-slider").hide(); $(".dashboardA").hide();
  $("#dataNav").append("<span id='loadingText' style='color:red'>Loading Data...</span>");
  map.removeLayer(geojson);
  $(".legend").remove(); $(".info").remove(); $(".info2").remove(); $(".legend2").remove();

  var fadeCount = 0;

  $(".chart svg").fadeOut(2000, function(){
    fadeCount = 1;    
  });

  $(".chart svg").remove();

  if(typeof geojsonCounties !== 'undefined'){
    map.removeLayer(geojsonCounties);
  }
  
  console.log(beginDay+" - "+endDay);
  day_range.push(beginDay, endDay);     

  $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php/welcome/update_states",
        data: {activitytype: activityType, beginday: beginDay, endday: endDay},
        success: function(data) {
            //console.log(data);
            getStates(data, activityType, geoType=1, agencyType = "osha");
            stackedCharts(data);
        } // end success function
    }); //end ajax

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php/welcome/update_counties",
        data: {activitytype: activityType, beginday: beginDay, endday: endDay},
        success: function(data) {
            //console.log(data);
            getCounties(data);
        } // end success function
    }); //end ajax
    
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php/welcome/update_points",
        data: {activitytype: activityType, beginday: beginDay, endday: endDay},
        success: function(data) {
            //console.log(data);
            getPoints(data);
        } // end success function
    }); //end ajax
}); 


$("#dataSwitchButton").change(function() {
    //$("#"+activityType).removeClass("activeButton");
    activityType = document.getElementById("dataSwitchButton").value;

    console.log(activityType);
    
    $("#dataSwitchButton").hide(); $(".ui-slider").hide(); $("#dashboardA").hide();
    $("#dataNav").append("<span id='loadingText' style='color:red'>Loading Data...</span>");
    map.removeLayer(geojson);
    $(".legend").remove(); $(".info").remove(); $(".info2").remove(); $(".legend2").remove();

    var fadeCount = 0;

    $(".chart svg").fadeOut(2000, function(){
      fadeCount = 1;    
    });

    $(".chart svg").remove();
    console.log(beginDay+" - "+endDay);

    if(typeof geojsonCounties !== 'undefined')
      map.removeLayer(geojsonCounties);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php/welcome/update_states",
        data: {activitytype: activityType, beginday: beginDay, endday: endDay},
        success: function(data) {
            //console.log(data);
            getStates(data, activityType, timeFrame =90, geoType=1, agencyType = "osha");
            stackedCharts(data);
        } // end success function
    }); //end ajax

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php/welcome/update_counties",
        data: {activitytype: activityType, beginday: beginDay, endday: endDay},
        success: function(data) {
            //console.log(data);
            getCounties(data);
        } // end success function
    }); //end ajax

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "index.php/welcome/update_points",
        data: {activitytype: activityType},
        success: function(data) {
            //console.log(data);
            getPoints(data);
        } // end success function
    }); //end ajax
    $("#dashboardA").css("display",""); //Temp Fix: somthing keeps adding display none so have to force it off
    //$(this).addClass("activeButton");
});*/