$(function () {
	
alert('Got Bugs? I do! Why does CheckLogin.js work when eventsetselect.js doesn\'t??');

	checkLogin();

	$("#logout").click(function(event) {
		// clear any left over error messages
        event.preventDefault();
	   	$.post( "login.php", "{\"action\" : \"logout\"}" , null, "json")
	   	.always(function(data) {
	   		window.location.href = 'index.html';
	   	})
	   	

    });
	
});

function checkLogin (argument) {
	$.post( "checkLogin.php", null, null, "json")
	.done(function(data) {
		if (data.status == 0) 
			{updateUserStatus(data.username);
			refreshEventSetSelect();}
	})
	.fail(function(data) {
		alert(data.status)
	})
}

function updateUserStatus (username) {
	$("body").data("logged" , true);
	$("body").data("user" , {"username" : username});
	var userglyph = "<span class=\"glyphicon glyphicon-user\"></span>"
	var user = "<a id=\"user-area\" href=\"profile.html\">" + userglyph + " " + $("body").data("user").username + "</a>";
	$("#user-area").replaceWith(user);
	$("#register").hide();
	$("#logout").show();
}

function refreshEventSetSelect (argument) {

var request = {"action" : "refresh"}
	$.post( "eventsetselect.php", JSON.stringify(request), null, "json")
	.done(function(data) {
		//if (data.status == 0) 
			updateEventSetOptions(data);
			//updateEventSetSelect(data.eventsetselect);
	})
	.fail(function(data) {
		alert(data.status)
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
	
	$("#selecteventset").add('<option value=\"'+ eventsetsinfo[i].id +'\">'eventsetsinfo[i].name'</option>');
	
	
	//var option = document.createElement("option");
	//option.text = eventsetsinfo[i].name;
	//option.value = eventsetsinfo[i].id;
	//$("#selecteventset").add(option);
	}

}

