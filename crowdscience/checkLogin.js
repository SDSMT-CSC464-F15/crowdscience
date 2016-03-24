/*!
\file checkLogin.js
\brief Contains functions for checking if a user is logged in.
\details 
This file contains $(document).ready(), which sets the function to be called when the document, the HTML loading the JavaScript, has been loaded and is ready to run; and two functions: checkLogin() and updateUserStatus(). The $(document).ready() function calls the checkLogin() function and then generates necessary event handlers. The checkLogin() posts a request to checkLogin.php to see if a user is saved in the session information, when the post completes successfully, the updateUserStatus() function is called.  The updateUserStatus() function updates the HTML according to whether a user is logged in.
*/

/*!
	\brief Calls the checkLogin() function and then generates necessary event handlers
	\details 
 This function calls the CheckLogin() function to see if a user is currently logged in, and then sets the event handler for the logout button click event. The event handler will clear old error messages, and then post to the login.php to clear the user's session data. After posting to the login.php, the user is redirected back to the index.
*/
$(document).ready( function( )
{

	checkLogin();

	$("#logout").click(function(event) {
		// clear any left over error messages
        event.preventDefault();
	   	$.post( "login.php", "{\"action\" : \"logout\"}" , null, "json")
	   	.always(function(data) {
	   		window.location.href = 'index.html';
	   	})
	   	

    });
	
}
);

/*!
	\brief Posts to  checkLogin.php to see if a user is logged in.
	\details 
The function posts to checkLogin.php to see if a user is logged in. When the post to checkLogin.php is complete, the function calls updateUserStatus() with the username returned from the post to checkLogin.php. If the post to checkLogin.php fails, then an alert box will pop up with the status code of the failure.
*/
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

/*!
	\brief Updates the user area on the navigation bar.
	\details 
The function updates the user information stored in the HTML, and then updates the navigation bar. When a user is logged in, the login and register buttons are replaced with a user icon, the username of the user that is logged in, and a logout button.
*/
function updateUserStatus (username) {
	$("body").data("logged" , true);
	$("body").data("user" , {"username" : username});
	var userglyph = "<span class=\"glyphicon glyphicon-user\"></span>"
	var user = "<a id=\"user-area\" href=\"profile.html\">" + userglyph + " " + $("body").data("user").username + "</a>";
	$("#user-area").replaceWith(user);
	$("#register").hide();
	$("#logout").show();
}
