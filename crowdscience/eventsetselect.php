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

	session_start();
	
	switch($action)
	{
		default:
			$response["status"] = 1; 
			$response["messages"][] = "No action"; 
			break;
		//Refresh the Event Set Selection
		case "refresh":
			$response = refreshEventSetSelect();
			break;
		case "change":
			$response = changeEventSetSelect();
			break;
	}
	echo json_encode($response);
	
function changeEventSetSelect()
{
global $db,$response,$request;

$response["status"] = "0";
session_start();

//put the new selection in
$_SESSION['eventsetselection'] = $request["eventsetselection"];

$response["eventsetselection"] = $request["eventsetselection"];

//collection to use
	$eventsetsinfo = $db->eventsetsinfo;
	//Get all event sets info
	$cursor = $eventsetsinfo->find();

foreach ($cursor as $eventsetinfo) {
		$response["eventsetsinfo"][] = $eventsetinfo;
	}
	return $response;

}


function refreshEventSetSelect()
{
	global $db,$response,$request;
	
	$response["status"] = "0";
	
	session_start();
	if(isset($_SESSION['eventsetselection'])) {
	//get the previously selected event set
		$response["eventsetselection"] = $_SESSION['eventsetselection'];
	}

	//collection to use
	$eventsetsinfo = $db->eventsetsinfo;
	//Get all event sets info
	$cursor = $eventsetsinfo->find();
	
	//get a list of collections and add to response - need name and id
	foreach ($cursor as $eventsetinfo) {
		$response["eventsetsinfo"][] = $eventsetinfo;
	}
return $response;
}

?>