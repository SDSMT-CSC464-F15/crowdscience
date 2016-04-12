/*!
	\file report.js
	\brief Contains functions for submitting an event report and creating the custom report form for each event set
	\details 
	This file contains $(document).ready(), which sets the function to be called when the document, the HTML loading the JavaScript, has been loaded and is ready to run; and several functions for interaction with the event set selection and data. The $(document).ready() function loads the report map, calls the POST_UpdateEventSetOptions() and POST_UpdateReportFields() functions, and then generates necessary event handlers. 
	
	The global variable picture_id stores an array of uploaded picture Mongo IDs to be added to the completed event report. The lat and lon global variables store the currently selected latitude and longitude on the report map. The event_set_fields global variable stores a reference to the custom event set form fields that are created and accessed within this file.
*/
var picture_id = [];
var lat = 0;
var lon = 0;
var event_set_fields = new Array();

/*!
 \brief Initializes the map, updates the event set options and report fields, and then sets event handlers.
	\details 
	This function initizlizes the reporting interface's map, and then sets its on click event handler. Then, this function calls the POST_UpdateEventSetOptions() function to update the event set options and ensure an event is selected, and the POST_UpdateReportFields() to create the report fields specific to the event set. Then, the event handler for the report form submission event is set to clear old messages and call POST_SubmitEventReport().  The event handler for changing the selected event is set to the POST_ChangeEventSetSelection() function, and the event handler for clicking the choose fuile button is set to the PreparePhotoUpload() function.
*/
$(document).ready(function(){
	initmap(); //load map
	map.on('click', onMapClick); //set click handler
	
	//update event set selection options
	POST_UpdateEventSetOptions();
	
	POST_UpdateReportFields();	
	
	//creating a new event
	$("#event_report_form").submit(function(event) {
		event.preventDefault();
		POST_SubmitEventReport();
	});
	
	//Register a handler for the "Choose file" button
	$("#choose_photos").on('change', function() {
	$('form').on('submit', {files : event.target.files}, POST_UploadPhotos);
	});

	//set what to do when the event set selection is changed	
	$("#select_event_set").on('change', function() { POST_ChangeEventSetSelection(); });
});


/*!
	\brief Gathers appropriate info and makes a new event.
	\details 
	This function first creates a shell of the event report to submit. Then it loops through the details fields of the event report, and adds each to the details array of the event report shell. The form data of each event report field is accessed in the details array by the id of the form field associated with it. If images were uploaded, the image Mongo IDs are added to the event report. The event report is then posted to report.php. 
	
	When the post to event.php is complete, the function checks the status code. If the status code is 0, the post completed successfully, and returns the user to the index page. If the status code returned from the post is not 0, then the status code and error message are alerted to the user. If the post to event.php fails, then an alert box will pop up with the status code of the failure and a brief error message.
*/
function POST_SubmitEventReport(argument) {
	//json for request
	
	var request = { 
		action: "submiteventreport",
		eventsetselection: $("#select_event_set option:selected").val(),
		newreport: {
			location: {
				lat: lat,
				long: lon
			},
			details: {},
			images: []
		}
	};
	
	for (var i = event_set_fields.length - 1; i >= 0; i--) {
		request.newreport.details[event_set_fields[i].attr("id").toString()] = event_set_fields[i].val().toString();
	}
	
	//add image id to json only if one was uploaded
	if ( picture_id[0] != "") 
	{
		for(var j = picture_id.length - 1; j >= 0; j--)
		{
		request.newreport.images[j] = picture_id[j];
		}
	}
	//post data to server
	$.post( "report.php", JSON.stringify(request), null, "json" )
	.done(function(data) {
		if (data.status == 0) {
		//go back to main page after event creation
		window.location.href = 'index.html';
		}
		else 
		{
			alert(data.status + ": Error Uploading Event Report: " + data.message)
			}
		
	})
	.fail(function(data) {
		alert( "error:" + data.responseText);
	}) ;
}

