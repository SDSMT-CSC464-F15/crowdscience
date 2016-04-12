<?php
	/*!
		\file login.php
		\brief Removes user info from session data if user logs out, and logs in user.
		\details
		This file establishes the connection to the database, and then verifies that the connection was successful. The data in the post message is retrieved and decrypted. The action from the post message is then used to perform an action to interact with the database or session data.
		
		The default action returns a status of 1, indicating that an invalid action was supplied, and a message that no action was taken. When the action is logout, the username is removed from the session data, and the response status is set to 0. When the action is login, the function validateUser() is called to check the user's submitted username and password against the records stored in the database. 
		
		The response is then encoded and returned to the JavaScript that posted to this file.
	*/
	
	header('content-type: text/json; charset=utf-8');
	
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
		
		$action = $request['action'];
		
		switch ($action) {
			case 'logout':
			unset($_SESSION['username']);
			$response['status'] = 0;
			$response['messages'][] = "Logged out";
			break;
			case 'login':
			$response = validateUser();
			break;
			default:
			$response['status'] = 1;
			$response['messages'][] = "No Action";
			break;
		}
	}
	echo json_encode($response);
	
	/*!
		\brief Checks the user's username and password against the username and password stored in the database.
		\details
		This function retrieves the username and password from the request data, and then attempts to find and entry in the user table matching the username. If no entry is found, the response code is set to 1, and "Invalid User" is added to the response message.  If the password does not match the password in the database, then the response code is set to 2, and the "Incorrect Password" message is added to the response. Other wise, the login is considered successful, and the status code is set to 0 for a successful login, and the function returns. 
	*/
	function validateUser()
	{
		global $db,$request;
		$collection = $db->user;
		$arr = $request["login"];
		//The requestxml should give a username field. Allow the user to put either their name or email
		$username = $arr["email"];
		$pass = $arr["password"];
		
		// search for user. Checks the input against the username and email fields.
		$findQuery = array('$or' => array(array('email' => "$username"),array('username' => "$username")) );
		$array = iterator_to_array($collection->find($findQuery),FALSE);
		if(count($array) ==0)
		{
			$response["status"] = 1; 
			$response["messages"][] = "Invalid username"; 
			return $response;
		}
		$dbpass = $array[0]['password'] ;
		if($dbpass == $pass)
		{
			$response["status"] = 0; 
			$response["messages"][] = "Login successful"; 
			
			$_SESSION['username'] = $array[0]['username'];
			return $response;
		}
		else
		{
			$response["status"] = 2; 
			$response["messages"][] = "Password incorrect";
			return $response;
		}
	} 
	
?>