/*!
	\file index.js
	\brief Contains functions for event set interaction on the index page.
	\details 
	This file contains $(document).ready(), which sets the function to be called when the document, the HTML loading the JavaScript, has been loaded and is ready to run; and several functions for interaction with the event set selection and data. The $(document).ready() function calls the POST_UpdateEventSetOptions() function and then generates necessary event handlers. 
	
	The POST_UpdateEventSetOptions() function posts a request to event.php to change the event set selection saved in session data and update current event set options, when the post completes successfully, the UpdateEventSetOptions() function is called. The POST_UpdateEventSetOptions() function posts a request to event.php to update current event set options, when the post completes successfully, the UpdateEventSetOptions() function is called.   The UpdateEventSetOptions() function updates the event set selection box with the selected event set stored in session data and the current list of event set options in the database.
	
	The POST_UpdateEventSetTableAndMap function posts a request to event.php to retrieve all event set data, when the post completes successfully, the UpdateEventSetTable(), UpdateEventSetMap(), and UpdateEventSetImageCarousel() functions are called. The UpdateEventSetTable() function clears the previous table body and header and then inserts the corresponding information retrieved from the database. The UpdateEventSetMap() function removes all prior markers on the map and then creates markers for the corresponding information retrieved from the database. The UpdateEventSetImageCarousel() function clears the images already in the image carousel and then inserts the corresponding images retrieved from the database.
	
	The map global variable stores a reference to the map and all its markers being displayed.
*/

var map ;

/*!
	\brief Updates the event set options and then sets event handlers.
	\details 
	This function calls the POST_UpdateEventSetOptions() function to update the event set options and ensure an event is selected. Then, the event handler for chancing the selected event is set to the POST_ChangeEventSetSelection() function. 
*/
$( document ).ready(function() {
	
	//update event set selection options 
	POST_UpdateEventSetOptions();
	
	//set what to do when the event set selection is changed	
	$("#select_event_set").on('change', function() { POST_ChangeEventSetSelection(); });
});

/*!
	\brief Posts to event.php to change the currently selected event set and update the event set options.
	\details 
	This function posts to event.php to change the currently selected event set and update the event set options. The php request includes the new selected event. When the post to event.php is complete, the function checks the status code. If the status code is 0, the post completed successfully, and calls UpdateEventSetOptions() with the data returned from the post to event.php. If the status code returned from the post is not 0, then the status code and error message are alerted to the user. If the post to event.php fails, then an alert box will pop up with the status code of the failure and a brief error message.
*/
function POST_ChangeEventSetSelection (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "changeselection", "eventsetselection":$("#select_event_set option:selected").val()}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			UpdateEventSetOptions(data);
		}
		else 
		{
			alert(data.status + ": Error changing Event Set Selection: " + data.message)
			}
	})
	.fail(function(data) {
		alert(data.status + ": Error changing Event Set Selection")
	})
}

/*!
	\brief Posts to event.php to update the event set options.
	\details 
	This function posts to event.php to update the event set options. When the post to event.php is complete, the function checks the status code. If the status code is 0, the post completed successfully, and calls UpdateEventSetOptions() with the data returned from the post to event.php. If the status code returned from the post is not 0, then the status code and error message are alerted to the user. If the post to event.php fails, then an alert box will pop up with the status code of the failure and a brief error message.
*/
function POST_UpdateEventSetOptions (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "updateoptions"}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0){ 
			UpdateEventSetOptions(data);
		}
		else 
		{
			alert(data.status + ": Error loading Event Set Options: " + data.message)
		}
	})
	.fail(function(data) {
		alert(data.status + ": Error loading Event Set Options")
	})
}

/*!
	\brief Updates the event set options with provided data.
	\details 
	This function empties the options of the event set selection, and then loops though the data passed in. For each event set, the id is added to the event set selection as the value, and the name of the event set is the display text. The currently selected item is set to the selected event in the data passed to the function. Then, the POST_UpdateEventSetTableAndMap() function is called to update the event set table and map.
*/
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

