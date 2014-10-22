<!DOCTYPE html>
<html>
<head>
<title>Dynamic Searchable Map Example 1</title>
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />

<style>
	#map { height: 480px; }
  #searchBox{
    width: 270px; 
    float: left; position: relative; 
    z-index: 999; 
    background: #fff; 
    top: 90px;
    padding: 5px;
  }
.search-button{
  background: url('css/images/search-icon-lrg.png');
  border-radius: 4px;
  height: 26px;
  width: 22px;
  display: block;
  float: right;
}
.mapdatainput{

}
</style>
</head>
<body>

<div id="map">
  <div id="searchBox"> 
    <lable for="geodatainput">  
      <input type="search" id="geodatainput" class="mapdatainput" name="mapsearch"> 
      <a class="search-button" href="#" title="search" id="mapsearch"></a>  
    </lable>
  </div>
</div>

<script src="http://code.jquery.com/jquery-2.1.0.min.js"></script>
<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
<script>
//give State name and get back center lat long
function stateCenterPoint(stateName){
  var latLong = [];

  switch(stateName){
    case "Alabama":
    case "AL":
      latLong = [32.318231, -86.902298];
    break;
    case "Alaska":
    case "AK":
      latLong = [64.200841, -149.493673];
    break;
    case "American Samoa":
    case "AS":
      latLong = [-14.306407, -170.695018];
    break;
    case "Arizona":
    case "AZ":
      latLong = [34.048928, -111.093731];
    break;
    case "California":
    case "CA":
      latLong = [36.778261, -119.417932];
    break;
    case "Colorado":
    case "CO":
      latLong = [39.550051, -105.782067];
    break;
    case "Commonwealth of the Northern Mariana Islands":
    case "MP":
    case "CNMI":
      latLong = [15.097900, 145.673900];
    break;
    case "Connecticut":
    case "CT":
      latLong = [41.603221, -73.087749];
    break;
    case "Delaware":
    case "DE":
      latLong = [38.910832, -75.527670];
    break;
    case "District of Columbia":
    case "DC":
      latLong = [38.907192, -77.036871];
    break;
    case "Florida":
    case "FL":
      latLong = [38.910832, -75.527670];
    break;
    case "Georgia":
    case "GA":
      latLong = [32.165622, -82.900075];
    break;
    case "Hawaii":
    case "HI":
      latLong = [19.896766, -155.582782];
    break;
    case "Idaho":
    case "ID":
      latLong = [44.068202, -114.742041];
    break;
    case "Illinois":
    case "IL":
      latLong = [40.633125, -89.398528];
    break;
    case "Indiana":
    case "IN":
      latLong = [40.267194, -86.902298];
    break;
    case "Iowa":
    case "IA":
      latLong = [41.878003, -93.097702];
    break;
    case "Kansas":
    case "KS":
      latLong = [39.011902 , -98.484246];
    break;
    case "Kentucky":
    case "KY":
      latLong = [37.839333 , -84.270018];
    break;
    case "Louisiana":
    case "LA":
      latLong = [30.984298 , -91.962333];
    break;
    case "Maine":
    case "ME":
      latLong = [45.253783 , -69.445469];
    break;
    case "Maryland":
    case "MD":
      latLong = [39.045755 , -76.641271];
    break;
    case "Massachusetts":
    case "MA":
      latLong = [42.407211 , -71.382437];
    break;
    case "Michigan":
    case "MI":
      latLong = [44.314844 , -85.602364];
    break;
    case "Minnesota":
    case "MN":
      latLong = [46.729553 , -94.685900];
    break;
    case "Mississippi":
    case "MS":
      latLong = [32.354668 , -89.398528];
    break;
    case "Missouri":
    case "MO":
      latLong = [37.964253 , -91.831833];
    break;
    case "Montana":
    case "MT":
      latLong = [46.879682 , -110.362566];
    break;
    case "Nebraska":
    case "NE":
      latLong = [41.492537 , -99.901813];
    break;
    case "Nevada":
    case "NV":
      latLong = [38.802610 , -116.419389];
    break;
    case "New Hampshire":
    case "NH":
      latLong = [43.193852 , -71.572395];
    break;
    case "New Jersey":
    case "NJ":
      latLong = [40.058324 , -74.405661];
    break;
    case "New Mexico":
    case "NM":
      latLong = [34.519940 , -105.870090];
    break;
    case "New York":
    case "NY":
      latLong = [40.712784 , -74.005941];
    break;
    case "North Carolina":
    case "NC":
      latLong = [35.759573 , -79.019300];
    break;
    case "North Dakota":
    case "ND":
      latLong = [47.551493 , -101.002012];
    break;
    case "Ohio":
    case "OH":
      latLong = [40.417287 , -82.907123];
    break;
    case "Oklahoma":
    case "OK":
      latLong = [35.467560 , -97.516428];
    break;
    case "Oregon":
    case "OR":
      latLong = [43.804133 , -120.554201];
    break;
    case "Pennsylvania":
    case "PA":
      latLong = [41.203322 , -77.194525];
    break;
    case "Rhode Island":
    case "RI":
      latLong = [41.580095 , -71.477429];
    break;
    case "South Carolina":
    case "SC":
      latLong = [33.836081 , -81.163725];
    break;
    case "South Dakota":
    case "SD":
      latLong = [43.969515 , -99.901813];
    break;
    case "Tennessee":
    case "TN":
      latLong = [35.517491 , -86.580447];
    break;
    case "Texas":
    case "TZ":
      latLong = [31.968599 , -99.901813];
    break;
    case "Utah":
    case "UT":
      latLong = [39.320980 , -111.093731];
    break;
    case "Vermont":
    case "VT":
      latLong = [44.558803 , -72.577841];
    break;
    case "Virginia":
    case "VA":
      latLong = [37.431573 , -78.656894];
    break;
    case "Washington":
    case "WA":
      latLong = [47.751074 , -120.740139];
    break;
    case "West Virginia":
    case "WV":
      latLong = [38.597626 , -80.454903];
    break;
    case "Wisconsin":
    case "WI":
      latLong = [43.784440 , -88.787868];
    break;
    case "Wyoming":
    case "WY":
      latLong = [43.075968 , -107.290284];
    break;
    case "Puerto Rico":
    case "PR":
      latLong = [18.220833 , -66.590149];
    break;
    case "Guam":
    case "GU":
      latLong = [13.444304 , 144.793731];
    break;
    case "United States Virgin Islands":
    case "VI":
      latLong = [18.335765 , -64.896335];
    break;
    default:
      latLong = [39.16414, -97.99805];
    break;
  }

  return latLong;
}

var stateLatLong = stateCenterPoint("AZ");


// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([stateLatLong[0], stateLatLong[1]], 6);

$("#mapsearch").click(function(){
  var data;

  data = $('#geodatainput').val();
  console.log(data);
  
  stateLatLong = stateCenterPoint(data);
  console.log(stateLatLong);
  map.setView([stateLatLong[0], stateLatLong[1]], 6);
  
});

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
	</script>
</body>
</html>