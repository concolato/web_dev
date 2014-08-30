function main(){
    //Nav Buttons
    var  visID = $("#helpButton");
    //Boxes
    var TreeMap = $("#NextTreeMap"), visBox = $(".helpBox"),autoCloseId = $('#body-container');
 
    //Sources Box
    chartShow(visID, visBox, autoCloseId);
    
    $("#globePopup").hide();
    $("#TMLegendPopUp").hide();
    $('#treemapPopup').hide();

    $("#treemap").mouseout(function() {
        $('#treemapPopup').hide();         
    }); 
    $("#TMLegend").mouseout(function() {
        $('#TMLegendPopUp').hide();         
    });
    
    $('#body-container').on("click", function(){
      $("#treemapPopup").fadeOut(100);         
    });  

    external_visibility();
}

function external_visibility() {
    //Detailed map popup
    $("#detailedMapLink a").live('click', function (e) {
        e.preventDefault();
        var page = $(this).attr("href");
        var pagetitle = $("#detailedMapLink a:first").text();

        var $dialog = $('<div></div>')
        .html('<iframe id="mapWindow" style="border: 0px; padding:0px" src="' + page + '" width="100%" height="100%"></iframe>')
        .dialog({
            autoOpen: false,
            modal: true,
            height: 525,
            width: 700,
            title: pagetitle,
            scroller:false
        });
        $dialog.dialog('open');
    });
}

//Open and collaps entities
function chartShow(visID, visBox, autoCloseId){
    visBox.hide();
    
    visID.hover(function(){
        visBox.fadeIn(500); 
    });
    autoCloseId.on("click", function(){
        visBox.fadeOut(500);
    });  
}

/* 
Utility functions
 */
//var_dump in js
function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    console.log(out);
    //alert(out);
    // or, if you wanted to avoid alerts...
    var pre = document.createElement('pre');
    pre.innerHTML = out;
    //document.body.appendChild(pre);
}

//for rounding down
function intelliRound(num) {
    var len=(num+'').length;
    var fac=Math.pow(10,len-1);
    return Math.ceil(num/fac)*fac;
}