/*!
	\brief Posts to event.php to retrieve the event set data and update the event set image carousel, table, and map.
	\details 
	This function posts to event.php to retrieve the event set data. The php request includes the currently selected event. When the post to event.php is complete, the function checks the status code. If the status code is 0, the post completed successfully, and calls UpdateEventSetTable(), UpdateEventSetMap(), and UpdateEventSetImageCarousel() with the data returned from the post to event.php to update the event set image carousel, table, and map. If the status code returned from the post is not 0, then the status code and error message are alerted to the user. If the post to event.php fails, then an alert box will pop up with the status code of the failure and a brief error message.
	
*/
function POST_UpdateEventSetTableAndMap (argument){
	var request = {"action" : "geteventsetinfoanddata", "eventsetselection":$("#select_event_set option:selected").val()}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			UpdateEventSetTable(data);
			UpdateEventSetMap(data);
			UpdateEventSetImageCarousel(data);
		}
		else 
		{
			alert(data.status + ": Error loading Event Set Table: " + data.message)
		}
	})
	.fail(function(data) {
		alert(data.status  + ": Error loading Event Set Table")
	})
}

/*!
	\brief Updates the event set image carousel.
	\details 
	This function first empties the image carousel, and then loops through the set of events. For each event, the first photo associated with the event is added to the carousel. A new target is then added to the list of targets for the image carousel to display. If the image is the first image, it is also set as the active image. The image is then added to the carousel. Each image is retrieved using a post to image.php with the id of the image and then added to the inner list of images. If there are no images to display, the image carousel is hidden.
*/
function UpdateEventSetImageCarousel (data){
	var k = 0;
	$("#image_targets").empty();
	$("#image_inner").empty();
	for (var i = data.eventdata.length - 1; i >= 0; i--) {
		//if current recent event has images
		if(data.eventdata[i].images)
		{
			//check if on first image
			if( k == 0)
			{
				//set up html for first image in carousel
				var imageid = data.eventdata[i].images[0].$id;
				var newElement = '<li data-target="#image_carousel" data-slide-to="' +k+ '" class="active"></li>';
				$("#image_targets").append(newElement);
				
				var newElement = '<div class="item active"><img style = "max-width:100%;max-height:350px;vertical-align:middle" src="image.php?_id=' + imageid + '"></div>';
				$("#image_inner").append(newElement);
				k++;
			}
			//first image already on carousel
			else
			{
				//append first image of each recent event onto the carousel
				var imageid = data.eventdata[i].images[0].$id;
				var newElement = '<li data-target="#image_carousel" data-slide-to="' +k+ '"></li>';
				$("#image_targets").append(newElement);
				
				var newElement = '<div class="item"><img style = "max-width:100%;max-height:350px;vertical-align:middle" src="image.php?_id=' + imageid + '"></div>';
				$("#image_inner").append(newElement);
				k++
			}
		}
	}
	
	//if no images, hide image field
	if(k == 0)
	{
		$("#image_carousel").hide();
	}
}

/*!
	\brief Updates the event set map.
	\details 
	This function first clears the current map and creates a new instance of the map layer to clear all the previous markers from the map. The map is then initialized, to be focused on Rapid City, SD, with information regarding the map's API origin. Then, all the events in the data argument passed to the function are looped through. For each event, a marker is placed on the map according to the event's latitude and longitude. A popup is then added to the marker, containing a link to view the individual event and basic information about the event. If the event has an image associated with it, the image is added to the popup. Then the details for the event set are looped through, and the details of the event added to the popup. If the detail type is a selection, then the appropriate text is inserted for the selection. For any other type, the database information is directly inserted.  
*/
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

/*!
	\brief Updates the event set table.
	\details 
	This function first empties the table headers, and then repopulates the table headers according to the selected data set. The table body is then emptied, and repopulated with the corresponding information from the database. Then the details for the event set are looped through, and the details of the event added to table body. If the detail type is a selection, then the appropriate text is inserted for the selection. For any other type, the database information is directly inserted. Links to zoom to that event on the map, and view the individual event are added to the end of each table row. 
*/
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
		
		tableBody += "<td><button type=\"button\" id=\"but_" + i + "\"  class=\"btn btn-sm btn-default\"><span class=\"glyphicon glyphicon-zoom-in\"></span></button><button type=\"button\" onclick=\"location.href='viewEvent.html#" + data.eventdata[i]._id.$id + "'\"  class=\"btn btn-sm btn-default\"><span class=\"glyphicon glyphicon-link\"></span></button></td></tr>";
		
		$("#event_table_body").append(tableBody);
		
		var but_name = "but_" + i;
		var lon = data.eventdata[i].location.coordinates[0];
		var lat = data.eventdata[i].location.coordinates[1];
		$('#'+but_name).click([lat, lon], function (e) {
			map.setView(e.data, 6, {pan : {animate : true, duration : 1}, zoom : {animate : true}})
		});
		
	}
	
}
