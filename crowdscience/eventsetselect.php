<?php

	header('content-type: text/json; charset=utf-8');	
	
	require 'config.php';
	
	if($db === false){
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
			$response = refresheventsetselect();
			break;
		//Change the selected event set
		case "change":
			$response = changeeventsetselectedval();
			break;
	}
	echo json_encode($response);
	
function changeeventsetselectedval()
{
	global $db,$response,$request;
	$response["status"] = "0";
	session_start();
	
	//put the new selection in
	$_SESSION['eventsetselectedval'] = $request["eventsetselectedval"];
	//add it to the response
	$response["eventsetselectedval"] = $request["eventsetselectedval"];

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


function refresheventsetselect()
{
	global $db,$response,$request;
	$response["status"] = "0";
	session_start();
	
	if(isset($_SESSION['eventsetselectedval'])) {
		//get the previously selected event set
		$response["eventsetselectedval"] = $_SESSION['eventsetselectedval'];
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