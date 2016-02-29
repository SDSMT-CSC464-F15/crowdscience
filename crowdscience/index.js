$( document ).ready(function() {
	
	//update event set selection options - defined in eventSet.js
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
	
	POST_UpdateEventSetTable();
}

function POST_UpdateEventSetTable (argument){
	var request = {"action" : "geteventsetinfoanddata", "eventsetselection":$("#select_event_set option:selected").val()}
	$.post( "event.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			UpdateEventSetTable(data);
		}
	})
	.fail(function(data) {
		alert(data.status  + ": Error loading Event Set Table")
	})
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
	
		tableBody += "<td> <button type=\"button\" onclick=\"location.href='viewEvent.html#" + data[i]._id.$id + "'\"  class=\"btn btn-sm btn-default\"><span class=\"glyphicon glyphicon-link\"></span></button></td></tr>";
		$("#event_table_body").append(tableBody);
	}
	
}