/*!
	\brief Catch the form submit and upload the files.
	\details 
	This function suppresses output, and then creates form data from the selected files, and prepares the files for upload. The files are posted to fileUpload.php, which handles uploading the files to the Mongo database. 
	
	When the post to fileUpload.php is complete, if there is a latitude and longitude associated with the picture, it is placed in the latitude and longitude fields in the HTML form, and the sucessful image upload message is shown to the user. If the post to event.php fails or there are errors with the data, the data error messages are added to the console log. 
*/
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
		contentType: false // Set content type to false as jQuery will tell the server its a query string request
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
	
	POST_UpdateReportFields();
}

/*!
	\brief Retrieves event set information from the database necessary for creating custom event report form.
	\details 
	This function posts to event.php to retrieve event set information from the database necessary for creating the custom event report form. When the post to event.php is complete, the function checks the status code. If the status code is 0, the post completed successfully, and calls UpdateReportFields() with the data returned from the post to event.php. If the status code returned from the post is not 0, then the status code and error message are alerted to the user. If the post to event.php fails, then an alert box will pop up with the status code of the failure and a brief error message.
*/
function POST_UpdateReportFields (argument) {
	var request = {"action" : "geteventsetinfo", "eventsetselection":$("#select_event_set option:selected").val()}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0){ 
			UpdateReportFields(data);
		}
		else 
		{
			alert(data.status + ": Error updating Report Fields: " + data.message)
			}
	})
	.fail(function(data) {
		alert(data.status + ": Error updating Report Fields")
	})
}

/*!
	\brief Builds custom event report form based on selected event set.
	\details 
	This function creates a new instance of the global variable event_set_details to add new event report fields to, to later be accessed to submit the event report. Then, it clears the current fields on the form, and loops through all the event set details to add to the form. Depending on the detail type, a different form control is added to the report form. Selection types are added as a selection box, with the options as specified with id and display text. Short text types are added as a simple, one line text entry. Long text types are added as a text area. Date types are added as a date type input field. Number types are added as a number type input field, and may have a minimum, maximum, and step value defined. The complete form is then added to the HTML document. 
*/
function UpdateReportFields (data) {
	
	event_set_details = new Array();
	
	$("#event_fields").empty();
	
	for (var i = data.details.length - 1; i >= 0; i--) {
		//type: selection
		if( data.details[i].type === "selection"){
			eventField = "<select id=\"" + data.details[i].id + "\" class=\"form-control\"> <option selected disabled value=\"\">" + data.details[i].name + "</option>";
			for ( var j = data.details[i].options.length -1; j >=0; j-- )
			eventField += "<option value=\"" + data.details[i].options[j].id + "\">" + data.details[i].options[j].name + "</option>";
			eventField+= "</select>";
		}
		//type: short text
		if( data.details[i].type === "shorttext"){
			eventField = "<input class=\"form-control\" name=\"" + data.details[i].id + "\" id=\"" + data.details[i].id + "\" placeholder=\"" +data.details[i].name + "\" value=\"\" type=\"text\" />";
		}
		//type: long text
		if( data.details[i].type === "longtext"){
			eventField = "<textarea id=\"" + data.details[i].id + "\" class=\"form-control\" placeholder=\"" + data.details[i].name + "\" rows=\"4\"></textarea>";
		}
		//type: date
		if( data.details[i].type === "date"){
			eventField = "<input class=\"form-control\" name=\"" + data.details[i].id + "\" id=\"" + data.details[i].id + "\"  placeholder=\"" + data.details[i].name + "\" value=\"\" type=\"date\" />";
		}
		//type: number
		if( data.details[i].type === "number"){
			eventField = "<input class=\"form-control\" name=\"" + data.details[i].id + "\" id=\"" + data.details[i].id + "\" placeholder=\"" +data.details[i].name + "\" value=\"\" type=\"number\"";
			if ( !(data.details[i].max === "none")){
				eventField += "max=\"" + data.details[i].max + "\" ";
			}
			if ( !(data.details[i].min === "none")){
				eventField += "min=\"" + data.details[i].min + "\" ";
			}
			eventField += "step=\"" + data.details[i].step + "\"/>";
		}
		event_set_fields.push($(eventField).appendTo($("#event_fields")));
	}
	
	
	
}