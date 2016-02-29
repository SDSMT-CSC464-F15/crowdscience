$(document).ready(function(){
	
	
	POST_GetEventSetInfoAndEventByID();
});


function POST_GetEventSetInfoAndEventByID (argument) {
	alert( "In POST_GetEventSetInfoAndEventByID Function" );
	var parser = document.createElement('a');
	parser.href = document.URL;
	var event_id = parser.hash;
	event_id = event_id.slice( 1 );
	alert( "event_id : " + event_id );
	
	var request = { "action" : "geteventsetinfoandeventbyid", "id" : event_id };
	
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		DisplayEvent(data);
	})
	.fail(function(data) {
		alert(data.status + ": Error getting Event by ID");
	})
}

function DisplayEvent (data)
{	
	alert( "In DisplayEvent Function" );
	if (data.status == 0){ 
		alert( "PHP finished sucessfully" );
	}
	if (data.status == 1){
		alert ( "Failed to get EventSetInfo from Mongo DB" );
	}
	if (data.status == 2){
		alert ( "Failed to find event in Mongo DB" );
	}
	if (data.status == 3){
		alert ( "Failed to find user in Mongo DB" );
	}

	
	$("#event_info").empty();
	alert( "data.eventdata.user : " + data.eventdata.user );
	alert( "data.eventdata.location.coordinates : " + data.eventdata.location.coordinates );
	
	eventInfo = "<b>User:</b><input class=\"event-control\" value=\"" + data.eventdata.user + "\" type=\"text\" disabled /> <b>Location:</b><input class=\"event-control\" value=\"" + data.eventdata.location.coordinates + "\" type=\"text\" disabled />" ;
	alert( "EventInfo okay");
	for (var i = data.details.length - 1; i >= 0; i--) {
		alert( "Data.details loop i : " + i );
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
	
	alert( "eventInfo appended to event_info" );
	
	//check if images are attached to event
	if(data.eventdata.images)
	{
		//set up html for first image in carousel
		var imageid = data.eventdata.images[0].$id;
		document.getElementById('first_image').src = "image.php?_id=" + imageid;
		
		var array_length = data.eventdata.images.length;
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