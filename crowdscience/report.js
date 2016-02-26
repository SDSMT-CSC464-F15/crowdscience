var picture_id = [];
var lat = 0;
var lon = 0;
var event_set_details = [];

$(document).ready(function(){
	initmap(); //load map
	map.on('click', onMapClick); //set click handler
	
	//creating a new event
	$("#event_report_form").submit(function(event) {
		event.preventDefault();
		POST_SubmitEventReport();
	});
	
	//Register a handler for the "Choose file" button
	$("#choose_photos").on('change', PreparePhotoUpload);
	
	//update event set selection options - defined in eventSet.js
	POST_UpdateEventSetOptions();
	
	POST_UpdateReportFields();
	
	//set what to do when the event set selection is changed	
	$("#select_event_set").on('change', function() { POST_ChangeEventSetSelection(); });
});


//Gathers appropriate info and makes a new event
function POST_SubmitEventReport() {
	//json for request
	var request = { 
		"action": "submiteventreport",
		"newreport": {
			"location": {
				"lat": lat,
				"long": lon
			}
		}
	};
	
	for (var i = event_set_details.length - 1; i >= 0; i--) {
	request.newreport.details[event_set_details[i].id] = $("#"+event_set_details[i].id).val();
		}
		
	//add image id to json only if one was uploaded
	if ( picture_id[0] != "") 
	{
		request.newreport.images = picture_id;
	}
	
	//post data to server
	var register_posting = $.post( "report.php", JSON.stringify(request), null, "json" )
	.done(function(data) {
		//go back to main page after event creation
		window.location.href = 'index.html';
	})
	.fail(function(data) {
		alert( "error:" + data.responseText);
	})
	.always(function() {
	}) ;
}

function PreparePhotoUpload(event) {
	//Register a handler for the submit button
	$('form').on('submit', {files : event.target.files}, POST_UploadPhotos);
}

// Catch the form submit and upload the files
function POST_UploadPhotos(event) {
	event.stopPropagation(); 
	event.preventDefault(); 
	
	var files = event.data.files;
	// Create a formdata object and add the files
	var data = new FormData();
	$.each(files, function(key, value)
	{
		data.append(key, value);
	});
	
	$.ajax({
		url: 'fileUpload.php',
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	})
	.done(function(data){
		if(typeof data.error === 'undefined')
		{
			
			for (var i = 0; i < data.images.length; i++) {
			  //get image id, lat, and long from image upload, then store to html field
			  picture_id[i] =  data.images[i].id.$id;
			  if ( (data.images[i].lat != 0) && (data.images[i].lon != 0) )
				{
					lat = data.images[i].lat;
					lon = data.images[i].lon;
				}
				$("#image_upload_message").show();
			}			
		}
		else
		{
			// Handle errors here
			console.log('ERRORS: ' + data.error);
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		// Handle errors here
		console.log('ERRORS: ' + textStatus);
	});
	
}

function POST_ChangeEventSetSelection (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "changeselection", "eventsetselection":$("#select_event_set option:selected").val()}
	$.post( "eventSet.php", JSON.stringify(request), null, "json")
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
	$.post( "eventSet.php", JSON.stringify(request), null, "json")
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
	
	POST_UpdateReportFields();
}

function POST_UpdateReportFields (argument) {
	var request = {"action" : "geteventsetdetails"}
	$.post( "report.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0){ 
			UpdateReportFields(data);
		}
	})
	.fail(function(data) {
		alert(data.status + ": Error updating Report Fields")
	})
}

function UpdateReportFields (data) {
	
	event_set_details = data.details;
	
	$("#event_fields").empty();
	eventFields = " ";
	alert( data.details.length);
	for (var i = data.details.length - 1; i >= 0; i--) {
		//type: selection
		if( data.details[i].type === "selection"){
			eventFields += "<select id=\"" + data.details[i].id + "\" class=\"form-control\"> <option selected disabled value=\"\">" + data.details[i].name + "</option>";
			for ( var j = data.details[i].options.length -1; j >=0; j-- )
			eventFields += "<option value=\"" + data.details[i].options[j].id + "\">" + data.details[i].options[j].name + "</option>";
			eventFields+= "</select>";
		}
		//type: short text
		if( data.details[i].type === "shorttext"){
			eventFields += "<input class=\"form-control\" name=\"" + data.details[i].id + "\" id=\"" + data.details[i].id + "\" placeholder=\"" +data.details[i].name + "\" value=\"\" type=\"text\" />";
		}
		//type: long text
		if( data.details[i].type === "longtext"){
			eventFields += "<textarea id=\"" + data.details[i].id + "\" class=\"form-control\" placeholder=\"" + data.details[i].name + "\" rows=\"4\"></textarea>";
		}
		//type: date
		if( data.details[i].type === "date"){
			eventFields += "<input class=\"form-control\" name=\"" + data.details[i].id + "\" id=\"" + data.details[i].id + "\" onfocus=\"this.type='date'\" placeholder=\"" + data.details[i].name + "\" value=\"\" type=\"text\" />";
		}
		//type: number
		if( data.details[i].type === "number"){
			eventFields += "<input class=\"form-control\" name=\"" + data.details[i].id + "\" id=\"" + data.details[i].id + "\" placeholder=\"" +data.details[i].name + "\" value=\"\" type=\"number\"";
			if ( !(data.details[i].max === "none")){
				eventFields += "max=\"" + data.details[i].max + "\" ";
				}
			if ( !(data.details[i].min === "none")){
				eventFields += "min=\"" + data.details[i].min + "\" ";
			}
			eventFields += "step=\"" + data.details[i].step + "\"/>";
		}
		
	}
	
	$("#event_fields").append(eventFields);
	
}