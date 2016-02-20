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
		case "refresh":
			$response = refreshEventSetSelect();
			break;
		//Change the Event Set Selection
		case "change":
			$response = changeEventSetSelect();
			break;
		case "update":
			$response = updateEventSetData();
			break;
	}
	echo json_encode($response);
	
function updateEventSetData()
{

	global $db,$response,$request;
	$response["status"] = "0";
	
	$eventset = $request["eventsetselection"]

$eventdata = $db->$eventset;
$eventsetsinfo = $db->eventsetsinfo;

$details = $eventsetsinfo->findOne( { id : $eventset } )->details;

$response["details"] = $details;
return $response;
}
	
function changeEventSetSelect()
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


function refreshEventSetSelect()
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