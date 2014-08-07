L.Control.FullScreen=L.Control.extend({options:{position:"topleft",title:"Full Screen",forceSeparateButton:false},onAdd:function(e){var t="leaflet-control-zoom-fullscreen",n;if(e.zoomControl&&!this.options.forceSeparateButton){n=e.zoomControl._container}else{n=L.DomUtil.create("div","leaflet-bar")}this._createButton(this.options.title,t,n,this.toogleFullScreen,e);return n},_createButton:function(e,t,n,r,i){var s=L.DomUtil.create("a",t,n);s.href="#";s.title=e;L.DomEvent.addListener(s,"click",L.DomEvent.stopPropagation).addListener(s,"click",L.DomEvent.preventDefault).addListener(s,"click",r,i);L.DomEvent.addListener(n,fullScreenApi.fullScreenEventName,L.DomEvent.stopPropagation).addListener(n,fullScreenApi.fullScreenEventName,L.DomEvent.preventDefault).addListener(n,fullScreenApi.fullScreenEventName,this._handleEscKey,i);L.DomEvent.addListener(document,fullScreenApi.fullScreenEventName,L.DomEvent.stopPropagation).addListener(document,fullScreenApi.fullScreenEventName,L.DomEvent.preventDefault).addListener(document,fullScreenApi.fullScreenEventName,this._handleEscKey,i);return s},toogleFullScreen:function(){this._exitFired=false;var e=this._container;if(this._isFullscreen){if(fullScreenApi.supportsFullScreen){fullScreenApi.cancelFullScreen(e)}else{L.DomUtil.removeClass(e,"leaflet-pseudo-fullscreen")}this.invalidateSize();this.fire("exitFullscreen");this._exitFired=true;this._isFullscreen=false}else{if(fullScreenApi.supportsFullScreen){fullScreenApi.requestFullScreen(e)}else{L.DomUtil.addClass(e,"leaflet-pseudo-fullscreen")}this.invalidateSize();this.fire("enterFullscreen");this._isFullscreen=true}},_handleEscKey:function(){if(!fullScreenApi.isFullScreen(this)&&!this._exitFired){this.fire("exitFullscreen");this._exitFired=true;this._isFullscreen=false}}});L.Map.addInitHook(function(){if(this.options.fullscreenControl){this.fullscreenControl=L.control.fullscreen(this.options.fullscreenControlOptions);this.addControl(this.fullscreenControl)}});L.control.fullscreen=function(e){return new L.Control.FullScreen(e)};(function(){var e={supportsFullScreen:false,isFullScreen:function(){return false},requestFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",prefix:""},t="webkit moz o ms khtml".split(" ");if(typeof document.exitFullscreen!="undefined"){e.supportsFullScreen=true}else{for(var n=0,r=t.length;n<r;n++){e.prefix=t[n];if(typeof document[e.prefix+"CancelFullScreen"]!="undefined"){e.supportsFullScreen=true;break}}}if(e.supportsFullScreen){e.fullScreenEventName=e.prefix+"fullscreenchange";e.isFullScreen=function(){switch(this.prefix){case"":return document.fullScreen;case"webkit":return document.webkitIsFullScreen;default:return document[this.prefix+"FullScreen"]}};e.requestFullScreen=function(e){return this.prefix===""?e.requestFullscreen():e[this.prefix+"RequestFullScreen"](Element.ALLOW_KEYBOARD_INPUT)};e.cancelFullScreen=function(e){return this.prefix===""?document.exitFullscreen():document[this.prefix+"CancelFullScreen"]()}}if(typeof jQuery!="undefined"){jQuery.fn.requestFullScreen=function(){return this.each(function(){var t=jQuery(this);if(e.supportsFullScreen){e.requestFullScreen(t)}})}}window.fullScreenApi=e})()

d3.json("js/oasp.json", function(statesData) { 
  //Class for customizing icons on zoom
  var LeafIcon = L.Icon.extend({
      options: {
          iconSize:     [15, 23],
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
  function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //initialize map
  function initMap(statesData){
        // Added for stamen tiles
        var layer = new L.StamenTileLayer("toner-lite");
        var map = new L.Map('mapdiv', {
            //layers: [layer],
            center: new L.LatLng(39.16414, -97.99805),
            zoom: 5,
            fullscreenControl: true,
            fullscreenControlOptions: { // optional
                title:"Fullscreen"
            }
        });
        
        map.locate({setView: true, maxZoom: 6}); //zoom into user location
        map.addLayer(layer);

        return map;
    }

  function getColorAsian(d) {
    return d > 250000 ? '#800026' :
     d > 100000  ? '#BD0026' :
     d > 10000  ? '#E31A1C' :
     d > 5000  ? '#FC4E2A' :
     d > 1000   ? '#FD8D3C' :
     d > 500   ? '#FEB24C' :
     d > 250   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     isNaN(d) == true  ? '#ccc':
     d == 0 ?    '#ccc':
     '#ccc';
  }
  function getColorHawaiian(d) {
    return d > 50000 ? '#800026' :
     d > 20000  ? '#BD0026' :
     d > 10000  ? '#E31A1C' :
     d > 5000  ? '#FC4E2A' :
     d > 1000   ? '#FD8D3C' :
     d > 500   ? '#FEB24C' :
     d > 100   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     isNaN(d) == true  ? '#ccc':
     d == 0 ?    '#ccc':
     '#ccc';
  }
  function getColorBoth(d){
    //10, 250, 500, 1000, 5000, 10000, 200000, 500000
    return d > 500000 ? '#800026' :
     d > 200000  ? '#BD0026' :
     d > 10000  ? '#E31A1C' :
     d > 5000  ? '#FC4E2A' :
     d > 1000   ? '#FD8D3C' :
     d > 500   ? '#FEB24C' :
     d > 250   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     isNaN(d) == true  ? '#ccc':
     d == 0 ?    '#ccc':
     '#ccc';
  }
  function getColorJob(d) { 
    return d > 60 ? '#1F5C99' :
     d > 45  ? '#297ACC' :
     d > 30  ? '#47A3FF' :
     d > 20  ? '#47A3FF' :
     d > 10   ? '#70B8FF' :
     d > 5   ? '#B0D3FF' :
     d > 1   ? '#C8EAFF' :
     d >= 1    ? '#F3F7FF':
     isNaN(d) == true  ? '#1A1A1A':
     '#1A1A1A';
  }
  //Class for placing data on the map and tree map
  function buildMapData(statesData){
    
    function xAxisTooltip(e){
      // Grab the height of the generated tooltip
      var tmPopHeight = $(".leaflet-top.leaflet-right").height();
      var tmPopWidth = $(".leaflet-top.leaflet-right").width() / 2; 
      var tipBounds = {};
          tipBounds = e.pageX -305;

      tipBounds = detectBoundaries(tipBounds, "#mapdiv");

      if(tipBounds > 900){
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
    function treemapToolTip(popCount, sets, group, jobCount){
      // Grab the height of the generated tooltip
      var tmPopHeight = $("#treemapPopup").height();
      var tmPopWidth = $("#treemapPopup").width() / 2;

      // Style the title for the tooltip
      if(group == 'asian' && sets == 'jobcount'){
        $("#treemapPopup").css({"background": getColorAsian(popCount), "margin":0, "text-align":"center"});
      } else if(group == 'hawaiian' && sets == 'jobcount'){
        $("#treemapPopup").css({"background": getColorHawaiian(popCount), "margin":0, "text-align":"center"});
      }else{
        $("#treemapPopup").css({"background": getColorBoth(popCount), "margin":0, "text-align":"center"});
      }
      
      if(sets == 'populationcount'){
        $("#treemapPopup").css({"background": getColorJob(jobCount), "margin":0, "text-align":"center"});
      }
      
      // Position the tooltip based on mouse position
      $(document).mousemove(function(e){
        $("#treemapPopup").css({"left":e.pageX - tmPopWidth + "px","top":e.pageY - tmPopHeight-40 + "px", "opacity":0.9, "padding-bottom":"10px"});
      });
    } 
 
    function barChartToolTip(MSA, ratio, total){
      var label = "Job Center";

      if(total >1){
        label = "Job Centers";
      }

      $("#barchartPopup").show().html( "<strong>"+MSA +"</strong>: <br />"+
          numberWithCommas(total)+ " "+label+"<br />"+
          "<strong>People Per Job Center:</strong> "+numberWithCommas(Math.round(ratio))
      );

      // Grab the height of the generated tooltip
      var tmPopHeight = $("#barchartPopup").height();
      var tmPopWidth = $("#barchartPopup").width() / 2;

      // Position the tooltip based on mouse position
      $(document).mousemove(function(e){
        $("#barchartPopup").css({"left":e.pageX - tmPopWidth + "px","top":e.pageY - tmPopHeight-40 + "px", "opacity":0.9, "padding":"7px"});
      });
    }

    function forceClusterToolTip(data, threshold){
      var total = data.radius * threshold;
      $("#forceClusterPopup").show().html( "<strong>"+capitaliseFirstLetter(data.type) +"</strong>: <br />"+
          "Populaion: "+numberWithCommas(Math.floor(total))
      );

      // Grab the height of the generated tooltip
      var tmPopHeight = $("#forceClusterPopup").height();
      var tmPopWidth = $("#forceClusterPopup").width() / 2;

      // Position the tooltip based on mouse position
      $(document).mousemove(function(e){
        $("#forceClusterPopup").css({"left":e.pageX - tmPopWidth + "px","top":e.pageY - tmPopHeight-40 + "px", "opacity":0.9, "padding":"7px"});
      });
    }

    //Begin Choropleth code
    function choropleth(statesData, group){      
      function style(feature) {
        var ethnicGroup;
        //return dynamic legend
        switch(group){
          case 'hawaiian':
            ethnicGroup = feature.properties.hawaiian_pop;

            return {
              fillColor: getColorHawaiian(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColorHawaiian(ethnicGroup),
              //dashArray: '3',
              fillOpacity: 0.7,
              className: feature.properties.metro_area.replace(/[\W\s]/g,"")
            };
          break;
          case 'asian':
            ethnicGroup = feature.properties.asian_pop;

            return {
              fillColor: getColorAsian(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColorAsian(ethnicGroup),
              fillOpacity: 0.7,
              className: feature.properties.metro_area.replace(/[\W\s]/g,"")
            };
          break;
          case '':
            console.log("Group is not set.");
            return false;
          break;
          default:
            ethnicGroup = feature.properties.asian_pop + feature.properties.hawaiian_pop;

            return {
              fillColor: getColorBoth(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColorBoth(ethnicGroup),
              fillOpacity: 0.7,
              className: feature.properties.metro_area.replace(/[\W\s]/g,"")
            };
        }//end switch
      }
      
      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            //color: '#B7D2D2',
            color: '#000',
            dashArray: '1',
            fillOpacity: 2
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        var mapPolyIdChart = '.'+layer.feature.properties.metro_area.replace(/[\W\s]/g,"");
        var mapPolyId = '#'+layer.feature.properties.metro_area.replace(/[\W\s]/g,"");
        $(mapPolyId).addClass("treemapNodeHighlight");

        d3.select(".chart").selectAll(mapPolyIdChart)
            .attr("stroke","#ccc")
            .style("fill", "#3d3d3d")
            .attr("stroke-width",2);

        //Hover text update
        info.update(e.target.feature.properties);
      }

      function resetHighlight(e) {
        var layer = e.target;
        var mapPolyId = '#'+layer.feature.properties.metro_area.replace(/[\W\s]/g,"");
        var mapPolyIdChart = '.'+layer.feature.properties.metro_area.replace(/[\W\s]/g,"");
        
        geojson.resetStyle(layer);
        info.update();  

        $(mapPolyId).removeClass("treemapNodeHighlight");

        d3.select(".chart").selectAll(mapPolyIdChart)
            .attr("stroke","")
            .style("fill", "")
            .attr("stroke-width",1);
      }

      function zoomToFeature(e) {
          map.fitBounds(e.target.getBounds());
      }

      function mapToTreeIds(feature){
        return feature.properties.metro_area;
      }

      function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToFeature, 
        });
        /*layer.on({ //Adds a second tooltip to map
          mouseover: toolTip,
          mouseout: toolTipHide
        });*/      
      }
      //End Choropleth code

      var info = L.control();
      info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();

        return this._div;
      };

      //Method that we will use to update the control based on feature properties passed
      info.update = function (metroArea) {     
        var Data ='', jobCenters, jobCenterName;

        // Position the tooltip based on mouse position            
        if(metroArea){
          jobCenterName = metroArea.metro_area.split("_");
          jobCenters = "<br /><div id='dolOffices' style='background:"+getColorJob(metroArea.total_job_centers)+" '>"+
            "Total # of DOL-Sponsored Offices:"
            +metroArea.total_job_centers +"</div>";

          switch(group){
            case 'both':
              Data ='<br /> Asian Population: '+ numberWithCommas(metroArea.asian_pop)
              +'<br /> Pacific Islander Population: '+ numberWithCommas(metroArea.hawaiian_pop)+
              jobCenters;
            break;
            case 'asian':
              Data ='<br /> Asian Population: '+ numberWithCommas(metroArea.asian_pop)+
              jobCenters;
            break;
            case 'hawaiian':
              Data ='<br /> Pacific Islander Population: '+ numberWithCommas(metroArea.hawaiian_pop)+
              jobCenters;
            break;
          }  
        }
        
        this._div.innerHTML = '<div id="populationBox">'+
          '<h4>Asian and Pacific Islander Populations</h4>' +  
          (metroArea ?
              '<b> Metro Area: ' + jobCenterName[0]+ '</b>'+ Data
          : 'Hover over state metro areas (MSAs).') +
        '</div>';
      };
      info.addTo(map);

      geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature,
      }).addTo(map);
    } //end choropleth() class
    
    /* Build Legend Color Scale */
    function legendMap(group){
      var div = "<div class='info legend'>",
      labels = [], grades = [], i;

      if(group == "hawaiian"){
        grades = [1, 100, 500, 1000, 5000, 10000, 20000, 50000];

        // loop through our density intervals and generate a label 
        //with a colored square for each interval for legend
        //div.innerHTML +='<i style="background:#ccc"></i>No Data<br>';
        for (i = 0; i < grades.length; i++) {
            div +=
                '<i style="background:' + getColorHawaiian(grades[i] + 1) + '; clear:both"></i> ' +
                numberWithCommas(grades[i]) + (grades[i + 1] ? '&ndash;' + numberWithCommas(grades[i + 1]) + '<br>' : '+');
        }
        return div;
      }else if(group == "asian"){
        grades = [10, 250, 500, 1000, 5000, 10000, 100000, 250000];

        for (i = 0; i < grades.length; i++) {
            div +=
                '<i style="background:' + getColorAsian(grades[i] + 1) + '; clear:both"></i> ' +
                numberWithCommas(grades[i]) + (grades[i + 1] ? '&ndash;' + numberWithCommas(grades[i + 1]) + '<br>' : '+');
        }
        return div;
      }else{
        grades = [10, 250, 500, 1000, 5000, 10000, 200000, 500000];

        for (i = 0; i < grades.length; i++) {
            div +=
                '<i style="background:' + getColorBoth(grades[i] + 1) + '; clear:both"></i> ' +
                numberWithCommas(grades[i]) + (grades[i + 1] ? '&ndash;' + numberWithCommas(grades[i + 1]) + '<br>' : '+');
        }
        div+="</div>"

        return div;
      }        
    }

    //Main
    function main(statesData){
      $(".leaflet-top.leaflet-right").css({
        "right":0
      });

      $("#mapdiv").mousemove(function(e){
          xAxisTooltip(e);   
      });

      var group = 'both', sets = 'populationcount';
      barChart(statesData, group);
      treeMap(statesData, sets, group);
      choropleth(statesData, group);      
      
      $(".legendDiv").append(legendMap(group));
      $(".jobCenterSwitch").hide();
      $("#ethnicButtons input:radio[value=both]").prop('checked', true);

      //Group Switch
      $("#ethnicButtons input:radio[name=ethnic]").on( "click", function( event ) {
        var group = $(this).val().toLowerCase();
        map.removeLayer(geojson);
        $("#jobCenterButtons input:radio[value=populationcount]").prop('checked', true);

        //remove old legends when switching populations
        $(".legend").remove(); $(".info").remove(); 
        $("#treemap").remove();

        choropleth(statesData, group);
        treeMap(statesData, sets, group);
        $(".legendDiv").append(legendMap(group)); 
        $(".jobCenterSwitch").show();
        //Job Switch       
        $("#jobCenterButtons input:radio[name=jobC]").on( "click", function( event ) {
          var sets = $(this).val().toLowerCase();
          $("#treemap").remove();
 
          treeMap(statesData, sets, group);
        });
      });     
    }
    main(statesData);
    //End Main
    
    function barChart(statesData, group){//D3 Vis
      var width = 1200,
          height = 110,
          mapPolyId;

      var y = d3.scale.linear()
          .range([height, 0]);

      var chart = d3.select(".chart").append("svg")
        .attr("width", width)
        .attr("height", height);  

      var data = statesData.features;

      var filterData = data.filter(function(d){
        if(d.properties){
          if(d.properties.asian_pop || d.properties.hawaiian_pop){
            var total = d.properties.asian_pop + d.properties.hawaiian_pop;
            if(total > 20000)
              return d;
          }
        }
      });
      
      d3.select("#sort").on("click", sortBars);
      d3.select("#reset").on("click", reset);
      var sortOrder = false;

      var xScale = d3.scale.ordinal()
        .domain(d3.range(filterData.length))
        .rangeRoundBands([0, width], 0.5);

      y.domain([0, d3.max(filterData, function(d) {
        var total = d.properties.asian_pop + d.properties.hawaiian_pop;
        var ratio = total / d.properties.total_job_centers;          
        return ratio;    
      })]);
      
      var barWidth = width / filterData.length;      
   
      var bar = chart.selectAll("rect")
      .data(filterData)
      .enter().append("rect")
      .attr("x", function(d, i) {
        return xScale(i);
       }); 

      bar.attr("y", function(d) { 
          var total = d.properties.asian_pop + d.properties.hawaiian_pop;
          var ratio = total / d.properties.total_job_centers;          
          return y(ratio) - 10;
        })
        .attr("height", function(d) { 
          var total = d.properties.asian_pop + d.properties.hawaiian_pop;
          var ratio = total / d.properties.total_job_centers;          
          return ratio/100;
        })
        .attr("width", barWidth)
        .attr("id", "bar")
        .attr("class", function(d){
          return d.properties.metro_area.replace(/[\W\s]/g,"");
        });
      
      function sortBars(){
        sortOrder = !sortOrder;

        sortItems = function (a, b) {
          if (sortOrder) {
              return b.properties.total_job_centers - a.properties.total_job_centers;
          }
          return b.properties.total_job_centers - a.properties.total_job_centers;
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
                return d3.ascending(a.properties.metro_area, b.properties.metro_area);
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
    
      bar.on("mouseover", function (d) { 
        mapPolyId = '.'+d.properties.metro_area.replace(/[\W\s]/g,"");

        var total = d.properties.asian_pop + d.properties.hawaiian_pop;
        var ratio = total / d.properties.total_job_centers;
        var MSA = d.properties.metro_area;

        barChartToolTip(MSA, ratio, d.properties.total_job_centers);

        //add chart to map functionality
        d3.selectAll(".leaflet-zoom-animated").selectAll(mapPolyId)
          .attr("stroke-width",3.5)
          .attr("fill-opacity","1.0")
          .attr("stroke","#000"); 
      });

      bar.on("mouseout", function(d){
        mapPolyId = '.'+d.properties.metro_area.replace(/[\W\s]/g,"");
        //add chart to map functionality
        d3.selectAll(".leaflet-zoom-animated").selectAll(mapPolyId)
         .attr("fill-opacity","0.7")
         .attr("stroke","")
         .attr("stroke-width",0.7);
      });

      bar.on("click", function(d){
        var msaName = d.properties.metro_area;

        if($("#stateStats"))
            $("#stateStats").remove();
        
        d3.select("body").append("div").attr("id", "stateStats")
        .attr("title", msaName)
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

        forceCluster(d);
      });
    }//end D3 Vis 

    //Can be used to find a threshold to produce best ratio for display propotionality
    function thresholdToRatio(data){
      var threshold;
      console.log(data);
      //Faster than a switch statement
      if(data >= 50000 && data < 500000){       
        return threshold = 10000;
      }
      if(data < 50000){
        return threshold = 1000;
      }
      if(data >= 500000){
        return threshold = 100000;
      }
    }

    function forceCluster(data){
        var msaName = data.properties.metro_area,
            width = 680,
            height = 330,
            padding = 1.5, // separation between same-color circles
            clusterPadding = 6, // separation between different-color circles
            maxRadius = 12;

        var n = 3, // total number of circles
            m = 3; // number of distinct clusters

        var colorArr = new Array();
        colorArr["both"] = "#99CCFF"; 
        colorArr["asian"] = "#FF3333"; 
        colorArr["hawaiian"] = "#FFA319";

        // The largest node for each cluster.
        var clusters = new Array(m);
        //var threshold = thresholdToRatio(data.properties.aapi_pop);
        var threshold = 10000;

        var nodes = [
          {cluster: 0, radius: data.properties.aapi_pop/threshold, type: "both"},
          {cluster: 1, radius: data.properties.asian_pop/threshold, type: "asian"},
          {cluster: 2, radius: data.properties.hawaiian_pop/threshold, type: "hawaiian"}
          /*{"cluster":2,"radius":10.6180680659922448},
          {"cluster":0,"radius":30.3575295077569},
          {"cluster":1,"radius":10.9569281165554346}*/
        ];

        nodes.forEach(function(d) { 
          clusters[d.cluster] = d; 
        });
        
        // Use the pack layout to initialize node positions.
        /*d3.layout.pack()
          .sort(null)
          .size([width, height])
          .children(function(d) { return d.values; })
          .value(function(d) { return d.radius * d.radius; })
          .nodes({values: d3.nest()
            .key(function(d) { return d.cluster; })
            .entries(nodes)});*/
               
        var force = d3.layout.force()
            .nodes(nodes)
            .size([width, height])
            .gravity(.02)
            .charge(0)
            .on("tick", tick)
            .start();

        var svg = d3.select("#stateStats").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "nodes");

        var circle = svg.selectAll("circle")
            .data(nodes)
          .enter().append("circle")
            .attr("r", function(d) {  
              return d.radius; })
            .attr("title", function(d){
              return d.type;
            })
            .attr("class", "node")
            .style("fill", function(d) { 
             //return color(d.cluster); 
             return colorArr[d.type];
            })
            .call(force.drag);

        circle.transition()
        .duration(750)
        .delay(function(d, i) { return i * 5; })
        .attrTween("r", function(d) {
          var i = d3.interpolate(0, d.radius);
          return function(t) { return d.radius = i(t); };
        });

        circle.on("mouseover", function (d) {
          var data = d;

          forceClusterToolTip(data, threshold);
        });
        circle.on("mouseout", function(d){ $('#forceClusterPopup').hide(); });

        function tick(e) {
          circle
              .each(cluster(10 * e.alpha * e.alpha))
              .each(collide(.5))
              .attr("cx", function(d) {  
                return d.x; })
              .attr("cy", function(d) {  
                return d.y; });
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
    }
    
    function treeMap(statesData, sets, group){
      var margin = {top: -20, right: 0, bottom: 10, left: 0},
        width = 1197 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

      var color = d3.scale.category20c();
      var root = statesData.features, newRoot = [], i, msaData; 
      
      //Create new object for tree map
      var msa = {name: "metro_areas", children:[]};
      for(i=0; i < root.length; i++){
        msaData = {name:root[i].properties.metro_area, 
          metro_area:root[i].properties.metro_area,
          job_centers: root[i].properties.total_job_centers, populus:group, 
          asian:root[i].properties.asian_pop,
          pacific_islander: root[i].properties.hawaiian_pop,
          total_pop:root[i].properties.aapi_pop,
          children: [
            {name: "jobcenters", size: root[i].properties.total_job_centers},
          ]
        } 

        msa.children.push(msaData);             
      } 
      newRoot.push(msa);

      var treemap = d3.layout.treemap()
        .size([width, height])
        .sticky(true)
        .value(function(d) { 
          return d.size; 
        });

      var div = d3.select("#dashboardA").append("div")
        .style("position", "relative")
        .attr("id", "treemap")
        .style("width", (width + margin.left + margin.right) + "px")
        .style("height", (height + margin.top + margin.bottom) + "px")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

      var node = div.datum(newRoot[0]).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("rect")
          .attr("class", "node")
          .attr("id", function(d){
            return d.metro_area ? d.metro_area.replace(/[\W\s]/g,""): null;
          })
          .call(position)
          .on("mouseover",function (d) {
            var group = d.parent.populus, text, popCount, mapPolyId, jobCenterName;
            
            if(d.parent.metro_area){             
              mapPolyId = '.'+d.parent.metro_area.replace(/[\W\s]/g,"")
              jobCenterName = d.parent.metro_area.split("_");
            }
            
            if(group == "hawaiian"){ 
              popCount = d.parent.pacific_islander;           
              text = "<strong>Pacific Islander Population:</strong> "+
                numberWithCommas(popCount);
            }else if(group == "asian"){
              popCount = d.parent.asian;  
              text = "<strong>Asian Population:</strong> "+
                numberWithCommas(popCount);
            }else{
              popCount = d.parent.total_pop;  
              text = "<strong>Both Populations:</strong> "+
                numberWithCommas(popCount);
            }

            $("#treemapPopup").show().html(
              "<p>DOL-Sponsored Offices / Metro Area.<br />"
              +"<strong>"+jobCenterName[0] +"</strong><br />"+ text +'</p>'
            ); 

            treemapToolTip(popCount, sets, group, d.size);

            //add tree to map functionality
            d3.selectAll(".leaflet-zoom-animated").selectAll(mapPolyId)
              .attr("stroke-width",6)
              .attr("fill-opacity","1.0")
              .attr("stroke","#000");            
          }
      )
      .on("mouseout",function (d) {
          var mapPolyId = '.'+d.parent.metro_area.replace(/[\W\s]/g,"");

          d3.selectAll(".leaflet-zoom-animated").selectAll(mapPolyId)
            .attr("fill-opacity","0.7")
            .attr("stroke","")
            .attr("stroke-width",1);
        }
      );

      //Tree map transition
      node.transition().duration(1500);

      if(sets == 'populationcount'){
        node.text(function(d) { 
          if(d.size > 0){
            return d.parent.job_centers;
          }             
        })
        .style("font-weight","bold")
        .style("line-height","20px")
        .style("color","#fff");

        if(group == 'asian'){
          node.style("background", function(d) {                      
            if(d.asian){ 
              return getColorAsian(d.asian);                 
            }  
          });
        }else if(group == 'hawaiian'){
          node.style("background", function(d) {  
            if(d.pacific_islander){     
              return getColorHawaiian(d.pacific_islander);                                       
            }  
          });
        }else{
          node.style("background", function(d) {                      
            if(d.total_pop){ 
              return getColorBoth(d.total_pop);                 
            }  
          });
        }
      }
      if(sets == 'jobcount'){
        node.text(function(d) { 
            if(d.size > 0){
              return d.parent.job_centers;
            }             
          })
          .style("line-height","20px")
          .style("font-weight","bold")
          .style("color","#000")
          .style("background", function(d) {            
          if(d.size)
            return getColorJob(d.size); 
        });  
      }  

      function position() {
        this.style("left", function(d) { return d.x + "px"; })
            .style("top", function(d) { return d.y + "px"; })
            .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
            .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
      }
    }//end treeMap
  }

  function getPoints(statesData){
    $.ajax({
      url: "js/oshaReginalAndWhdDistrictOffices.json",
      dataType:'json',
      type: 'GET',
    }).done(function(data){
        //Create map points and Geometry for layer > 2
        function populate(pointsBucket){
          var generic, marker, oshaoffice, whdoffice, jobCentersComp, jobCentersCorps, jobCentersAffiliate;
          var controlSearch = new L.Control.Search({layer: markers, initial: false, zoom:13});
          
          controlSearch.on('search_locationfound', function(e) {      
            if(e.layer._popup)
              e.layer.openPopup();
          });

          map.addControl(controlSearch);

          for(w=0; w < pointsBucket.length; w++){
              var firstWord = pointsBucket[w].TYPE.split(" ");
              var loc = [pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE],
                  title = pointsBucket[w].NAME;

              switch(pointsBucket[w].TYPE){
                case "OSHA Area Office":
                  oshaoffice = new LeafIcon({iconUrl: 'js/img/oshaOffice.png'});
                  marker = L.marker(
                    new L.latLng(loc), 
                    {title: title, icon: oshaoffice}
                  );
                  break;
                case "WHD District Office":
                  whdoffice = new LeafIcon({iconUrl: 'js/img/whdOffice.png'});
                  marker = L.marker(
                    new L.latLng(loc), 
                    {title: title, icon: whdoffice}
                  );
                  break;
                case "Comprehensive":
                  jobCentersComp = new LeafIcon({iconUrl: 'js/img/jobCentersComp.png'});
                  marker = L.marker(
                    new L.latLng(loc), 
                    {title: title, icon: jobCentersComp}
                  );
                  break;
                case "Job Corps Center":
                  jobCentersCorps = new LeafIcon({iconUrl: 'js/img/jobCentersCorps.png'});
                  marker = L.marker(
                    new L.latLng(loc), 
                    {title: title, icon: jobCentersCorps}
                  );
                  break;
                case "Affiliate":
                  jobCentersAffiliate = new LeafIcon({iconUrl: 'js/img/jobCentersAffiliate.png'});
                  marker = L.marker(
                    new L.latLng(loc), 
                    {title: title, icon: jobCentersAffiliate}
                  );
                  break;
                default:
                  generic = new LeafIcon({iconUrl: 'js/img/jobCentersOther.png'});
                  marker = L.marker(
                    new L.latLng(loc), 
                    {title: title, icon: generic}
                  );
              }
                 
              marker.bindPopup(
                  "<strong>Type: "+pointsBucket[w].TYPE+"</strong><br />"
                  +pointsBucket[w].NAME+"<br />"
                  +pointsBucket[w].Street_Address+"<br />"
                  +pointsBucket[w].City+","
                  +pointsBucket[w].State+", "
                  +pointsBucket[w].Zip+"<br />"
                );                   
            markers.addLayer(marker);
          }
          map.removeLayer(markers);
          return false;
        }
        
        //Begin Layer 2 and 3 Intigration
        var pointsBucket = data,           
            jsonPoint = L.geoJson(pointsBucket, {
            filter: function(feature, layer) {
                return feature.properties.show_on_map;
            },
        });
        populate(pointsBucket);  
        
        var legendPoints = L.control({position: 'bottomright'});
        legendPoints.onAdd = function(map){
          var div = L.DomUtil.create('div', 'info2 legend2');
            div.innerHTML +='<i style="background:#CCFF33"></i>OSHA Area Office<br>';
            div.innerHTML +='<i style="background:#00FF00"></i>WHD District Office<br>';
            div.innerHTML +='<i style="background:#0099FF"></i>Affiliate Job Center<br>';           
            div.innerHTML +='<i style="background:#CC3300"></i>Comprehensive Job Center<br>';
            div.innerHTML +='<i style="background:#3B0737"></i>Job Corps Center<br>';
            
          return div;
        }  
        legendPoints.addTo(map); $(".info2").hide();  
        //END Layer 2 Construction    
    });
    //Zoom based Data Traversal method
    map.on('zoomend', function(e){
      if(map.getZoom() >= 6){                 
          map.addLayer(markers);           
          $(".info2").show();
      }
      // Add circles with job count
      if(map.getZoom() < 7){
          map.removeLayer(markers);
          $(".info2").hide();
      }
      if(map.getZoom() > 6){ 
        $(".info").hide(); 
        $(".ethnicSwitch").hide(); 
      }else{ 
        $(".info").show(); 
        $(".ethnicSwitch").show();
      } 
      if(map.getZoom() >= 7){ map.removeLayer(geojson); }//order matters

      if(map.getZoom() == 6 || map.getZoom() <= 5){ map.addLayer(geojson); }  
    });
  }//End getPoints()
  
  function onMapClick(e) {//Coordinate pop up
    popup.setLatLng(e.latlng)
         .setContent("Coordinates clicked are: " + e.latlng.toString())
         .openOn(map);
  }
  //map.on('click', onMapClick);
  var popup = L.popup();
  var map = initMap();
  var markers = L.markerClusterGroup(), polyData;
 
  buildMapData(statesData);
  getPoints(statesData);
});       