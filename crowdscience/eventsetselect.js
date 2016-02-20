//Things to do when the script is loaded
$(function () {
	refreshEventSetSelect();
	//set what to do when the event set selection is changed
	$("#selecteventset").on('change', function() { changeEventSetSelect(); });

});

function changeEventSetSelect (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "change", "eventsetselection":$("#selecteventset option:selected").val()}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			updateEventSetSelect(data);
			}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function refreshEventSetSelect (argument) {
	//POST request to the PHP, PHP will query DB, and echo data back
	var request = {"action" : "refresh"}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0){ 
			updateEventSetSelect(data);
			}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function updateEventSetSelect (data) {
	//empty the current options
	$("#selecteventset").empty();
	//refill the options
	for (var i = data.eventsetsinfo.length - 1; i >= 0; i--) {
		$("#selecteventset").append('<option value=\"'+ data.eventsetsinfo[i].id +'\">'+data.eventsetsinfo[i].name+'</option>');
	}
	//set the selected value to the session's value
	$("#selecteventset").val(data.eventsetselection);
	
		var request = {"action" : "update", "eventsetselection":$("#selecteventset option:selected").val()}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			updateEventSetData(data);
			}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function updateEventSetData (data){
$("#ev_table_head").empty();
		ev_head_text = "<tr><th> User </th>";
		
		alert(data.details.length)
		for (var i = data.details.length - 1; i >= 0; i--) {
		ev_head_text = ev_head_text + "<th>" + data.details[i]+ "</th>";
		}
		ev_head_text = ev_head_text + "</tr>";

		$("#ev_table_head").append(ev_head_text);
		
		
}
