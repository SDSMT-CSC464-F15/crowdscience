$(document).ready(function(){
	
	// Retrieve event id from url
	var parser = document.createElement('a');
	parser.href = document.URL;
	var event_id = parser.hash;
	event_id = event_id.slice( 1 );
	alert( "event_id : " + event_id );
	
	POST_GetEventSetInfoAndEventByID(event_id);
	

});


function POST_GetEventSetInfoAndEventByID (event_id) {
	var request = { "action" : "geteventsetinfoandeventbyid", "id" : event_id };
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			alert( "Status was 0");
			DisplayEvent(data);
		}
		else {
			alert( data.status + ": Something went wrong in the PHP" );
		}
	})
	.fail(function (data) {
		alert(data.status + ": Error getting Event by ID");
	})
}

function DisplayEvent (data)
{	
	alert( "In DisplayEvent Function" );
	$("#event_info").empty();
	
	eventInfo = "<b>User:</b><input class=\"event-control\" value=\"" + data.eventdata.user + "\" type=\"text\" disabled />" + "<b>Location:</b><input class=\"event-control\" value=\"" + data.eventdata.location.coordinates + "\" type=\"text\" disabled />" ;
	for (var i = data.details.length - 1; i >= 0; i--) {
		if( data.details[i].type === "selection"){
			for ( var j = data.details[i].options.length -1; j >=0; j-- ){
				if ( data.eventdata[data.details[i].id] === data.details[i].options[j].id ) {
					eventInfo += "<b>" + data.details[i].name + ":</b><input class=\"event-control\" value=\"" + data.details[i].options[j].name + "\" type=\"text\" disabled />";
				}
			}
		}
		else {
		eventInfo += "<b>" + data.details[i].name + ":</b><input class=\"event-control\" value=\"" + data.eventdata[data.details[i].id] + "\" type=\"text\" disabled />";
		}
		}
	
	$("#event_info").append(eventInfo);
	
	
	
	//check if images are attached to event
	if(data.eventdata.images)
	{
		//set up html for first image in carousel
		var imageid = data.eventdata.images[0].$id;
		document.getElementById('first_image').src = "image.php?_id=" + imageid;
		
		var array_length = data.images.length;
		for( var i = 1; i < array_length; i++)
		{
			var imageid = data.eventdata.images[i].$id;
			var newElement = '<li data-target="#image_carousel" data-slide-to="' +i+ '"></li>';
			$("#image_targets").append(newElement);
			
			var newElement = '<div class="item"><img src="image.php?_id=' + imageid + '"></div>';
			$("#image_inner").append(newElement);
		}
	}
	//if no images, hide image field
	else
	{
		$("#image_carousel").hide();
	}
	}		