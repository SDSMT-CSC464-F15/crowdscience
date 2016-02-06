$(function () {
	refreshEventSetSelect();

	$("#selecteventset").on('change', function() { changeEventSetSelect(); });

});

function changeEventSetSelect (argument) {

	var eventsetselection = $("#selecteventset option:selected").val();
	var request = {"action" : "change", "eventsetselection":eventsetselection}
	
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) {
			updateEventSetOptions(data.eventsetsinfo);
			updateEventSetSelection(data.eventsetselection);
			}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function refreshEventSetSelect (argument) {

	var request = {"action" : "refresh"}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0){ 
			updateEventSetOptions(data.eventsetsinfo);
			updateEventSetSelection(data.eventsetselection);
			}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function updateEventSetOptions (eventsetsinfo) {
	$("#selecteventset").empty();
	//refill it
	for (var i = eventsetsinfo.length - 1; i >= 0; i--) {
		$("#selecteventset").append('<option value=\"'+ eventsetsinfo[i].id +'\">'+eventsetsinfo[i].name+'</option>');
	}
}

function updateEventSetSelection (selection) {
$("#selecteventset").val(selection);
}