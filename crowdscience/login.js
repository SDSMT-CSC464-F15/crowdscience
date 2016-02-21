$(document).ready(function(){
	checkLoginStatus();
	
	document.getElementById("wrongLogin").style.display="none";
	//logging into an existing user
	$("#login_form_id").submit(function(event) {
		// clear any left over error messages
        event.preventDefault();
	   	loginUser(); 
	});
});

function checkLoginStatus()
{
	$.post("checkLogin.php")
	.done(function (status) {
		if(status != "Not logged in")
		{
			//window.location.replace("index.html");
		}
		
	});
}

function loginUser()
{
	
	var formData = { 
		action: "login",
		login: {
			email : $("#loginEmail").val(),
			password : $("#loginPassword").val()
		}
	};
	
	var login_posting = $.post( "login.php", JSON.stringify(formData), null, "json")
	
	.done(function(data) {
		onLoginSuccess(data) ;
	})
	.fail(function(data) {
		alert( "error:" + data.responseText);
	})
	.always(function() {
		
	}) ;
}	

function onLoginSuccess(response)
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
		checkLoginStatus();
		window.location.replace("index.html");
		
	}
}