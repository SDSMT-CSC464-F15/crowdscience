/*!
	\file login.js
	\brief Contains functions for logging in a user.
	\details 
	This file contains $(document).ready(), which sets the function to be called when the document, the HTML loading the JavaScript, has been loaded and is ready to run; and three functions: POST_CheckLoginStatus(), POST_LoginUser(), and OnLoginSuccess(). The $(document).ready() function calls the POST_CheckLoginStatus() function and then generates necessary event handlers. The POST_CheckLoginStatus() function posts a request to checkLogin.php to see if a user is saved in the session information, if one is, then the user is redirected to the index page. The POST_LoginUser() functions posts a request to login.php to attempt to login in a user. If the post completes successfully, the OnLoginSuccess() function is called. The OnLoginSuccess() function updates the HTML according to whether a user is logged in or the login failed.
*/

/*!
	\brief Calls the POST_CheckLoginStatus() function and then generates necessary event handlers.
	\details 
	This function calls the POST_CheckLoginStatus() function to see if a user is currently logged in, hides the wrongLogin error message, and then sets the event handler for the login form submission event. The event handler will clear old error messages, and then post to the login.php to login the user.
*/
$(document).ready(function(){
	POST_CheckLoginStatus();
	
	document.getElementById("wrongLogin").style.display="none";
	//logging into an existing user
	$("#login_form_id").submit(function(event) {
		// clear any left over error messages
		event.preventDefault();
		POST_LoginUser(); 
	});
});

/*!
	\brief Checks to see if a user is already logged in.
	\details 
	This function posts a request to the checkLogin.php to see if a user is already logged in. If the post doesn't return a 1, indicating a user isn't logged in, then the user is redirected to the index page.
*/
function POST_CheckLoginStatus()
{
	$.post("checkLogin.php")
	.done(function (status) {
		if(status != 1)
		{
			window.location.replace("index.html");
		}
		
	});
}

/*!
	\brief Attempts to login the user.
	\details 
	This function posts a request to login.php with the password and username entered on the login form. If the post is successful, the OnLoginSuccess() function is called. If the post fails, then the error is alerted to the user.
*/
function POST_LoginUser()
{
	var formData = { 
		action: "login",
		login: {
			email : $("#loginEmail").val(),
			password : $("#loginPassword").val()
		}
	};
	
	$.post( "login.php", JSON.stringify(formData), null, "json")
	.done(function(data) {
		OnLoginSuccess(data) ;
	})
	.fail(function(data) {
		alert( "Error logging in user:" + data.responseText);
	})
	.always(function() {
		
	}) ;
}	

/*!
	\brief Handles response from user's login attempt.
	\details
	If the post to login.php returned a status of 1 or 2, the login attempt was unsuccessful, and an error message is displayed. Otherwise, the attempt was successful, and POST_CheckLoginStatus() is called to update the session data, and the user is redirected to the index page. 
*/

function OnLoginSuccess(response)
{
	if(response.status == 1 ) // error processing login
	{    
		document.getElementById("wrongLogin").style.display="";
	}
	else if(response.status == 2)
	{
		document.getElementById("wrongLogin").style.display="";
	}
	else
	{
		POST_CheckLoginStatus();
		window.location.replace("index.html");
		
	}
}