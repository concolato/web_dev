L.Control.FullScreen=L.Control.extend({options:{position:"topleft",title:"Full Screen",forceSeparateButton:false},onAdd:function(e){var t="leaflet-control-zoom-fullscreen",n;if(e.zoomControl&&!this.options.forceSeparateButton){n=e.zoomControl._container}else{n=L.DomUtil.create("div","leaflet-bar")}this._createButton(this.options.title,t,n,this.toogleFullScreen,e);return n},_createButton:function(e,t,n,r,i){var s=L.DomUtil.create("a",t,n);s.href="#";s.title=e;L.DomEvent.addListener(s,"click",L.DomEvent.stopPropagation).addListener(s,"click",L.DomEvent.preventDefault).addListener(s,"click",r,i);L.DomEvent.addListener(n,fullScreenApi.fullScreenEventName,L.DomEvent.stopPropagation).addListener(n,fullScreenApi.fullScreenEventName,L.DomEvent.preventDefault).addListener(n,fullScreenApi.fullScreenEventName,this._handleEscKey,i);L.DomEvent.addListener(document,fullScreenApi.fullScreenEventName,L.DomEvent.stopPropagation).addListener(document,fullScreenApi.fullScreenEventName,L.DomEvent.preventDefault).addListener(document,fullScreenApi.fullScreenEventName,this._handleEscKey,i);return s},toogleFullScreen:function(){this._exitFired=false;var e=this._container;if(this._isFullscreen){if(fullScreenApi.supportsFullScreen){fullScreenApi.cancelFullScreen(e)}else{L.DomUtil.removeClass(e,"leaflet-pseudo-fullscreen")}this.invalidateSize();this.fire("exitFullscreen");this._exitFired=true;this._isFullscreen=false}else{if(fullScreenApi.supportsFullScreen){fullScreenApi.requestFullScreen(e)}else{L.DomUtil.addClass(e,"leaflet-pseudo-fullscreen")}this.invalidateSize();this.fire("enterFullscreen");this._isFullscreen=true}},_handleEscKey:function(){if(!fullScreenApi.isFullScreen(this)&&!this._exitFired){this.fire("exitFullscreen");this._exitFired=true;this._isFullscreen=false}}});L.Map.addInitHook(function(){if(this.options.fullscreenControl){this.fullscreenControl=L.control.fullscreen(this.options.fullscreenControlOptions);this.addControl(this.fullscreenControl)}});L.control.fullscreen=function(e){return new L.Control.FullScreen(e)};(function(){var e={supportsFullScreen:false,isFullScreen:function(){return false},requestFullScreen:function(){},cancelFullScreen:function(){},fullScreenEventName:"",prefix:""},t="webkit moz o ms khtml".split(" ");if(typeof document.exitFullscreen!="undefined"){e.supportsFullScreen=true}else{for(var n=0,r=t.length;n<r;n++){e.prefix=t[n];if(typeof document[e.prefix+"CancelFullScreen"]!="undefined"){e.supportsFullScreen=true;break}}}if(e.supportsFullScreen){e.fullScreenEventName=e.prefix+"fullscreenchange";e.isFullScreen=function(){switch(this.prefix){case"":return document.fullScreen;case"webkit":return document.webkitIsFullScreen;default:return document[this.prefix+"FullScreen"]}};e.requestFullScreen=function(e){return this.prefix===""?e.requestFullscreen():e[this.prefix+"RequestFullScreen"](Element.ALLOW_KEYBOARD_INPUT)};e.cancelFullScreen=function(e){return this.prefix===""?document.exitFullscreen():document[this.prefix+"CancelFullScreen"]()}}if(typeof jQuery!="undefined"){jQuery.fn.requestFullScreen=function(){return this.each(function(){var t=jQuery(this);if(e.supportsFullScreen){e.requestFullScreen(t)}})}}window.fullScreenApi=e})()

