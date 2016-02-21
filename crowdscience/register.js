$(document).ready(function(){
	// clear any error messages"
	document.getElementById("passwordmsg").style.display="none";
	document.getElementById("usernamemsg").style.display="none";
	$("#register_form_id").submit(function(event) {
		event.preventDefault();
		if(($("#new_password1").val()) == ($("#new_password2").val())) // check if passwords match
	    {
			
			registerUser();			
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

function registerUser()
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
		onRegisterSuccess(data) ;
	})
	.fail(function(data) {
		alert( "error:" + data.responseText);
	})
	.always(function() {
		
	}) ;
}

function onRegisterSuccess(response)
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