/*!
	\file viewEvent.js
	\brief Contains functions for event set interaction on the index page.
	\details 
	This file contains $(document).ready(), which sets the function to be called when the document, the HTML loading the JavaScript, has been loaded and is ready to run; and several functions for interaction with the event set selection and data. The $(document).ready() function calls the POST_GetEventSetInfoAndEventByID() function.
	
	
*/
/*!
	\brief Calls the POST_GetEventSetInfoAndEventByID() function
	\details 
	This function calls the POST_GetEventSetInfoAndEventByID() function to get the information for the individual event being viewed.
*/
$(document).ready(function(){
	POST_GetEventSetInfoAndEventByID();
});

/*!
	\brief Retrieves the individual event data from the database.
	\details 
	This function posts a request containing the ID of an individual event to view to event.php to retrieve the event being viewed. The Mongo ID of the event is parsed from the URL of the page. When the post to event.php is complete, the function checks the status code. If the status code is 0, the post completed successfully, and calls DisplayEvent() with the data returned from the post to event.php. If the status code returned from the post is not 0, then the status code and error message are alerted to the user. If the post to event.php fails, then an alert box will pop up with the status code of the failure and a brief error message.
*/
function POST_GetEventSetInfoAndEventByID (argument) {
	var parser = document.createElement("a");
	parser.href = document.URL;
	var event_id = parser.hash;
	event_id = event_id.slice( 1 );
	var request = { "action" : "geteventsetinfoandeventbyid", "id" : event_id };
	
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			DisplayEvent(data);
		}
		else 
		{
			alert(data.status + ": Error accessing Event by ID: " + data.message)
		}
	})
	.fail(function(data) {
		alert(data.status + ": Error accessing Event by ID");
	})
}

/*!
	\brief Displays individual event data retrieved from database.
	\details 
	This function first clears the event data area of previous data, and then fills the area with the event data. The User and Location are added first to the event data, then the data details are looped through. For each event detail, if the detail type is selection, the database text is replaced with the selection's display name. Otherwise, the detail data is added as it appears in the database. The event details are then added to the HTML. If there are images associated with the record, they are added to the image carousel on the page.
*/
function DisplayEvent (data)
{	
	$("#event_info").empty();
	
	eventInfo = "<b>User:</b><input class=\"event-control\" value=\"" + data.eventdata.user + "\" type=\"text\" disabled /> <b>Location:</b><input class=\"event-control\" value=\"" + data.eventdata.location.coordinates + "\" type=\"text\" disabled />" ;
	
	for (var i = data.details.length - 1; i >= 0; i--) {
		
		if( data.details[i].type === "selection"){
			for ( var j = data.details[i].options.length -1; j >=0; j-- ){
				if ( data.eventdata.details[data.details[i].id] === data.details[i].options[j].id ) {
					eventInfo += "<b>" + data.details[i].name + ":</b><input class=\"event-control\" value=\"" + data.details[i].options[j].name + "\" type=\"text\" disabled />";
				}
			}
		}
		else {
			eventInfo += "<b>" + data.details[i].name + ":</b><input class=\"event-control\" value=\"" + data.eventdata.details[data.details[i].id] + "\" type=\"text\" disabled />";
		}
	}
	
	$("#event_info").append(eventInfo);
	
	//check if images are attached to event
	if(data.eventdata.images)
	{
		//set up html for first image in carousel
		var imageid = data.eventdata.images[0].$id;
		document.getElementById("first_image").src = "image.php?_id=" + imageid;
		
		var array_length = data.eventdata.images.length;
		for( var i = 1; i < array_length; i++)
		{
			var imageid = data.eventdata.images[i].$id;
			var newElement = "<li data-target=\"#image_carousel\" data-slide-to=\"" +i+ "\"></li>";
			$("#image_targets").append(newElement);
			
			var newElement = "<div class=\"item\"><img src=\"image.php?_id=" + imageid + "\"></div>";
			$("#image_inner").append(newElement);
		}
	}
	//if no images, hide image field
	else
	{
		$("#image_carousel").hide();
	}
}		