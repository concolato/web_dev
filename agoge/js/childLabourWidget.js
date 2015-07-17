 // Load in the ILAB (DoL), World Bank, and UNICEF data and call the draw function
  d3.json("js/data/workingChildData.json", draw);

  function draw(ilabData){
    var feature, x, y, i;
    x = 310;
    y = 280;
    
    var projection = d3.geo.azimuthal()
        .scale(280)
        .origin([-71.03,42.37])
        .mode("orthographic")
        .translate([x, y]); // x and y screen position

    var circle = d3.geo.greatCircle()
        .origin(projection.origin());

    // TODO fix d3.geo.azimuthal to be consistent with scale
    var scale = {
      orthographic: 380,
      stereographic: 380,
      gnomonic: 380,
      equidistant: 580 / Math.PI * 2,
      equalarea: 580 / Math.SQRT2
    };

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#globe").append("svg:svg")
        .attr("width", 650)
        .attr("height", 570)
        .style("top", 55);

    /*if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){
        svg.style("margin", "auto")
        .style("position", "fixed")
        .style("margin-top", "-150px");
    }else{
        svg.style("margin", 0)
        .style("position", "absolute");  
    }*/   
    
    svg.on("mousedown", mousedown);
    
    //Build the background for globe. 
    //Note: Have to set svg tag height along with y value to move up or down
    var backgroundCircle = svg.append("circle")
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', projection.scale())
        .attr("filter", "url(#glow)")
        .attr("fill", "url(#gradBlue)")
        .style("cursor", "move");

    // Color scale for Child Labour statistics for globe
    var colorCL = d3.scale.linear().range(['#fca6a1', '#5A0903']);//'#c2362e']);//'#FFCDCD', '#CF0000']); //was #FF0303
    var profileTItle = 'Global Profile';
    
    // Load the geography information for the globe
    d3.json("js/world-countries.json", function(collection) {       
       //Build Tree Map WIth Custom Colors
      var colorArr = new Array();
        colorArr["Agricultural Products"] = "#31a354"; 
        colorArr["Animal & Animal Products"] = "#9ecae1"; 
        colorArr["Aromatics"] = "#75A319"; 
        colorArr["Biofuels"] = "#5C5C5C"; 
        colorArr["Cigarette Manufacturing"] = "#fd8d3c"; 
        colorArr["Clothing & Accessories"] = "#3182bd"; 
        colorArr["Construction Materials"] = "#B84D4D"; 
        colorArr["Fish & Shellfish"] = "#6baed6"; 
        colorArr["Foodstuffs"] = "#74c476"; 
        colorArr["Footwear & Headgear" ] = "#00FFFF"; 
        colorArr["Furniture" ] = "#6BE400"; 
        colorArr["Glass & Glass Products" ] = "#756bb1"; 
        colorArr["Health & Beauty" ] = "#FF33FF"; 
        colorArr["Leather" ] = "#835930"; 
        colorArr["Machinery & Electrical" ] = "#4D8277"; 
        colorArr["Medical Devices" ] = "#636363"; 
        colorArr["Metal Works" ] = "#969696"; 
        colorArr["Mineral Products" ] = "#D65C33"; 
        colorArr["Plastics and Rubber" ] = "#993333"; 
        colorArr["Pornography" ] = "#FF4D94"; 
        colorArr["Pottery & Ceramics" ] = "#6baed6"; 
        colorArr["Precious Stones & Metals" ] = "#E6E600"; 
        colorArr["Pyrotechnics" ] = "#FF3D00"; 
        colorArr["Sports Equipment" ] = "#C4B401";
        colorArr["Textiles" ] = "#999999"; 
        colorArr["Toys & Decorative Products" ] = "#fdae6b", 
        colorArr["Wood"] = "#B24700";

  //load products data
  d3.json("js/data/products.json", function(error, root) {
    //Reset TreeMap
    d3.select("#treemapReset").on("click", function(d){
        d3.select("#treemap").html('');
        d3.select("#statTitle2").html('').append("h2").text(profileTItle);
        d3.select("#TMLegend").html("<h4>Sectors</h4>");
        treeMap();
        legends();
    });
    //Load tree map and legend
    treeMap();
    legends();

    function treeMap(){
        var margin = {top: 0, right: 10, bottom: 0, left: 0},
            width = 982 - margin.left - margin.right,
            height = 330 - margin.top - margin.bottom;

        var treemap = d3.layout.treemap()
            .size([width, height])
            .sticky(true);

        var div = d3.select("#treemap").append("div")
            .style("position", "relative")
            .style("width", "972px")
            .style("height", (height + margin.top + margin.bottom) + "px")
            .style("left", margin.left + "px")
            .style("top", margin.top + "px")
            .style("margin", "0 auto");
           
        var node = div.datum(root).selectAll(".node")
            .data(treemap.nodes)
            .enter().append("rect")
            .attr("class", function(d){
              var nodeCountry = 'node  ';

              if(d.country){
                  for(var i = 0; i < d.country.length; i++){
                      nodeCountry += d.country[i].name.replace(/[\W\s]/g,"") + ' ';
                  }
              }
              
              return nodeCountry;
            })
            .call(position)
            .style("background", function(d) { 
              return d.children ? colorArr[d.name] : null; 
            })
            //.style("opacity", 0.4)
            .style("border", "1px solid #fff")
            .on("mouseover",function (d) {
              var opacity = d3.selectAll('#treemap rect').attr("class");
                
              var courtryList = "<div id='countryProdList'><ul>";
              for(var t=0; t < d.country.length; t++){
                 if(d.country[t].name)
                     courtryList += "<li>"+d.country[t].name +"</li>";
              }
              courtryList += "</ul></div>";

              $("#treemapPopup").show().html(
                  "<h4>"+d.parent.name +"</h4>"+
                      "<p><strong>Good:</strong> "+d.name+"<br />"+
                      "<strong>Countries:</strong></p>"+
                        courtryList
              );

              // Grab the height of the generated tooltip
              var tmPopHeight = $("#treemapPopup").height();
              var tmPopWidth = $("#treemapPopup").width() / 2;

              // Style the title for the tooltip
              $("#treemapPopup h4").css({"background": colorArr[d.parent.name], "margin":0, "text-align":"center"});

              // Position the tooltip based on mouse position
              $(document).mousemove(function(e){
                $("#treemapPopup").css({"left":e.pageX - tmPopWidth + "px","top":e.pageY - tmPopHeight + "px", "opacity":0.9, "padding-bottom":"10px"});
              });
            })
            .text( function(d){ 
                for(var key in d.name) {
                  if(d.name.hasOwnProperty(key)) {
                    if(d.value >= 5){ 
                      //return d.name; 
                   }
                  }
                }
            })
            .attr("id", function(d){ 
                for(var key in d.parent) {
                  if(d.parent.hasOwnProperty(key)) {
                    return d.parent.name.replace(/[\W\s]/g,"");
                  }
                }
            });

        function position() {
          this.style("left", function(d) { return d.x + "px"; })
            .style("top", function(d) { return d.y + "px"; })
            .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
            .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
        } 
    }//end tree map module   

    //build legend key 
    function legends(){
        var svgContainer = d3.select("#TMLegend").append("svg")
            .attr("width", 972)
            .attr("height", 35)
            .attr("margin-top", -6);

        var width = 35, height = 10, x = 0;

        for(var e = root.children.length -1; e >= 0; e--){           
           svgContainer
              .append("rect")
              .attr("x", 0)
              .attr("y", 10)
              .attr("width", width)
              .attr("height", height)
              .attr("transform", "translate("+(36*x++)+",0)")
              .style("fill", function(){
                return colorArr[root.children[e].name];
              })
              .attr("title", function(){
                return root.children[e].name;
              })
              .attr("class", function(){
                return root.children[e].name.replace(/[\W\s]/g,"");
              })  
              .text(function(){
                return root.children[e].name;
              });  
        }
        
        treemapLegendPopups();
    }//end legend function  
    
    //build legend pop up title   
    function treemapLegendPopups(){  
        d3.selectAll("#TMLegend rect").on("mousemove",function () {
          var title = d3.select(this).text();
          $("#TMLegendPopUp").show().html("<h4>"+title+"</h4>");

          // Style the tooltip
          $("#TMLegendPopUp h4").css({"background": colorArr[title], "margin":0, "text-align":"center"});

          //Popoup position
          $(document).mousemove(function(e){
              $("#TMLegendPopUp").css({"left":e.pageX - 102 + "px","top":e.pageY - 30 + "px"});
         });    
        });

        d3.selectAll("#TMLegend rect").on("mouseover",function () {
          var title = d3.select(this).text().replace(/[\W\s]/g,"");

          d3.selectAll("rect.node")
            .style("background", function(d) {
              return d.parent ? colorArr[d.parent.name] : colorArr[d.name]; 
            })
            .transition()
              .duration(500)
              .style("opacity", .4);

          d3.selectAll("rect#"+title)
            .transition()
              .duration(500)
              .style("opacity", 1)
              .style("background", function(d){        
                  return colorArr[d.parent.name];
              })
              .text(function(d){
                if(d.value >= 5){ 
                   return d.name; 
                }
              });
        });

        d3.selectAll("#TMLegend rect").on("mouseout",function () {
          var title = d3.select(this).text().replace(/[\W\s]/g,"");      
          
          d3.selectAll("rect#"+title)
            .transition()
              .duration(500)
              .style("opacity", 0.4)
              .style("background", function(d) { 
                return d.children ? colorArr[d.name] : colorArr[d.parent.name]; 
              })
              .text(function(){
                return '';
              });
        });
    }
  });

      // Arrays to hold indicator info for determining min, max and avg
      var childLabour = [],
          poverty = [],
          netAttendance = [],
          grossEnroled = [],
          gdp = [];

      // Populate array with all non-null indicator stats
      for(i = 0; i < ilabData.length; i++){
        //console.log(ilabData[i]);

        if(ilabData[i]['childLabour']['values']['total'] !== null){
          childLabour.push(ilabData[i]['childLabour']['values']['total']);            
        }

        if(ilabData[i]['poverty']['values']['2005-2010'] !== null){
          poverty.push(ilabData[i]['poverty']['values']['2005-2010']);
        }

        if(ilabData[i]['netAttendance']['values']['male'] !== null || ilabData[i]['netAttendance']['values']['female'] !== null){
          netAttendance.push(d3.mean([ilabData[i]['netAttendance']['values']['male'], ilabData[i]['netAttendance']['values']['female']]));
        }

        if(ilabData[i]['grossEnrolment']['values']['2005-2010']!== null){
          grossEnroled.push(ilabData[i]['grossEnrolment']['values']['2005-2010']);
        }

        if(ilabData[i]['gdp']['values']['2005-2010'] !== null){
          gdp.push(ilabData[i]['gdp']['values']['2005-2010']);
        }
      }

      // Set the color scale domain to the min/max values from array
      colorCL.domain(d3.extent(childLabour));
      var year = 2012;

      // Create the globe
      feature = svg.selectAll("path")
          .data(collection.features)
          .enter().append("svg:path")
          .attr('class', 'land')
          .attr('id', function(d){
              return d.properties.name.replace(/\s+/g, ''); 
          })
          .style('fill', function(d){
            for(i=0; i<ilabData.length; i++){
              if(d.properties.name == ilabData[i]['country'] && ilabData[i]['childLabour']['values']['total'] !== null)
                return colorCL(ilabData[i]['childLabour']['values']['total']);
            }
          })
          .attr("d", clip)
          .style("cursor", "pointer"); 
      
      var margin = {top: 5, right: 40, bottom: 20, left: 120},
      width = 960 - margin.left - margin.right,
      height = 50 - margin.top - margin.bottom;

      /****** Legends *******/
      // Scales
      var tickScaleCL = d3.scale.linear()
        .domain(d3.extent(childLabour))
        .range([0, 200]);

      var clLegendOpts = {scale: tickScaleCL, ticks:3, element:"#clLegend .legendKeyWrapper", gradient:"#gradCL", indData: childLabour};
      createLegend(clLegendOpts);

      // Create legends - The redish bar at the top
      function createLegend(opts){
        var ticks = d3.svg.axis()
          .scale(opts.scale)
          .tickSize(24, 25, 19)
          .ticks(opts.ticks)
          .orient("top");

        var legend = d3.select(opts.element)
          .append("svg")
          //.attr("class", "legendCLcolor")
          .attr("width", 230)
          .attr("height", 45)
          .append("g")
            .attr("transform", "translate(10, 40)")
            .call(ticks);

        legend.append("rect")
          .attr("height", 15)
          .attr("width", 200)
          .attr("y", -17)
          .style("fill", "url("+opts.gradient+")");

        legend.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", -24)
        .attr("y2", 0)
        .style("stroke", "#000000");

        legend.append("text")
        .attr("x", -3)
        .attr("y", -27)
        .text("0");

        legend.append("line")
        .attr("x1", 200)
        .attr("x2", 200)
        .attr("y1", -24)
        .attr("y2", 0)
        .style("stroke", "#000000");

        legend.append("text")
        .attr("x", 193)
        .attr("y", -27)
        .text(d3.round(d3.max(opts.indData)));
      }      
      /******* End Legends *******/
        
        //For country comparisons create box that is saveable in the future
        feature.on("mouseover",function (d) {   
            var childLabor, poverty, netAtt, grossEnroll, GDP;
            var formatNums = d3.format(",");
            var noData = "No Data.";
            
            for(i=0; i < ilabData.length; i++){
                if(d.properties.name == ilabData[i]['country']){
                    childLabor = ilabData[i]['childLabour']['values']['total'];       
                    netAtt = Math.round(d3.mean([ilabData[i]['netAttendance']['values']['male'], ilabData[i]['netAttendance']['values']['female']]));
                    poverty = Math.round(ilabData[i]['poverty']['values']['2005-2010']);
                    grossEnroll = Math.round(ilabData[i]['grossEnrolment']['values']['2005-2010']);
                    GDP = formatNums(Math.round(ilabData[i]['gdp']['values']['2005-2010']));
                }  
            }
            
            if(!childLabor ){childLabor = noData;}else{childLabor += "%";}
            if(!netAtt){netAtt = noData;}else{netAtt += "%";}
            if(!poverty){poverty = noData;}else{poverty += "%";}
            if(!grossEnroll){grossEnroll = noData;}else{grossEnroll += "%";}
            if(!GDP){GDP = noData;}

            $("#globePopup").fadeOut(100,function () {                  
                $("#globePopup").fadeIn(100).html(
                    "<h4>"+d.properties.name+"</h4>"+
                        "<p><strong>Working Children: &nbsp;&nbsp;</strong>"+childLabor +" <br />"+
                        "<strong>Poverty: &nbsp;&nbsp;</strong> "+ poverty +" <br />"+
                        "<strong>School Attendance: &nbsp;&nbsp;</strong> "+ netAtt +"<br />"+
                        "<strong>School Enrollment: &nbsp;&nbsp;</strong> "+ grossEnroll +"<br />"+
                        "<strong>GDP $"+ GDP +'</p>'   
                    );
            });  
         });
      
      // Variables to store previous indicator values       
      var origWidthCL = origWidthPov = origWidthNetAtt = origWidthGross = origWidthGdp = 0;
      d3.select("#statTitle1").append("h2").text(profileTItle);   
       
      var origWidthPov =0, origWidthNetAtt =0;
      // When the user clicks on a country, values change in the tree map
      feature.on("click", updateProfile);
      
      //Compare Countries
      function countryCompare(d){
        var country, extCountry, currentCountry, compareArr = [];
          
        if(d.properties){
            country = d.properties.name;
        } else {
            country = d.country;
        }
        
        compareArr.push(country);

        var myVar = window.sessionStorage, myNextVar = window.sessionStorage,
        curent = "", next="";
         
        if(sessionStorage['curent'] == ""){
            sessionStorage['curent'] = country;
        }else{
            sessionStorage['next'] = sessionStorage['curent'];
        }
     }
      
      // Update the country profile bar charts
      function updateProfile(d) {
        var country;
             
        if(d.properties){
          country = d.properties.name;
        } else {
          country = d.country;
        }

        d3.select("#statTitle1").html('').append("h2")
                .html("<span id='detailedMapLink'>Country Profile: <a href='countryProfile.php?c="+country+"'"+ "target='new'>"+country+"</a></span>");
        d3.select("#statTitle2").html('').append("h2")
                .html("<span id='detailedMapLink'>Country Profile: <a href='countryProfile.php?c="+country+"'"+ "target='new'>"+country+"</a></span>");
        
        //Filter the data to the selected country only        
        var selectedCountry;

        selectedCountry = ilabData.filter(function(d){
          if(d.country == country)
            return d;
        });
        //Tree Map trasition
        function moveToFront() {
            return this.each(function(){
              this.parentNode.appendChild(this);
            });
        };
        
        d3.selectAll("rect.node")
                .style("opacity", .15)
                .style('border', '1px solid #fff'); 
        
        d3.selectAll("rect." +country.replace(/[\W\s]/g,""))
            .style("opacity", 1)
            .style("background", function(d){        
                return colorArr[d.parent.name];
            })
            //.style('border', '1px solid #FF3333')
            .text(function(d){
                if(d.value >= 5){ 
                   return d.name; 
                }
              });
            //.call(moveToFront); 
        //end tree map transition
        return selectedCountry;
      } // End updateProfile()
      
      // End Correlation Viz
    }); //end countries path svg

    d3.select(window)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    d3.select("select").on("change", function() {
      projection.mode(this.value).scale(scale[this.value]);
      refresh(750);
    });

    var m0, o0;

    function mousedown() {
      m0 = [d3.event.pageX, d3.event.pageY];
      o0 = projection.origin();
      d3.event.preventDefault();
    }

    function mousemove() {
      if (m0) {
        var m1 = [d3.event.pageX, d3.event.pageY],
            o1 = [o0[0] + (m0[0] - m1[0]) / 8, o0[1] + (m1[1] - m0[1]) / 8];
        projection.origin(o1);
        circle.origin(o1);
        refresh();
      }
    };

    function mouseup() {
      if (m0) {
        mousemove();
        m0 = null;
      }
    };
    
    function refresh(duration) {
      (duration ? feature.transition().duration(duration) : feature).attr("d", clip);
    }

    function clip(d) {
      return path(circle.clip(d));
    }

 } //end draw function