d3.json("blackBox/js/data/oasp.json", function(statesData) { 
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

  function legendHideShow(){
    if(map.getZoom() > 6){ $(".legendDiv").hide(); }else{ $(".legendDiv").show();}
  }

  //initialize map
  function initMap(statesData){
    // Added for stamen tiles
    var map = new L.Map('mapdiv', {
      //layers: [layer],
      center: new L.LatLng(39.16414, -97.99805),
      zoom: 4,
      fullscreenControl: true,
      fullscreenControlOptions: { // optional
        title:"Fullscreen"
      }
    });

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Developed By <a href="http://enforcedata.dol.gov" target="new">DOL:CTO Enforce Data Team</a> | Data source: ACS 5-year estimates (2008-2012), <a href="http://www.census.gov/acs/" target="new">www.census.gov/acs</a>'
    }).addTo(map);

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
  function getColorSubCat(d){
    //10, 250, 500, 2000, 5000, 7000, 25000, 100000
    return d > 10000 ? '#800026' :
     d > 2500  ? '#BD0026' :
     d > 700  ? '#E31A1C' :
     d > 500  ? '#FC4E2A' :
     d > 200   ? '#FD8D3C' :
     d > 50   ? '#FEB24C' :
     d > 25   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     isNaN(d) == true  ? '#ccc':
     d == 0 ?    '#ccc':
     '#ccc';
  }
  function getColor1_45RangePercent(d){
    //1, 10, 15, 20, 25, 30, 35, 45
    return d > 45 ? '#800026' :
     d > 35  ? '#BD0026' :
     d > 30  ? '#E31A1C' :
     d > 25  ? '#FC4E2A' :
     d > 20   ? '#FD8D3C' :
     d > 15   ? '#FEB24C' :
     d > 10   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     d > 0    ? '#FFEDA0':
     isNaN(d) == true  ? '#ccc':
     d == 0 ?    '#ccc':
     '#ccc';
  }
  function getColor1_55RangePercent(d){
    //1, 10, 30, 35, 40, 45, 50, 55
    return d > 55 ? '#800026' :
     d > 50  ? '#BD0026' :
     d > 45  ? '#E31A1C' :
     d > 40  ? '#FC4E2A' :
     d > 35   ? '#FD8D3C' :
     d > 30   ? '#FEB24C' :
     d > 10   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     d > 0    ? '#FFEDA0':
     isNaN(d) == true  ? '#ccc':
     d == 0 ?    '#ccc':
     '#ccc';
  }
  function getColor1_8RangePercent(d){
    //1, 2, 3, 4, 5, 7, 8, 9
    return d > 8 ? '#800026' :
     d > 7  ? '#BD0026' :
     d > 6  ? '#E31A1C' :
     d > 5  ? '#FC4E2A' :
     d > 4   ? '#FD8D3C' :
     d > 3   ? '#FEB24C' :
     d > 2   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     d > 0    ? '#FFEDA0':
     isNaN(d) == true  ? '#ccc':
     d == 0 ?    '#ccc':
     '#ccc';
  }
  function getColor1_25RangePercent(d){
    //1, 2, 3, 5, 10, 15, 20, 25
    return d > 25 ? '#800026' :
     d > 20  ? '#BD0026' :
     d > 15  ? '#E31A1C' :
     d > 10  ? '#FC4E2A' :
     d > 5   ? '#FD8D3C' :
     d > 3   ? '#FEB24C' :
     d > 2   ? '#FED976' :
     d > 1    ? '#FFEDA0':
     d > 0    ? '#FFEDA0':
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
  function getColorBothTreeM(d){
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

      if(tipBounds > 690){
        $(".leaflet-top.leaflet-right").css({
          "right":0, "width":"355px",
          "top":0, "opacity":0.9, "padding-bottom":"15px"
        });
      }else if(tipBounds < 90){
        $(".leaflet-top.leaflet-right").css({
          "left":25, "width":"355px",
          "top":0, "opacity":0.9, "padding-bottom":"15px"
        });
      }else{
        $(".leaflet-top.leaflet-right").css({
          "left":tipBounds, "width":"355px",
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

    //Begin Choropleth code
    function choropleth(statesData, group){ 
      function style(feature) {
        var ethnicGroup;
        var MSAClassName = feature.properties.metro_area.replace(/[\W\s]/g,"")+"-"+feature.properties.stusps;
        
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
              className: MSAClassName
            };
          break;
          case 'hawaiian_age_18_24':
            ethnicGroup = feature.properties.hawaiian_age_18_24;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_age_25_54':
            ethnicGroup = feature.properties.hawaiian_age_25_54;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_age_55_over':
            ethnicGroup = feature.properties.hawaiian_age_55_over;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_disability':
            ethnicGroup = feature.properties.hawaiian_disability;
    
            return {
              fillColor: getColor1_8RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_8RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_edu_less_than_high':
            ethnicGroup = feature.properties.hawaiian_edu_less_than_high;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_edu_high_ged':
            ethnicGroup = feature.properties.hawaiian_edu_high_ged;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_edu_some_college':
            ethnicGroup = feature.properties.hawaiian_edu_some_college;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_edu_college_higher':
            ethnicGroup = feature.properties.hawaiian_edu_college_higher;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_male':
            ethnicGroup = feature.properties.hawaiian_male;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_female':
            ethnicGroup = feature.properties.hawaiian_female;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_lang_prof':
            ethnicGroup = feature.properties.hawaiian_lang_prof;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_poverty':
            ethnicGroup = feature.properties.hawaiian_poverty;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'hawaiian_unemployment':
            ethnicGroup = feature.properties.hawaiian_unemployment;

            return {
              fillColor: getColor1_25RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_25RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          //Asian
          case 'asian':
            ethnicGroup = feature.properties.asian_pop;

            return {
              fillColor: getColorAsian(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColorAsian(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_age_18_24':
            ethnicGroup = feature.properties.asian_age_18_24;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_age_25_54':
            ethnicGroup = feature.properties.asian_age_25_54;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_age_55_over':
            ethnicGroup = feature.properties.asian_age_55_over;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_disability':
            ethnicGroup = feature.properties.asian_disability;

            return {
              fillColor: getColor1_8RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_8RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_edu_less_than_high':
            ethnicGroup = feature.properties.asian_edu_less_than_high;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_edu_high_ged':
            ethnicGroup = feature.properties.asian_edu_high_ged;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_edu_some_college':
            ethnicGroup = feature.properties.asian_edu_some_college;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_edu_college_higher':
            ethnicGroup = feature.properties.asian_edu_college_higher;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_male':
            ethnicGroup = feature.properties.asian_male;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_female':
            ethnicGroup = feature.properties.asian_female;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_lang_prof':
            ethnicGroup = feature.properties.asian_lang_prof;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_poverty':
            ethnicGroup = feature.properties.asian_poverty;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'asian_unemployment':
            ethnicGroup = feature.properties.asian_unemployment;

            return {
              fillColor: getColor1_25RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_25RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          //Both
          case 'both_age_18_24':
            ethnicGroup = feature.properties.both_age_18_24;
            
            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_age_25_54':
            ethnicGroup = feature.properties.both_age_25_54;
            
            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_age_55_over':
            ethnicGroup = feature.properties.both_age_55_over;
            
            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_disability':
            ethnicGroup = feature.properties.both_disability;

            return {
              fillColor: getColor1_8RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_8RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_edu_less_than_high':
            ethnicGroup = feature.properties.both_edu_less_than_high;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_edu_high_ged':
            ethnicGroup = feature.properties.both_edu_high_ged;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_edu_some_college':
            ethnicGroup = feature.properties.both_edu_some_college;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_edu_college_higher':
            ethnicGroup = feature.properties.both_edu_college_higher;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_male':
            ethnicGroup = feature.properties.both_male;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_female':
            ethnicGroup = feature.properties.both_female;

            return {
              fillColor: getColor1_55RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_55RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_lang_prof':
            ethnicGroup = feature.properties.both_lang_prof;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_poverty':
            ethnicGroup = feature.properties.both_poverty;

            return {
              fillColor: getColor1_45RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_45RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
            };
          break;
          case 'both_unemployment':
            ethnicGroup = feature.properties.both_unemployment;

            return {
              fillColor: getColor1_25RangePercent(ethnicGroup),
              weight: 1,
              opacity: .5,
              color: getColor1_25RangePercent(ethnicGroup),
              fillOpacity: 0.7,
              className: MSAClassName
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
              className: MSAClassName
            };
        }//end switch
      }
      
      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#000',
            dashArray: '1',
            fillOpacity: 2
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }

        var mapPolyId = '#'+layer.feature.properties.metro_area.replace(/[\W\s]/g,"")+"-"+layer.feature.properties.stusps;
        $(mapPolyId).addClass("treemapNodeHighlight");
        //Hover text update
        info.update(e.target.feature.properties);
      }

      function resetHighlight(e) {
        var layer = e.target;
        var mapPolyId = '#'+layer.feature.properties.metro_area.replace(/[\W\s]/g,"")+"-"+layer.feature.properties.stusps;
        
        geojson.resetStyle(layer);
        info.update();       
        $(mapPolyId).removeClass("treemapNodeHighlight");
      }

      function zoomToFeature(e) {
          map.fitBounds(e.target.getBounds());
          resetHighlight(e);
      }

      function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight, 
            click: zoomToFeature, 
        });     
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
        var Data ='', jobCenters, jobCenterName, asianPopFormated, hawaiianPopFormated;

        // Position the tooltip based on mouse position            
        if(metroArea){
          jobCenterName = metroArea.metro_area.split("_");
          jobCenters = "<br /><div id='dolOffices' style='background:"+getColorJob(metroArea.job_center_count)+" '>"+
            "Total # of DOL-sponsored Offices: "
            +metroArea.job_center_count +"</div>"+
            "&nbsp; Enforcement Offices: "+metroArea.enforcement_count +" <br />"+
            "&nbsp; Services Offices: "+metroArea.one_stop_count;

          asianPopFormated = '<br /> Asian Population: '+ numberWithCommas(metroArea.asian_pop);
          hawaiianPopFormated = '<br /> Pacific Islander Population: '+ numberWithCommas(metroArea.hawaiian_pop);

          switch(group){
            case 'both':
              Data = asianPopFormated +hawaiianPopFormated
              +jobCenters;
            break;
            case 'both_age_18_24':
              Data =asianPopFormated +hawaiianPopFormated
              +'<br /> Ages 18-24: '+numberWithCommas(metroArea.both_age_18_24_raw) 
              +' or '+ metroArea.both_age_18_24+'%'
              +jobCenters;

            break;
            case 'both_age_25_54':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Ages 25-54: '+numberWithCommas(metroArea.both_age_25_54_raw)
              +' or '+ metroArea.both_age_25_54+'%'
              +jobCenters;
            break;
            case 'both_age_55_over':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Ages 55 and Over: '+numberWithCommas(metroArea.both_age_55_over_raw)
              +' or '+ metroArea.both_age_55_over+'%'
              +jobCenters;
            break;
            case 'both_disability':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Persons with a Disability: '+numberWithCommas(metroArea.both_disability_raw)
              +' or '+ metroArea.both_disability+'%'
              +jobCenters;
            break;
            case 'both_edu_less_than_high':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Less Than High School Diploma: '+numberWithCommas(metroArea.both_edu_less_than_high_raw)
              +' or '+ metroArea.both_edu_less_than_high+'%'
              +jobCenters;
            break;
            case 'both_edu_high_ged':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> High School Graduate or GED: '+numberWithCommas(metroArea.both_edu_high_ged_raw)
              +' or '+ metroArea.both_edu_high_ged+'%'
              +jobCenters;
            break;
            case 'both_edu_some_college':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Some College or Associate\'s Degree: '+numberWithCommas(metroArea.both_edu_some_college_raw)
              +' or '+ metroArea.both_edu_some_college+'%'
              +jobCenters;
            break;
            case 'both_edu_college_higher':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Bachelor\'s Degree or Higher: '+numberWithCommas(metroArea.both_edu_college_higher_raw)
              +' or '+ metroArea.both_edu_college_higher+'%'
              +jobCenters;
            break;
            case 'both_male':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Male: '+numberWithCommas(metroArea.both_male_raw)
              +' or '+ metroArea.both_male+'%'
              +jobCenters;
            break;
            case 'both_female':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Female: '+numberWithCommas(metroArea.both_female_raw)
              +' or '+ metroArea.both_female+'%'
              +jobCenters;
            break;
            case 'both_lang_prof':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Speaks English Less Than "Very Well": '+numberWithCommas(metroArea.both_lang_prof_raw)
              +' or '+ metroArea.both_lang_prof+'%'
              +jobCenters;
            break;
            case 'both_poverty':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br />Below The Poverty Level: '+ metroArea.both_poverty+'%'
              +jobCenters;
            break;
            case 'both_unemployment':
              Data = asianPopFormated +hawaiianPopFormated
              +'<br /> Unemployment Rate: '+ metroArea.both_unemployment+'%'
              +jobCenters;
            break;

            case 'asian':
              Data = asianPopFormated + jobCenters;
            break;
            case 'asian_age_18_24':
              Data = asianPopFormated
              +'<br /> Ages 18-24: '+numberWithCommas(metroArea.asian_age_18_24_raw)
              +' or '+ metroArea.asian_age_18_24+'%'
              +jobCenters;
            break;
            case 'asian_age_25_54':
              Data = asianPopFormated
              +'<br /> Ages 25-54: '+numberWithCommas(metroArea.both_age_25_54_raw)
              +' or '+ metroArea.both_age_25_54+'%'
              +jobCenters;
            break;
            case 'asian_age_55_over':
              Data = asianPopFormated
              +'<br /> Ages 55 and Over: '+numberWithCommas(metroArea.both_age_55_over_raw)
              +' or '+ metroArea.both_age_55_over+'%'
              +jobCenters;
            break;
            case 'asian_disability':
              Data = asianPopFormated
              +'<br /> Persons with a Disability: '+numberWithCommas(metroArea.asian_disability_raw)
              +' or '+ metroArea.asian_disability+'%'
              +jobCenters;
            break;
            case 'asian_edu_less_than_high':
              Data = asianPopFormated
              +'<br /> Less Than High School Diploma: '+numberWithCommas(metroArea.asian_edu_less_than_high_raw)
              +' or '+ metroArea.asian_edu_less_than_high+'%'
              +jobCenters;
            break;
            case 'asian_edu_high_ged':
              Data = asianPopFormated
              +'<br /> High School Graduate or GED: '+numberWithCommas(metroArea.asian_edu_high_ged_raw)
              +' or '+ metroArea.asian_edu_high_ged+'%'
              +jobCenters;
            break;
            case 'asian_edu_some_college':
              Data = asianPopFormated
              +'<br /> Some College or Associate\'s Degree: '+numberWithCommas(metroArea.asian_edu_some_college_raw)
              +' or '+ metroArea.asian_edu_some_college+'%'
              +jobCenters;
            break;
            case 'asian_edu_college_higher':
              Data = asianPopFormated
              +'<br /> Bachelor\'s Degree or Higher: '+numberWithCommas(metroArea.asian_edu_college_higher_raw)
              +' or '+ metroArea.asian_edu_college_higher+'%'
              +jobCenters;
            break;
            case 'asian_male':
              Data = asianPopFormated
              +'<br /> Male: '+numberWithCommas(metroArea.asian_male_raw)
              +' or '+ metroArea.asian_male+'%'
              +jobCenters;
            break;
            case 'asian_female':
              Data = asianPopFormated
              +'<br /> Female: '+numberWithCommas(metroArea.asian_female_raw)
              +' or '+ metroArea.asian_female+'%'
              +jobCenters;
            break;
            case 'asian_lang_prof':
              Data = asianPopFormated
              +'<br /> Speaks English Less Than "Very Well": '+numberWithCommas(metroArea.asian_lang_prof_raw)
              +' or '+ metroArea.asian_lang_prof+'%'
              +jobCenters;
            break;
            case 'asian_poverty':
              Data = asianPopFormated
              +'<br />Below The Poverty Level: '+ metroArea.asian_poverty+'%'
              +jobCenters;
            break;
            case 'asian_unemployment':
              Data = asianPopFormated
              +'<br /> Unemployment Rate: '+ metroArea.asian_unemployment+'%'
              +jobCenters;
            break;

            case 'hawaiian':
              Data = hawaiianPopFormated + jobCenters;
            break;
            case 'hawaiian_age_18_24':
              Data =hawaiianPopFormated
              +'<br /> Ages 18-24: '+numberWithCommas(metroArea.hawaiian_age_18_24_raw)
              +' or '+ metroArea.hawaiian_age_18_24+'%'
              +jobCenters;
            break;
            case 'hawaiian_age_25_54':
              Data =hawaiianPopFormated
              +'<br /> Ages 25-54: '+numberWithCommas(metroArea.hawaiian_age_25_54_raw)
              +' or '+ metroArea.hawaiian_age_25_54+'%'
              +jobCenters;
            break;
            case 'hawaiian_age_55_over':
              Data =hawaiianPopFormated
              +'<br /> Ages 55 and Over: '+numberWithCommas(metroArea.hawaiian_age_55_over_raw)
              +' or '+ metroArea.hawaiian_age_55_over+'%'
              +jobCenters;
            break;
            case 'hawaiian_disability':
              Data =hawaiianPopFormated
              +'<br /> Persons with a Disability: '+numberWithCommas(metroArea.hawaiian_disability_raw)
              +' or '+ metroArea.hawaiian_disability+'%'
              +jobCenters;
            break;
            case 'hawaiian_edu_less_than_high':
              Data =hawaiianPopFormated
              +'<br /> Less Than High School Diploma: '+numberWithCommas(metroArea.hawaiian_edu_less_than_high_raw)
              +' or '+ metroArea.hawaiian_edu_less_than_high+'%'
              +jobCenters;
            break;
            case 'hawaiian_edu_high_ged':
              Data =hawaiianPopFormated
              +'<br /> High School Graduate or GED: '+numberWithCommas(metroArea.hawaiian_edu_high_ged_raw)
              +' or '+ metroArea.hawaiian_edu_high_ged+'%'
              +jobCenters;
            break;
            case 'hawaiian_edu_some_college':
              Data =hawaiianPopFormated
              +'<br /> Some College or Associate\'s Degree: '+numberWithCommas(metroArea.hawaiian_edu_some_college_raw)
              +' or '+ metroArea.hawaiian_edu_some_college+'%'
              +jobCenters;
            break;
            case 'hawaiian_edu_college_higher':
              Data =hawaiianPopFormated
              +'<br /> Bachelor\'s Degree or Higher: '+numberWithCommas(metroArea.hawaiian_edu_college_higher_raw)
              +' or '+ metroArea.hawaiian_edu_college_higher+'%'
              +jobCenters;
            break;
            case 'hawaiian_male':
              Data =hawaiianPopFormated
              +'<br /> Male: '+numberWithCommas(metroArea.hawaiian_male_raw)
              +' or '+ metroArea.hawaiian_male+'%'
              +jobCenters;
            break;
            case 'hawaiian_female':
              Data =hawaiianPopFormated
              +'<br /> Female: '+numberWithCommas(metroArea.hawaiian_female_raw)
              +' or '+ metroArea.hawaiian_female+'%'
              +jobCenters;
            break;
            case 'hawaiian_lang_prof':
              Data =hawaiianPopFormated
              +'<br /> Speaks English Less Than "Very Well": '+numberWithCommas(metroArea.hawaiian_lang_prof_raw)
              +' or '+ metroArea.hawaiian_lang_prof+'%'
              +jobCenters;
            break;
            case 'hawaiian_poverty':
              Data =hawaiianPopFormated
              +'<br />Below The Poverty Level: '+ metroArea.hawaiian_poverty+'%'
            break;
            case 'hawaiian_unemployment':
              Data =hawaiianPopFormated
              +'<br /> Unemployment Rate: '+ metroArea.hawaiian_unemployment+'%'
              +jobCenters;
            break;
          }  
        }
        
        this._div.innerHTML = '<div id="populationBox">'+  
          (metroArea ?
              '<b> Metro Area: ' + jobCenterName[0]+ '</b>'+ Data
          : 'Hover over state metro areas.') +
        '</div>';
      };
      info.addTo(map);

      geojson = L.geoJson(statesData, {
        style: style,
        onEachFeature: onEachFeature,
        zoomend:resetHighlight
      }).addTo(map);
    } //end choropleth() class
    
    /* Build Legend Color Scale */
    function legendMap(group){
      var div = "<div class='info legend'>",
      labels = [], grades = [], i;

      group = nodeDetect(group);

      div +='<i style="background:#ccc"></i>0<br>';
      if(group == "hawaiian"){
        grades = [1, 100, 500, 1000, 5000, 10000, 20000, 50000];

        // loop through our density intervals and generate a label 
        //with a colored square for each interval for legend
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
      }else if(group == "1_45Percent"){
        
        grades = [1, 10, 15, 20, 25, 30, 35, 45];

        for (i = 0; i < grades.length; i++) {
            div +=
                '<i style="background:' + getColor1_45RangePercent(grades[i] + 1) + '; clear:both"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%<br>' : '+');
        }
        return div;
      }else if(group == "1_25Percent"){
        
        grades = [1, 2, 3, 5, 10, 15, 20, 25];

        for (i = 0; i < grades.length; i++) {
            div +=
                '<i style="background:' + getColor1_25RangePercent(grades[i] + 1) + '; clear:both"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%<br>' : '+');
        }
        return div;
      }else if(group == "1_55Percent"){ 
        
        grades = [1, 10, 30, 35, 40, 45, 50, 55];

        for (i = 0; i < grades.length; i++) {
            div +=
                '<i style="background:' + getColor1_55RangePercent(grades[i] + 1) + '; clear:both"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%<br>' : '+');
        }
        return div;
      }else if(group == "1_8Percent"){
        
        grades = [1, 2, 3, 4, 5, 7, 8, 9];

        for (i = 0; i < grades.length; i++) {
            div +=
                '<i style="background:' + getColor1_8RangePercent(grades[i] + 1) + '; clear:both"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '%<br>' : '+');
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

    function nodeDetect(group){
      if(group.search(/hawaiian/i) > -1){
        if(group.search(/hawaiian_/i) > -1){
          
          if(group.search(/_male/i) > -1 || group.search(/_female/i) > -1 || group.search(/_age_25_54/i) > -1){
            group = "1_55Percent";
          }else if(group.search(/_disability/i) > -1){
            group = "1_8Percent";
          }else if(group.search(/_unemployment/i) > -1){
            group = "1_25Percent";
          }else{
            group = "1_45Percent";
          }
        }else{
          group = "hawaiian";
        }        
      } else if(group.search(/asian/i) > -1){
        if(group.search(/asian_/i) > -1){

          if(group.search(/_male/i) > -1 || group.search(/_female/i) > -1 || group.search(/_age_25_54/i) > -1){
            group = "1_55Percent";
          }else if(group.search(/_disability/i) > -1){
            group = "1_8Percent";
          }else if(group.search(/_unemployment/i) > -1){
            group = "1_25Percent";
          }else{
            group = "1_45Percent";
          }         
        }else{
          group = "asian";
        }
      }else if(group.search(/both/i) > -1){
        if(group.search(/both_/i) > -1){
          
          if(group.search(/_male/i) > -1 || group.search(/_female/i) > -1 || group.search(/_age_25_54/i) > -1){
            group = "1_55Percent";
          }else if(group.search(/_disability/i) > -1){
            group = "1_8Percent";
          }else if(group.search(/_unemployment/i) > -1){
            group = "1_25Percent";
          }else{
            group = "1_45Percent";
          }    
        }else{
          group = "both";
        }
      }else{
        console.log("group is not set.");
      }
      return group;
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

      choropleth(statesData, group);
      treeMap(statesData, sets, group, group); //Yes this has an order to the chaos - general and specific groups

      $(".legendDiv").append(legendMap(group));

      $("#ethnicButtons input:radio[value=both]").prop('checked', true);
      $("#jobCenterButtons input:checkbox").prop('checked', false);
      $("#treemap").hide();

      //Group Switch
      $("#ethnicButtons input:radio[name=ethnic]").on( "click", function( event ) {
        var group = $(this).val().toLowerCase();
        map.removeLayer(geojson);
        $("#jobCenterButtons input:checkbox").prop('checked', false);

        //remove old legends when switching populations
        $(".legend").remove(); $(".info").remove(); 
        $("#treemap").remove();
        legendHideShow();    

        choropleth(statesData, group);
        zoomMech(); 

        if(group.search(/hawaiian/i) > -1){        
            treegroup = "hawaiian";                
        } else if(group.search(/asian/i) > -1){
            treegroup = "asian";         
        }else{
          treegroup = "both";
        }

        treeMap(statesData, sets, treegroup, group);
        
        $(".legendDiv").append(legendMap(group)); 
        $(".jobCenterSwitch").show();
        //Hide Treemap
        $("#treemap").hide();       
      });
      //Treemap Switch       
      $("#jobCenterButtons input:checkbox[name=jobC]").on( "click", function( event ) {
        //Hide Treemap
        if($("#jobCenterButtons input:checkbox:checked").length > 0){
          $("#treemap").fadeIn(1500);
          $(".legend").show();
        }else{
          $("#treemap").fadeOut(1000);
          if(map.getZoom() > 5){ $(".legend").hide(); }
        }    
      });
    }
    main(statesData);
    //End Main

    function treeMap(statesData, sets, group, colorgroup){
      var margin = {top: 1, right: 0, bottom: 10, left: 0},
        width = 1200 - margin.left - margin.right,
        height = 558 - margin.top - margin.bottom; //515

      var color = d3.scale.category20c();
      var root = statesData.features, newRoot = [], i, msaData; 
      
      //Create new object for tree map      
      var msa = {name: "metro_areas", children:[]};
      for(i=0; i < root.length; i++){
        msaData = {name:root[i].properties.metro_area, 
          metro_area:root[i].properties.metro_area,
          stusps: root[i].properties.stusps,
          job_centers: root[i].properties.job_center_count, populus:group, 
          enforcement_count: root[i].properties.enforcement_count,
          one_stop_count: root[i].properties.one_stop_count,

          asian:root[i].properties.asian_pop,
          asian_age_18_24: root[i].properties.asian_age_18_24,
          asian_age_25_54: root[i].properties.asian_age_25_54,
          asian_age_55_over: root[i].properties.asian_age_55_over,
          asian_disability: root[i].properties.asian_disability,
          asian_edu_less_than_high: root[i].properties.asian_edu_less_than_high,
          asian_edu_high_ged: root[i].properties.asian_edu_high_ged,
          asian_edu_some_college: root[i].properties.asian_edu_some_college,
          asian_edu_college_higher: root[i].properties.asian_edu_college_higher,
          asian_lang_prof: root[i].properties.asian_lang_prof,
          asian_male: root[i].properties.asian_male,
          asian_female: root[i].properties.asian_female,
          asian_poverty: root[i].properties.asian_poverty,
          asian_unemployment: root[i].properties.asian_unemployment,

          pacific_islander: root[i].properties.hawaiian_pop,
          hawaiian_age_18_24: root[i].properties.hawaiian_age_18_24,
          hawaiian_age_25_54: root[i].properties.hawaiian_age_25_54,
          hawaiian_age_55_over: root[i].properties.hawaiian_age_55_over,
          hawaiian_disability: root[i].properties.hawaiian_disability,
          hawaiian_edu_less_than_high: root[i].properties.hawaiian_edu_less_than_high,
          hawaiian_edu_high_ged: root[i].properties.hawaiian_edu_high_ged,
          hawaiian_edu_some_college: root[i].properties.hawaiian_edu_some_college,
          hawaiian_edu_college_higher: root[i].properties.hawaiian_edu_college_higher,
          hawaiian_lang_prof: root[i].properties.hawaiian_lang_prof,
          hawaiian_male: root[i].properties.hawaiian_male,
          hawaiian_female: root[i].properties.hawaiian_female,
          hawaiian_poverty: root[i].properties.hawaiian_poverty,
          hawaiian_unemployment: root[i].properties.hawaiian_unemployment,

          total_pop:root[i].properties.aapi_pop,
          both_age_18_24: root[i].properties.both_age_18_24,
          both_age_25_54: root[i].properties.both_age_25_54,
          both_age_55_over: root[i].properties.both_age_55_over,
          both_disability: root[i].properties.both_disability,
          both_edu_less_than_high: root[i].properties.both_edu_less_than_high,
          both_edu_high_ged: root[i].properties.both_edu_high_ged,
          both_edu_some_college: root[i].properties.both_edu_some_college,
          both_edu_college_higher: root[i].properties.both_edu_college_higher,
          both_lang_prof: root[i].properties.both_lang_prof,
          both_male: root[i].properties.both_male,
          both_female: root[i].properties.both_female,
          both_poverty: root[i].properties.both_poverty,
          both_unemployment: root[i].properties.both_unemployment,

          children: [
            {name: "jobcenters", size: root[i].properties.job_center_count},
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
        .style("margin", "auto")
        .style("left", margin.left + "px")
        .style("top", margin.top + "px");

      var node = div.datum(newRoot[0]).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("rect")
          .attr("class", "node")
          .attr("id", function(d){
            return d.metro_area ? d.metro_area.replace(/[\W\s]/g,"")+"-"+d.stusps: null;
          })
          .call(position)
          .on("mouseover",function (d) {
            var group = d.parent.populus, text, popCount, mapPolyId, treeMapPolyId, jobCenterName;
            
            if(d.parent.metro_area){
              mapPolyId = '.'+d.parent.metro_area.replace(/[\W\s]/g,"")+"-"+d.parent.stusps;
              jobCenterName = d.parent.metro_area.split("_");
            }

            treeMapPolyId = '#'+d.parent.metro_area.replace(/[\W\s]/g,"")+"-"+d.parent.stusps;

            if(group == "hawaiian"){ 
              popCount = d.parent.pacific_islander;           
              text = "<strong>Total Pacific Islander Population:</strong> "+
                numberWithCommas(popCount);
            }else if(group == "asian"){
              popCount = d.parent.asian;  
              text = "<strong>Total Asian Population:</strong> "+
                numberWithCommas(popCount);
            }else{
              popCount = d.parent.total_pop;  
              text = "<strong>Total Both Populations:</strong> "+
                numberWithCommas(popCount);
            }

            $("#treemapPopup").show().html(
              "<p>DOL-Sponsored Offices / Metro Area.<br />"
              +"<strong>"+jobCenterName[0] +", "+d.parent.stusps+"</strong><br />"+ text +'</p>'
            ); 

            treemapToolTip(popCount, sets, group, d.size);

            //add tree to map functionality
            d3.select("svg").selectAll(mapPolyId)
              .attr("stroke-width",6)
              .attr("fill-opacity","1.0")
              .attr("stroke","#000");         
          }
      )
      .on("mouseout",function (d) {
          var mapPolyId = '.'+d.parent.metro_area.replace(/[\W\s]/g,"")+"-"+d.parent.stusps;
          var treeMapPolyId = '#'+d.parent.metro_area.replace(/[\W\s]/g,"")+"-"+d.parent.stusps;

          d3.select("svg").selectAll(mapPolyId)
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

        if(colorgroup == 'asian'){
          node.style("background", function(d) {                      
            if(d.asian){ 
              return getColorAsian(d.asian);                 
            }  
          });
        }else if(colorgroup == 'asian_age_18_24'){
          node.style("background", function(d) {  
            if(d.asian_age_18_24){     
              return getColor1_45RangePercent(d.asian_age_18_24);                                       
            }  
          });
        }else if(colorgroup == 'asian_age_25_54'){
          node.style("background", function(d) {  
            if(d.asian_age_25_54){     
              return getColor1_55RangePercent(d.asian_age_25_54);                                       
            }  
          });
        }else if(colorgroup == 'asian_age_55_over'){
          node.style("background", function(d) {  
            if(d.asian_age_55_over){     
              return getColor1_45RangePercent(d.asian_age_55_over);                                       
            }  
          });
        }else if(colorgroup == 'asian_disability'){
          node.style("background", function(d) {  
            if(d.asian_disability){     
              return getColor1_45RangePercent(d.asian_disability); //                             
            }  
          });
        }else if(colorgroup == 'asian_lang_prof'){
          node.style("background", function(d) {  
            if(d.asian_lang_prof){     
              return getColor1_45RangePercent(d.asian_lang_prof);                                       
            }  
          });
        }else if(colorgroup == 'asian_edu_less_than_high'){
          node.style("background", function(d) {  
            if(d.asian_edu_less_than_high){     
              return getColor1_45RangePercent(d.asian_edu_less_than_high);                                       
            }  
          });
        }else if(colorgroup == 'asian_edu_high_ged'){
          node.style("background", function(d) {  
            if(d.asian_edu_high_ged){     
              return getColor1_45RangePercent(d.asian_edu_high_ged);                                       
            }  
          });
        }else if(colorgroup == 'asian_edu_some_college'){
          node.style("background", function(d) {  
            if(d.asian_edu_some_college){     
              return getColor1_45RangePercent(d.asian_edu_some_college);                                       
            }  
          });
        }else if(colorgroup == 'asian_edu_college_higher'){
          node.style("background", function(d) {  
            if(d.asian_edu_college_higher){     
              return getColor1_45RangePercent(d.asian_edu_college_higher);                                       
            }  
          });
        }else if(colorgroup == 'asian_male'){
          node.style("background", function(d) {  
            if(d.asian_male){     
              return getColor1_55RangePercent(d.asian_male);                                       
            }  
          });
        }else if(colorgroup == 'asian_female'){
          node.style("background", function(d) {  
            if(d.asian_female){     
              return getColor1_55RangePercent(d.asian_female);                                       
            }  
          });
        }else if(colorgroup == 'asian_poverty'){
          node.style("background", function(d) {  
            if(d.asian_poverty){     
              return getColor1_45RangePercent(d.asian_poverty);                                       
            }  
          });
        }else if(colorgroup == 'asian_unemployment'){
          node.style("background", function(d) {  
            if(d.asian_unemployment){     
              return getColor1_25RangePercent(d.asian_unemployment);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian'){
          node.style("background", function(d) {  
            if(d.pacific_islander){     
              return getColorHawaiian(d.pacific_islander);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_age_18_24'){
          node.style("background", function(d) {  
            if(d.hawaiian_age_18_24){     
              return getColor1_45RangePercent(d.hawaiian_age_18_24);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_age_18_24'){
          node.style("background", function(d) {  
            if(d.hawaiian_age_18_24){     
              return getColor1_45RangePercent(d.hawaiian_age_18_24);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_age_25_54'){
          node.style("background", function(d) {  
            if(d.hawaiian_age_25_54){     
              return getColor1_55RangePercent(d.hawaiian_age_25_54);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_age_55_over'){
          node.style("background", function(d) {  
            if(d.hawaiian_age_55_over){     
              return getColor1_45RangePercent(d.hawaiian_age_55_over);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_disability'){
          node.style("background", function(d) {  
            if(d.hawaiian_disability){     
              return getColor1_45RangePercent(d.hawaiian_disability);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_lang_prof'){
          node.style("background", function(d) {  
            if(d.hawaiian_lang_prof){     
              return getColor1_45RangePercent(d.hawaiian_lang_prof);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_edu_less_than_high'){
          node.style("background", function(d) {  
            if(d.hawaiian_edu_less_than_high){     
              return getColor1_45RangePercent(d.hawaiian_edu_less_than_high);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_edu_high_ged'){
          node.style("background", function(d) {  
            if(d.hawaiian_edu_high_ged){     
              return getColor1_45RangePercent(d.hawaiian_edu_high_ged);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_edu_some_college'){
          node.style("background", function(d) {  
            if(d.hawaiian_edu_some_college){     
              return getColor1_45RangePercent(d.hawaiian_edu_some_college);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_edu_college_higher'){
          node.style("background", function(d) {  
            if(d.hawaiian_edu_college_higher){     
              return getColor1_45RangePercent(d.hawaiian_edu_college_higher);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_male'){
          node.style("background", function(d) {  
            if(d.hawaiian_male){     
              return getColor1_55RangePercent(d.hawaiian_male);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_female'){
          node.style("background", function(d) {  
            if(d.hawaiian_female){     
              return getColor1_55RangePercent(d.hawaiian_female);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_poverty'){
          node.style("background", function(d) {  
            if(d.hawaiian_poverty){     
              return getColor1_45RangePercent(d.hawaiian_poverty);                                       
            }  
          });
        }else if(colorgroup == 'hawaiian_unemployment'){
          node.style("background", function(d) {  
            if(d.hawaiian_unemployment){     
              return getColor1_25RangePercent(d.hawaiian_unemployment);                                       
            } 
          }); 
         }else if(colorgroup == 'both_age_18_24'){
          node.style("background", function(d) {  
            if(d.both_age_18_24){     
              return getColor1_45RangePercent(d.both_age_18_24);                                       
            }  
          });
        }else if(colorgroup == 'both_age_25_54'){
          node.style("background", function(d) {  
            if(d.both_age_25_54){     
              return getColor1_55RangePercent(d.both_age_25_54);                                       
            }  
          });
        }else if(colorgroup == 'both_age_55_over'){
          node.style("background", function(d) {  
            if(d.both_age_55_over){     
              return getColor1_45RangePercent(d.both_age_55_over);                                       
            }  
          });
        }else if(colorgroup == 'both_disability'){
          node.style("background", function(d) {  
            if(d.both_disability){     
              return getColor1_45RangePercent(d.both_disability);                                       
            }  
          });
        }else if(colorgroup == 'both_lang_prof'){
          node.style("background", function(d) {  
            if(d.both_lang_prof){     
              return getColor1_45RangePercent(d.both_lang_prof);                                       
            }  
          });
        }else if(colorgroup == 'both_edu_less_than_high'){
          node.style("background", function(d) {  
            if(d.both_edu_less_than_high){     
              return getColor1_45RangePercent(d.both_edu_less_than_high);                                       
            }  
          });
        }else if(colorgroup == 'both_edu_high_ged'){
          node.style("background", function(d) {  
            if(d.both_edu_high_ged){     
              return getColor1_45RangePercent(d.both_edu_high_ged);                                       
            }  
          });
        }else if(colorgroup == 'both_edu_some_college'){
          node.style("background", function(d) {  
            if(d.both_edu_some_college){     
              return getColor1_45RangePercent(d.both_edu_some_college);                                       
            }  
          });
        }else if(colorgroup == 'both_edu_college_higher'){
          node.style("background", function(d) {  
            if(d.both_edu_college_higher){     
              return getColor1_45RangePercent(d.both_edu_college_higher);                                       
            }  
          });
        }else if(colorgroup == 'both_male'){
          node.style("background", function(d) {  
            if(d.both_male){     
              return getColor1_55RangePercent(d.both_male);                                       
            }  
          });
        }else if(colorgroup == 'both_female'){
          node.style("background", function(d) {  
            if(d.both_female){     
              return getColor1_55RangePercent(d.both_female);                                       
            }  
          });
        }else if(colorgroup == 'both_poverty'){
          node.style("background", function(d) {  
            if(d.both_poverty){     
              return getColor1_45RangePercent(d.both_poverty);                                       
            }  
          });
        }else if(colorgroup == 'both_unemployment'){
          node.style("background", function(d) {  
            if(d.both_unemployment){     
              return getColor1_25RangePercent(d.both_unemployment);                                       
            }  
          });
        }else{
          node.style("background", function(d) {                      
            if(d.total_pop){ 
              return getColorBothTreeM(d.total_pop);                 
            }  
          });
        }
      }
      //End tree map transition

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
      url: "blackBox/js/data/oshaReginalAndWhdDistrictOffices.json",
      dataType:'json',
      type: 'GET',
    }).done(function(data){
        //Create map points and Geometry for layer > 2
        pointsDataProcess(data);
    });

    $.ajax({
      url: "blackBox/js/data/oshaReginalAndWhdDistrictOffices2.json",
      dataType:'json',
      type: 'GET',
    }).done(function(data){
        //Create map points and Geometry for layer > 2, second "thread"
        pointsDataProcess(data);
    });

     var legendPoints = L.control({position: 'bottomleft'});
        legendPoints.onAdd = function(map){
          var div = L.DomUtil.create('div', 'info2 legend2');
            div.innerHTML +='<i style="background:#CCFF33"></i>OSHA Area Office<br>';
            div.innerHTML +='<i style="background:#00CC66"></i>OFCCP Regional/Area/District Office<br>';         
            div.innerHTML +='<i style="background:#66CCFF"></i>Comprehensive Job Center<br>';        
            div.innerHTML +='<i style="background:#0099FF"></i>Affiliate Job Center<br>'; 
            div.innerHTML +='<i style="background:#A352CC"></i>EBSA Regional/District Office<br>';
            div.innerHTML +='<i style="background:#FF00FF"></i>WHD District Office<br>'; //#FF0066
            div.innerHTML +='<i style="background:#3B0737"></i>Job Corps Center<br>';           
                        
          return div;
        }  
        legendPoints.addTo(map); $(".info2").hide();
    //Zoom based Data Traversal method
    map.on('zoomend', function(e){
      zoomMech();
    });
    //Zoom based Data Traversal method
    map.on('zoomend', function(e){
      zoomMech();
    });
  }//End getPoints()

  function pointsDataProcess(data){
    function populate(pointsBucket){
          var generic, marker, oshaoffice, whdoffice, jobCentersComp, jobCentersCorps, jobCentersAffiliate;

          for(w=0; w < pointsBucket.length; w++){
              var firstWord = pointsBucket[w].TYPE.split(" ");

              if(pointsBucket[w].TYPE.indexOf("OFCCP") >= 0){
                pointsBucket[w].TYPE = "OFCCP Office";
              }

              if(pointsBucket[w].TYPE.indexOf("EBSA") >= 0){
                pointsBucket[w].TYPE = "EBSA Office";
              }

              switch(pointsBucket[w].TYPE){               
                case "OSHA Area Office":
                  oshaoffice = new LeafIcon({iconUrl: 'blackBox/js/images/oshaOffice.png'});
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: oshaoffice}
                  );
                  
                break;
                case "WHD District Office":
                  whdoffice = new LeafIcon({iconUrl: 'blackBox/js/images/whdOffice.png'});
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: whdoffice}
                  );
                  
                break;
                case "Comprehensive Job Center":
                  jobCentersComp = new LeafIcon({iconUrl: 'blackBox/js/images/jobCentersComp.png'});
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: jobCentersComp}
                  );
                  
                break;
                case "Job Corps Center":
                  jobCentersCorps = new LeafIcon({iconUrl: 'blackBox/js/images/jobCentersCorps.png'});
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: jobCentersCorps}
                  );
                  
                break;
                case "Affiliate Job Center":
                  jobCentersAffiliate = new LeafIcon({iconUrl: 'blackBox/js/images/jobCentersAffiliate.png'});
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: jobCentersAffiliate}
                  );
                  
                break;
                case "OFCCP Office":
                  jobCentersOFCCP = new LeafIcon({iconUrl: 'blackBox/js/images/jobCentersOFCCP.png'});
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: jobCentersOFCCP}
                  );
                  
                break;                             
                case "EBSA Office":
                  jobCentersEBSA = new LeafIcon({iconUrl: 'blackBox/js/images/jobCentersEBSA.png'});
                  
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: jobCentersEBSA}
                  );
                  
                break;
                default:
                  generic = new LeafIcon({iconUrl: 'blackBox/js/images/jobCentersOther.png'});
               
                  marker = L.marker(
                    new L.LatLng(pointsBucket[w].LATITUDE, 
                        pointsBucket[w].LONGITUDE), 
                    {icon: generic}
                  );
                  
              }

              marker.bindPopup(
                "<strong>Type: "+pointsBucket[w].TYPE+"</strong><br />"
                +pointsBucket[w].NAME+"<br />"
                +pointsBucket[w].Street_Address+"<br />"
                +pointsBucket[w].City+", "
                +pointsBucket[w].State+", "
                +pointsBucket[w].Zip+"<br />"
              );                   
            markers.addLayer(marker);
          }
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
        //END Layer 2 Construction
  }
  
  function zoomMech(){
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

      if(map.getZoom() == 6 || map.getZoom() <= 5){ 
        map.addLayer(geojson); 
      }  

      legendHideShow();
  }
  
  function onMapClick(e) {//Coordinate pop up
    popup.setLatLng(e.latlng)
         .setContent("Coordinates clicked are: " + e.latlng.toString())
         .openOn(map);
  }
  //map.on('click', onMapClick);
  var popup = L.popup();
  var map = initMap();
  var markers = new L.FeatureGroup(), polyData;
  var div = L.DomUtil.get('mapControls');

  if (!L.Browser.touch) {
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
  } else {
    L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);
  }

  buildMapData(statesData);
  getPoints(statesData);
});       