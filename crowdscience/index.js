$( document ).ready(function() {
	
	//update event set selection options - defined in eventSet.js
	POST_UpdateEventSetOptions();
	

	//set what to do when the event set selection is changed	
		$("#selecteventset").on('change', function() { POST_ChangeEventSetSelection(); });
});

function POST_ChangeEventSetSelection (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "changeselection", "eventsetselection":$("#selecteventset option:selected").val()}
	$.post( "eventSet.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			updateEventSetOptions(data);
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
	$("#selecteventset").empty();
	//refill the options
	for (var i = data.eventsetsinfo.length - 1; i >= 0; i--) {
		$("#selecteventset").append('<option value=\"'+ data.eventsetsinfo[i].id +'\">'+data.eventsetsinfo[i].name+'</option>');
	}
	//set the selected value to the session's value
	$("#selecteventset").val(data.eventsetselection);
	
	POST_UpdateEventSetTable();
}

function POST_UpdateEventSetTable (argument){
	alert ($("#selecteventset option:selected").val());
	var request = {"action" : "updatetable", "eventsetselection":$("#selecteventset option:selected").val()}
	$.post( "eventSet.php", JSON.stringify(request), null, "json")
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
	$("#ev_table_head").empty();
	ev_head_text = "<tr><th> User </th>";
	
	alert(data.details.length);
	for (var i = data.details.length - 1; i >= 0; i--) {
		ev_head_text = ev_head_text + "<th>" + data.details[i].name + "</th>";
	}
	ev_head_text = ev_head_text + "</tr>";
	
	$("#ev_table_head").append(ev_head_text);
	
	
}
