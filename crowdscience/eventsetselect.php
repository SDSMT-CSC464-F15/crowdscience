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

//clear the session's previously selected event
$_SESSION['eventsetselect'] = $request["eventsetselect"];

foreach ($cursor as $eventsetinfo) {
		$response["eventsetsinfo"][] = $eventsetinfo;
	}
	return $response;

}


function refreshEventSetSelect()
{
	global $db,$response,$request;
	
	//session_start();
	//if(isset($_SESSION['eventsetselect'])) {
		$response["status"] = "0";
	//	//get the previously selected event set
	//	$response["eventsetselect"] = $_SESSION['eventsetselect'];
	//}

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