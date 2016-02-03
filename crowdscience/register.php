<?php
header('content-type: text/json; charset=utf-8');

	//Include the configuration details including database connection
	require 'config.php';

	// Get request json
	$postdata = file_get_contents('php://input');
	$request = json_decode($postdata , true);
	//$response = json_encode($request);
	//var_dump($request);
		
	registerUser();
	
	
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
		//$responseXML->addChild("Message", "Username taken");
		$messages[] = "Username taken";
	}
	
		//Check if email already used
	$findQuery = array("email" => "$email");
	$found = $collection ->findOne($findQuery);
	if(count($found) > 0)
	{
		//Return to the webpage that the email is already used
		//$responseXML->addChild("Message", "Email used");
		$messages[] = "Email used";
	}
	
	// add a record if there were no messages added to the response
	if(count($messages) == 0)
	{
		$document = array( "username" => "$username", "email" => "$email", "password" => "$pass", "score" => "$score", "details" => $details );
		$errors = $collection->insert($document, array( 'w' => 1 ));
		//$responseXML->addChild("Status", "0"); 
		//$responseXML->addChild("Message", "Success");
		$response["status"] = 0;
		$_SESSION['username'] = $username;
	}
	else
	{
		//Set status to 1. Indicates that user could not be registered
		//$responseXML->addChild("Status", "1");
		$response["status"] = 1;
		$response["messages"] = $messages;
	}
	echo json_encode($response);
}
?>