<?php
	/*!
		\file report.php
		\brief Handles submitting a report to the database.
		\details
		This file establishes the connection to the database, and then verifies that the connection was successful. The data in the post message is retrieved and decrypted. The action from the post message is then used call a function to interact with the database. Each function will save the status code to the response, in addition to the results of the database query. 
		
		The default action returns a status of 1, indicating that an invalid action was supplied, and a message that no action was taken. When the action is submiteventreport, submitEventReport() is called, which retrieves the information necessary to repopulate the event set selection box. 
		
		The response is then encoded and returned to the JavaScript that posted to this file.
	*/
	
	header('content-type: text/json; charset=utf-8');
	
	require 'config.php';
	
	if($db === false)
	{
		return;
	}
	
	if( $db === false )
	{
		$response["status"] = 1;
		$response["messages"][] = "Connection to database failed"; 
		
	}
	else 
	{
		
		$postdata = file_get_contents('php://input');
		$request = json_decode($postdata , true);
		
		$action = $request["action"];
		
		
		switch($action)
		{
			default:
			$response["status"] = 1; 
			$response["messages"][] = "No action"; 
			break;
			
			//Submit a new event
			case "submiteventreport" :
			$response = submitEventReport();
			break;
			
		}
	}
	echo json_encode($response);
	
	/*!
		\brief Submits report to the database.
		\details
This function retrieves the selected event set from the session data, and then creates a reference to the database table corresponding to that event set. Then, a reference to the table containing user information is also established. The report to submit is retrieved from the request data. The username in the session data is used to find the Mongo ID of the user who submitted the report. If the Mongo query to find the Mongo ID of the user fails, the response status is set to 1, and an error message added to the response, and the function returns. If there is no username stored in the session data, the user is set to anonymous. The coordinates of the event report are then extracted from the request data and made into an array for submitting to the database. The array of image id are then converted to Mongo IDs. The date of the report is converted to a Mongo date. The various parts of the report are combined into an array and added to the database. If the insertion fails, the response status is set to 1, and an error message added to the response, and the function returns.
	*/
	function submitEventReport()
	{
		global $db,$response,$request;
		
		//Collections
		
		$eventset = $request["eventsetselection"];
		
		$collection = $db->$eventset;
		$usertable = $db->user;
		
		//Pull out the "newreport" element
		$newreport = $request["newreport"];
		
		if(isset($_SESSION['username']))
		$user = $_SESSION['username'];
		else
		$user = "Anonymous";
		
		try
		{
			$userinfo = $usertable->findOne(array('username' => "$user"));
		}
		catch (MongoException $e)
		{
			$response["status"] = 1; 
			$response["messages"][] = "$e->getMessage()";
			return;
		}
		$user = new MongoId($userinfo['_id']);
		
		//Get location data, place in $location
		$lat = $newreport["location"]["lat"];
		$long = $newreport["location"]["long"];
		$location = array("type" => "Point", "coordinates" => array((float)$long, (float)$lat));
		
		if (is_null($newreport["images"])) {
			$image_array = null;
		}
		else {;
			//Get image IDs, place in $images
			foreach($newreport["images"] as $imgId)
			{
				$image_array[] = new MongoId("$imgId");
			}
		}
		
		$date = $newreport["details"]["date"];
		$newreport["details"]["date"] = new MongoDate( strtotime($date));
		
		$detail_array = $newreport["details"];
		
		//Add the event to the database
		$id = new MongoId();
		$document = array( "_id" => $id, "user" => $user, "location" => $location, "images" => $image_array, "details" => $detail_array);
		try
		{
			$collection->insert($document, array( 'w' => 1));
			$response["status"] = 0; 
		}
		catch (MongoException $e)
		{
			$response["status"] = 1; 
			$response["messages"][] = "$e->getMessage()";
			return;
		}
	}
	
	
?>