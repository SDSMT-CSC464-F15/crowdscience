$(function () {
	refreshEventSetSelect();

	$("#selecteventset").on('change', function() { changeEventSetSelect(); });

});

function changeEventSetSelect (argument) {
	var selection = $("#selecteventset option:selected").val();
	var request = {"action" : "change", "eventsetselect":selection}
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
	//empty the options
	alert(data.eventsetselectedval);
	$("#selecteventset").empty();
	//refill it
	for (var i = data.eventsetsinfo.length - 1; i >= 0; i--) {
		$("#selecteventset").append('<option value=\"'+ data.eventsetsinfo[i].id +'\">'+data.eventsetsinfo[i].name+'</option>');
	}
	//change selected val to saved session selection
	$("#selecteventset").val(data.eventsetselect);
}