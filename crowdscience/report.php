<?php
	header('content-type: text/json; charset=utf-8');
	
	require 'config.php';
	
	if($db === false)
	{
		return;
	}
	
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
		//update report fields
				case "geteventsetdetails" :
		$response = getEventSetDetails();
		break;
		
	}
	echo json_encode($response);
	
	function getEventSetDetails()
	{
				
		global $db,$response,$request;
		$response["status"] = "0";
		
		$eventset = $request["eventsetselection"];
		
		$eventsetsinfo = $db->eventsetsinfo;
		
		$eventsetinfo = $eventsetsinfo->findOne( array('id' => $eventset), array('details', '_id' => 0) );
		foreach ($eventsetinfo['details'] as $detail) {
			$response["details"][] = $detail;
		}
		
		return $response;
		
		}
	
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
		}
		catch (MongoException $e)
		{
			$response["status"] = 1; 
			$response["messages"][] = "$e->getMessage()";
			return;
		}
	}
	
	
?>