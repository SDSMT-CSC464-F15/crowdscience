$(function () {
	
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
			{updateUserStatus(data.username);}
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
