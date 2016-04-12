/*!
	\file register.js
	\brief Contains functions for registering a new user.
	\details 
	This file contains $(document).ready(), which sets the function to be called when the document, the HTML loading the JavaScript, has been loaded and is ready to run; and three functions: POST_RegisterUser() and OnRegisterSuccess(). The $(document).ready() function clears error messages and then generates necessary event handlers. The POST_RegisterUser() function posts a request to register to attempt to register a user. If the post completes successfully, the OnRegisterSuccess() function is called. The OnRegisterSuccess() function updates the HTML according to whether the registration was successful or not.
*/

/*!
	\brief Clears error messages and then generates necessary event handlers.
	\details 
	This function hides the error messages indicating mismatched passwords and or an already taken username, and then sets the event handler for the register form submission event. The event handler will clear old error messages, and if the form passwords match, will call the POST_RegisterUser() function to register the user. If the passwords don't match, the fields are reset, and an error message displayed to the user.
*/
$(document).ready(function(){
	// clear any error messages
	document.getElementById("passwordmsg").style.display="none";
	document.getElementById("usernamemsg").style.display="none";
	$("#register_form_id").submit(function(event) {
		event.preventDefault();
		if(($("#new_password1").val()) == ($("#new_password2").val())) // check if passwords match
		{
			
			POST_RegisterUser();			
		}
		else
		{
			// display error message and clear password fields.
			document.getElementById("passwordmsg").style.display="";
			document.getElementById('new_password1').value = "";
			document.getElementById('new_password2').value = "";
		}
	});
});

/*!
	\brief Attempts to register the user.
	\details 
	This function resets error messages and then adds the form data to the php request, and then posts the request to register.php. If the post is successful, the OnRegisterSuccess() function is called. If the post fails, then the error is alerted to the user.
*/
function POST_RegisterUser()
{
	//Reset error messages
	$("#usernamemsg").hide();
	$("emailmsg").hide();
	
	//json for request
	var formData = { 
		action: "register",
		register: {
			username: $("#new_username").val(),
			email : $("#new_email").val(),
			password : $("#new_password1").val(),
			
			details: {
				lname : $("#lname").val(),
				fname : $("#fname").val(),
				location : $("#location").val(),
				role : $("#role").val()
			}
		}
	};
	
	//post data to server
	var register_posting = $.post( "register.php", JSON.stringify(formData), null, "json" )
	.done(function(data) {
		OnRegisterSuccess(data) ;
	})
	.fail(function(data) {
		alert( "error:" + data.responseText);
	})
	.always(function() {
		
	}) ;
}

/*!
	\brief Handles response from user's register attempt.
	\details
	If the post to register.php returned a status of 1, the register attempt was unsuccessful, and the error message corresponding to the problem with registering is displayed. Otherwise, the attempt was successful, and the user is redirected to the index page. 
*/
function OnRegisterSuccess(response)
{
	if(response.status == 1 ) // error processing login
	{    
		for( var i in response.messages){
			if(response.messages[i] == "Username taken")
			document.getElementById("usernamemsg").style.display="";
			if(response.messages[i] == "Email used")
			document.getElementById("emailmsg").style.display="";
			
		}
	}
	else
	{
		//go back to main page after registering
		window.location.href = 'index.html';
	}
}