var map ;

$( document ).ready(function() {
	
	//update event set selection options 
	POST_UpdateEventSetOptions();
	
	//set what to do when the event set selection is changed	
	$("#select_event_set").on('change', function() { POST_ChangeEventSetSelection(); });
});

function POST_ChangeEventSetSelection (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "changeselection", "eventsetselection":$("#select_event_set option:selected").val()}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			UpdateEventSetOptions(data);
		}
	})
	.fail(function(data) {
		alert(data.status + ": Error changing Event Set Selection")
	})
}

function POST_UpdateEventSetOptions (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "updateoptions"}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0){ 
			UpdateEventSetOptions(data);
		}
	})
	.fail(function(data) {
		alert(data.status + ": Error loading Event Set Options")
	})
}

function UpdateEventSetOptions (data) {
	//empty the current options
	$("#select_event_set").empty();
	//refill the options
	for (var i = data.eventsetsinfo.length - 1; i >= 0; i--) {
		$("#select_event_set").append('<option value=\"'+ data.eventsetsinfo[i].id +'\">'+data.eventsetsinfo[i].name+'</option>');
	}
	//set the selected value to the session's value
	$("#select_event_set").val(data.eventsetselection);
	
	POST_UpdateEventSetTableAndMap();
}

function POST_UpdateEventSetTableAndMap (argument){
	var request = {"action" : "geteventsetinfoanddata", "eventsetselection":$("#select_event_set option:selected").val()}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			UpdateEventSetTable(data);
			UpdateEventSetMap(data);
		}
	})
	.fail(function(data) {
		alert(data.status  + ": Error loading Event Set Table")
	})
}

function UpdateEventSetMap (data){
  $("#outer_map").empty();
	$("#outer_map").append("<div id=\"map\" style=\"width: 100%; height: 500px\"></div>");
	
		map = L.map('map' , {
			center : [44.08, -103.23],
		zoom : 5,
		minZoom : 3,
		maxBounds : [[-90 , -540] , [90 , 540]]
	});
	L.tileLayer('http://{s}.tiles.mapbox.com/v3/rwfeather.j8g96pnj/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		maxZoom: 18
	}).addTo(map);
	
	for (var i = data.eventdata.length - 1; i >= 0; i--) {
		
		var lon = data.eventdata[i].location.coordinates[0];
		var lat = data.eventdata[i].location.coordinates[1];
		var marker = L.marker([lat, lon]).addTo(map);
		
		var domelem = document.createElement('a');
		domelem.href = "viewEvent.html#";
		domelem.href += data.eventdata[i]._id.$id;
		var eventInfo;
		if(data.eventdata[i].images)
		{
			var imageid = data.eventdata[i].images[0].$id;
			eventInfo = "<img style=\"width:100px;height:100px\" src=image.php?_id=" + imageid + "><br>";
			
		}
		for (var j = data.details.length - 1; j >= 0; j--) {
			
			if( data.details[j].type === "selection"){
				for ( var k = data.details[j].options.length -1; k >=0; k-- ){
					if ( data.eventdata[i].details[data.details[j].id] === data.details[j].options[k].id ) {
						eventInfo += "<b>" + data.details[j].name + ":</b> " + data.details[j].options[k].name + "<br>";
					}
				}
			}
			else {
				eventInfo += "<b>" + data.details[j].name + ":</b> " + data.eventdata[i].details[data.details[j].id] + "<br>";
			}
		}
		domelem.innerHTML = eventInfo;
		domelem.onclick = function(){};
		
		marker.bindPopup(domelem);
	}
}

function UpdateEventSetTable (data){
	
	$("#event_table_header").empty();
	tableHeader = "<tr><th> User </th>";
	for (var i = data.details.length - 1; i >= 0; i--) {
		tableHeader += "<th>" + data.details[i].name + "</th>";
	}
	tableHeader += "</tr>";
	$("#event_table_header").append(tableHeader);
	
	
	$("#event_table_body").empty();
	for (var i = data.eventdata.length - 1; i >= 0; i--) {
		tableBody = "<tr><td>" + data.eventdata[i].user + "</td>";	
		
		for (var j = data.details.length - 1; j >= 0; j--) {
			
			if( data.details[j].type === "selection"){
				for ( var k = data.details[j].options.length -1; k >=0; k-- ){
					if ( data.eventdata[i].details[data.details[j].id] === data.details[j].options[k].id ) {
						tableBody += "<td>" + data.details[j].options[k].name + "</td>";
					}
				}
			}
			else { 
				
				tableBody += "<td>" + data.eventdata[i].details[data.details[j].id] + "</td>";
			}
		}
		
		tableBody += "<td> <button type=\"button\" onclick=\"location.href='viewEvent.html#" + data.eventdata[i]._id.$id + "'\"  class=\"btn btn-sm btn-default\"><span class=\"glyphicon glyphicon-link\"></span></button></td></tr>";
		$("#event_table_body").append(tableBody);
	}
	
}
