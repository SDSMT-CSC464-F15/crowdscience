$(function () {

alert('Got Bugs? I don\'t anymore, apparently!!');
	refreshEventSetSelect();

//$("#selecteventset").on('change', function() { changeEventSetSelect(); });


});

function changeEventSetSelect (argument) {
//go to the php, do the db
//var collection = document.getElementById("selecteventset")[document.getElementById("selecteventset").selectedIndex].value;

var request = {"action" : "change"}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		//if (data.status == 0) 
			updateEventSetOptions(data);
			//updateEventSetSelect(data.eventsetselect);
			
	})
	.fail(function(data) {
		alert(data.status+' Got Bugs? PHP sure does!')
	})
}

function refreshEventSetSelect (argument) {

var request = {"action" : "refresh"}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		if (data.status == 0){ 
			updateEventSetOptions(data);
			//updateEventSetSelect(data.eventsetselect);
			}
			else alert('Got Bugs? PHP sure does! Status wasn\'t 0!');
			
	})
	.fail(function(data) {
		alert(data.status+' Got Bugs? PHP sure does!')
	})
}

function updateEventSetOptions (eventsetsinfo)
{
//for (var i = $("#selecteventset").options.length - 1; i >= 0; i--)
//	{
//	$("#selecteventset").remove(i);
//	}

$("#selecteventset").empty();
//refill it
for (var i = eventsetsinfo.length - 1; i >= 0; i--)
	{
	
	$("#selecteventset").add('<option value=\"'+ eventsetsinfo[i].id +'\">'+eventsetsinfo[i].name+'</option>');
	
	
	//var option = document.createElement("option");
	//option.text = eventsetsinfo[i].name;
	//option.value = eventsetsinfo[i].id;
	//$("#selecteventset").add(option);
	}

}

function updateEventSetSelect (eventsetselectedval) {

var index;
for (var i = $("#selecteventset").length - 1; i >= 0; i--)
	{
	if ( $("#selecteventset")[i].value == eventsetselectedval)
		{
		index = i;
		break;
		}
	}
$("#selecteventset").selectedIndex = index;
}