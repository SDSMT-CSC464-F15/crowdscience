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
		//get Event Set Info
		case "geteventsetinfo":
		$response = getEventSetInfo();
		break;		
		//get Event Set Data
		case "geteventsetdata":
		$response = getEventSetData();
		break;
		//get Event Set Info and Data
		case "geteventsetinfoanddata":
		$response = getEventSetInfoAndData();
		break;
		//get an Event via ID
		case "geteventbyid":
		$response = getEventByID();
		break;
		//get a Event Set Info and an Event via ID
		case "geteventsetinfoandeventbyid":
		$response = getEventSetInfoAndEventByID();
		break;
	}
	echo json_encode($response);
	
	function getEventSetInfoAndEventByID()
	{
		global $db,$response,$request;
		$response["status"] = "0";
		
		$eventset = $request["eventsetselection"];
		
		$eventdata = $db->$eventset;
		$eventsetsinfo = $db->eventsetsinfo;
		$usertable = $db->user;
		
		$eventsetinfo = $eventsetsinfo->findOne( array('id' => $eventset), array('details', '_id' => 0) );
		foreach ($eventsetinfo['details'] as $detail) {
			$response["details"][] = $detail;
		}
		
		$id = $request["id"];
		
		$eventdata = $collection->findOne(array('_id' => $id));
		
		if(is_null($eventdata))
		{
			$response["status"] = "1"; 
			$response["messages"][] = "Event not found";
			return $response;
		}
		
		try
		{
			$userinfo = $usertable->findOne(array('_id' => $eventdata['user']));
		}
		catch (MongoException $e)
		{
			$response["status"] = 1; 
			$response["messages"][] = "$e->getMessage()";
			return $response;
		}
		$eventdata['user'] = $userinfo['username'];
		$date = $eventdata['details']['date'];
		$date = $date->sec;
		$date = date("Y-m-d", $date);
		$eventdata['details']['date'] = $date;
		
		$response['eventdata'][] = $eventdata;
		return $response;
		
	}
	
	function getEventByID()
	{
		global $db,$response,$request;
		$response["status"] = "0";
		
		$eventset = $_SESSION['eventsetselection'];
		$id = $request["display"]["id"];
		
		
		$collection = $db->$eventset;
		$usertable = $db->user;
		$result = $collection->findOne(array('_id' => new MongoId("$id")));
		
		if(is_null($result))
		{
			$response["status"] = "1"; 
			$response["messages"][] = "Event not found";
			return;
		}
		
		try
		{
			$userinfo = $usertable->findOne(array('_id' => $result['user']));
		}
		catch (MongoException $e)
		{
			$response["status"] = 1; 
			$response["messages"][] = "$e->getMessage()";
			return;
		}
		$result['user'] = $userinfo['username'];
		$date = $result['details']['date'];
		$date = $date->sec;
		$date = date("Y-m-d", $date);
		$result['details']['date'] = $date;
		
		return $result;
	}
	
	function getEventSetInfoAndData()
	{
		global $db,$response,$request;
		$response["status"] = "0";
		
		$eventset = $request["eventsetselection"];
		$eventset = $request["eventsetselection"];
		
		$eventdata = $db->$eventset;
		$eventsetsinfo = $db->eventsetsinfo;
		$usertable = $db->user;
		
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
			$event['user'] = $userinfo['username'];
			$date = $event['details']['date'];
			$date = $date->sec;
			$date = date("Y-m-d", $date);
			$event['details']['date'] = $date;
			
			$response['eventdata'][] = $event;
		}
		
		return $response;
		
	}
	
	function getEventSetInfo()
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
	
	function getEventSetData()
	{
		global $db,$response,$request;
		$response["status"] = "0";
		
		$eventset = $request["eventsetselection"];
		
		$eventdata = $db->$eventset;
		$usertable = $db->user;
		
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
			$event['user'] = $userinfo['username'];
			$date = $event['details']['date'];
			$date = $date->sec;
			$date = date("Y-m-d", $date);
			$event['details']['date'] = $date;
			
			$response['eventdata'][] = $event;
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
		
		//collection to use
		$eventsetsinfo = $db->eventsetsinfo;
		
		//get the previously selected event set
		if(isset($_SESSION['eventsetselection'])) {
			$response["eventsetselection"] = $_SESSION['eventsetselection'];
		}
		//if there isn't one, default to something
		else {
			$firstevent= $eventsetsinfo->findOne();
			$_SESSION['eventsetselection'] = $firstevent['id'];
			$response["eventsetselection"] = $_SESSION['eventsetselection'];
		}
		
		
		//Get all event sets info
		$cursor = $eventsetsinfo->find();
		
		//get a list of collections and add to response
		foreach ($cursor as $eventsetinfo) {
			$response["eventsetsinfo"][] = $eventsetinfo;
		}
		
		return $response;
	}
	
?>