<?php
	header('content-type: text/json; charset=utf-8');	
	
	//connect to DB
	require 'config.php';
	if($db === false){
		return;
	}
	
	//get request info
	$postdata = file_get_contents('php://input');
	$request = json_decode($postdata , true);
	$action = $request["action"];
	
	session_start();
	
	switch($action)
	{
		default:
		$response["status"] = 1; 
		$response["messages"][] = "No action"; 
		break;
		//Refresh the Event Set Options
		case "updateoptions":
		$response = updateEventSetOptions();
		break;
		//Change the Event Set Selection
		case "changeselection":
		$response = changeEventSetSelection();
		break;
		//update the Event Set Table
		case "updatetable":
		$response = updateEventSetTable();
		break;
	}
	echo json_encode($response);
	
	function updateEventSetTable()
	{
		
		global $db,$response,$request;
		$response["status"] = "0";
		
		$eventset = $request["eventsetselection"];
		
		$eventdata = $db->$eventset;
		$eventsetsinfo = $db->eventsetsinfo;
		
		$eventsetinfo = $eventsetsinfo->findOne( array('id' => $eventset), array('details', '_id' => 0) );
		foreach ($eventsetinfo['details'] as $detail) {
			$response["details"][] = $detail;
		}
		
		$cursor = $eventdata->find();
		foreach ($cursor as $event) {
			try
			{
				$userinfo = $usertable->findOne(array('_id' => $event['user']));
			}
			catch (MongoException $e)
			{
				$response["status"] = 1; 
				$response["messages"][] = "$e->getMessage()";
				return;
			}
			$event['user'] = $userinfo['details']['fname'] + " " + $userinfo['details']['lname'] ;
			$date = $event['details']['date'];
			$date = $date->sec;
			$date = date("Y-m-d", $date);
			$event['details']['date'] = $date;
			
			$response[] = $event;
		}
		
		
		
		return $response;
	}
	
	function changeEventSetSelection()
	{
		global $db,$response,$request;
		$response["status"] = "0";
		
		//put the new selection in session and response
		$_SESSION['eventsetselection'] = $request["eventsetselection"];
		$response["eventsetselection"] = $request["eventsetselection"];
		
		//collection to use
		$eventsetsinfo = $db->eventsetsinfo;
		//Get all event sets info
		$cursor = $eventsetsinfo->find();
		
		//get a list of collections and add to response
		foreach ($cursor as $eventsetinfo) {
			$response["eventsetsinfo"][] = $eventsetinfo;
		}
		return $response;
	}
	
	
	function updateEventSetOptions()
	{
		global $db,$response,$request;	
		$response["status"] = "0";
		
		//get the previously selected event set
		if(isset($_SESSION['eventsetselection'])) {
			$response["eventsetselection"] = $_SESSION['eventsetselection'];
		}
		
		//collection to use
		$eventsetsinfo = $db->eventsetsinfo;
		//Get all event sets info
		$cursor = $eventsetsinfo->find();
		
		//get a list of collections and add to response
		foreach ($cursor as $eventsetinfo) {
			$response["eventsetsinfo"][] = $eventsetinfo;
		}
		
		return $response;
	}
	
?>