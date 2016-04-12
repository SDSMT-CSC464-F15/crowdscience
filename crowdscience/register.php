<?php
	/*!
		\file register.php
		\brief Attempts to register user in database.
		\details
		This file establishes the connection to the database, and then verifies that the connection was successful. The data in the post message is retrieved and decrypted. The registerUser() is then called.
	*/
	
	header('content-type: text/json; charset=utf-8');
	
	//Include the configuration details including database connection
	require 'config.php';
	
	if( $db === false )
	{
		$response["status"] = 1;
		$response["messages"][] = "Connection to database failed"; 
		
	}
	else 
	{
		// Get request json
		$postdata = file_get_contents('php://input');
		$request = json_decode($postdata , true);
		
		$response = registerUser();
	}
	echo json_encode($response);
	
	/*!
		\brief Attempts to register the user in the database.
		\details
		This fucntion extracts the user details from the request data, and then checks to see if the username or email have already been used in the database. If the username or email have already been used, an error message is added to the response messages, and the status is set to 1. If the username and email haven't been taken, the user is added to the database, the username is added to the session data, and the response status is set to 0, indicating success. 
	*/
	function registerUser()
	{
		global $db,$request;
		$collection = $db->user;
		$arr = $request["register"];
		$username = $arr["username"];
		$email = $arr["email"];
		$pass = $arr["password"];
		$details = $arr["details"];
		$score = 0;
		
		//Check if username is already taken
		$findQuery = array("username" => "$username");
		$found = iterator_to_array($collection ->find($findQuery),FALSE);
		if(count($found) > 0)
		{
			//Return to the webpage that the username is taken 
			$messages[] = "Username taken";
		}
		
		//Check if email already used
		$findQuery = array("email" => "$email");
		$found = $collection ->findOne($findQuery);
		if(count($found) > 0)
		{
			//Return to the webpage that the email is already used
			$messages[] = "Email used";
		}
		
		// add a record if there were no messages added to the response
		if(count($messages) == 0)
		{
			$document = array( "username" => "$username", "email" => "$email", "password" => "$pass", "score" => "$score", "details" => $details );
			$errors = $collection->insert($document, array( 'w' => 1 ));
			$response["status"] = 0;
			$_SESSION['username'] = $username;
		}
		else
		{
			//Set status to 1. Indicates that user could not be registered
			$response["status"] = 1;
			$response["messages"] = $messages;
		}
		return $response;
	}
?>