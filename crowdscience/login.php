<?php
	header('content-type: text/json; charset=utf-8');
	
	require 'config.php';
	
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
		echo json_encode($response);
		break;
		default:
		$response['status'] = 1;
		$response['messages'][] = "No Action";
		echo json_encode($response);
		break;
	}
	
	
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