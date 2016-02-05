$(function () {
	
	refreshEventSetSelect();
//things to do when page loads
//populate event select box
//check if already have selected event

$("#selecteventset").on('change', function() { 
function changeEventSetSelect (); 
});


});

function changeEventSetSelect (argument) {
//go to the php, do the db
var collection = document.getElementById("selecteventset")[document.getElementById("selecteventset").selectedIndex].value;

var request = {"action" : "change", "eventsetselect" : collection }
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) 
			{updateEventSetOptions(data.eventsetsinfo);
			updateEventSetSelect(data.eventsetselect);}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function refreshEventSetSelect (argument) {
//go to the php, do the db
var request = {"action" : "refresh"}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0) 
			{updateEventSetOptions(data.eventsetsinfo);
			updateEventSetSelect(data.eventsetselect);}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function updateEventSetOptions (eventsetsinfo)
{
//variable to the event selection bar
var selecteventset = document.getElementById("selecteventset");

//clear the event set options
for (var i = selecteventset.options.length - 1; i >= 0; i--)
	{
	selecteventset.remove(i);
	}
//refill it
for (var i = eventsetsinfo.length - 1; i >= 0; i--)
	{
	var option = document.createElement("option");
	option.text = eventsetsinfo[i].name;
	option.value = eventsetsinfo[i].id;
	selecteventset.add(option);
	}

}

function updateEventSetSelect (eventsetselectedval) {
//variable to the event selection bar
var selecteventset = document.getElementById("selecteventset");
var index;
for (var i = selecteventset.options.length - 1; i >= 0; i--)
	{
	if ( selecteventset[i].value == eventsetselectedval)
		{
		index = i;
		break;
		}
	}
selecteventset.selectedIndex = index;
}