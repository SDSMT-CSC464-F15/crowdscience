<?php
	/*!
		\file event.php
		\brief Handles event data to and from the database.
		\details
		This file establishes the connection to the database, and then verifies that the connection was successful. The data in the post message is retrieved and decrypted. If a session has not been started, a new session is started. The action from the post message is then used call a function to interact with the database. Each function will save the status code to the response, in addition to the results of the database query. 
		
		The default action returns a status of 1, indicating that an invalid action was supplied, and a message that no action was taken. When the action is updateoptions, updateEventSetOptions() is called, which retrieves the information necessary to repopulate the event set selection box. The action changeselection calls changeEventSetSelection(), which stores the new event set selection to session data. The action geteventsetinfo calls getEventSetInfo(), which retrieves all the event set information necessary to display the selected event set data. The action geteventsetdata calls getEventSetData(), which retrieves all event set data for the selected event set. The action geteventsetinfoanddata calls getEventSetInfoAndData, which performs the actions of both getEventSetData() and getEventSetInfo(), this function is implemented because the response data is not correctly assembled separately in the two functions and database queries are streamlined when combined. The action geteventsetinfoandeventbyid calls the getEventSetInfoAndEventByID(), which retrieves the data for a single event, referenced by the ID supplied in the request.
		
		The response is then encoded and returned to the JavaScript that posted to this file.
	*/
	
	header('content-type: text/json; charset=utf-8');	
	require 'config.php';
	
	if( $db === false )
	{
		$response["status"] = 1;
		$response["messages"][] = "Connection to database failed"; 
		
	}
	else 
	{	
		$postdata = file_get_contents( 'php://input' );
		$request = json_decode( $postdata , true );
		$action = $request ["action"];
		
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
			//get a Event Set Info and an Event via ID
			case "geteventsetinfoandeventbyid":
			$response = getEventSetInfoAndEventByID();
			break;
		}
	}
	echo json_encode($response);
	
	/*! 
		\brief Retrieves the data for a single event, referenced by the ID supplied in the request.
		\details
		This function retrieves the selected event set from the session data, and then creates a reference to the database table corresponding to that event set. Then, references to the table of information about the event sets and the table containing user information are also established. The database is then queried using the Mongo database findOne() function, to retrieve the event set details information from the event set information table. If the information retrieved from the database is null, the response status is set to 2, and an error message is added to the response, and the function returns. The details of the event set information are then added to the response. Then the Mongo database is queried with the id of the event report being retrieved. If the query returns null, the response status is set to 3, and error message is added to the response, and the function returns. The user table in the database is then queried to retrieve the username of the author of the event report. If this query fails, the response status is set to 1, an error message is added to the response, and the function returns. The username then replaces the user field in the event report array retrieved from the database. The date of the event report is then parsed into a human readable date and saved in the event report. The event is added to the response, the status is then set to 0, indicating no errors, and the response is returned from the function.
	*/
	function getEventSetInfoAndEventByID()
	{
		global $db,$response,$request;
		
		$eventset = $_SESSION['eventsetselection'];
		$eventdata = $db->$eventset;
		$eventsetsinfo = $db->eventsetsinfo;
		$usertable = $db->user;
		
		$eventsetinfo = $eventsetsinfo->findOne( array('id' => $eventset), array('details', '_id' => 0) );
		if(is_null($eventsetinfo))
		{
			$response["status"] = "2"; 
			$response["messages"][] = "Event Set Info not found";
			return $response;
		}
		foreach ($eventsetinfo['details'] as $detail) {
			$response["details"][] = $detail;
		}
		
		$id = $request['id'];
		
		$event = $eventdata->findOne(array('_id' => new MongoId("$id")));
		
		if(is_null($event))
		{
			$response["status"] = "3"; 
			$response["messages"][] = "Event not found";
			return $response;
		}
		
		try
		{
			$userinfo = $usertable->findOne(array('_id' => $event['user']));
		}
		catch (MongoException $e)
		{
			$response["status"] = "4"; 
			$response["messages"][] = "$e->getMessage()";
			return $response;
		}
		if(!( is_null($userinfo['username'])))
		$event['user'] = $userinfo['username'];
		else $event['user'] = "Anonymous"; 
		$date = $event['details']['date'];
		$date = $date->sec;
		$date = date("Y-m-d", $date);
		$event['details']['date'] = $date;
		
		$response['eventdata'] = $event;
		$response["status"] = "0";
		return $response;
		
	}
	
	/*!
		\brief Performs the actions of both getEventSetData() and getEventSetInfo().
		\details
		This function combines getEventSetData() and getEventSetInfo(). This function was created to solve issues with gathering the full response returned from two separate functions and remove redundancies in the two functions when used together.
		\sa getEventSetData()
		\sa getEventSetInfo()
	*/
	function getEventSetInfoAndData()
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
		
		$cursor = $eventdata->find();
		foreach ($cursor as $event) {
			try
			{
				$userinfo = $usertable->findOne(array('_id' => $event['user']));
			}
			catch (MongoException $e)
			{
				$response["status"] = "1"; 
				$response["messages"][] = "$e->getMessage()";
				return;
			}
			if(!( is_null($userinfo['username'])))
			$event['user'] = $userinfo['username'];
			else $event['user'] = "Anonymous"; 
			$date = $event['details']['date'];
			$date = $date->sec;
			$date = date("Y-m-d", $date);
			$event['details']['date'] = $date;
			
			$response['eventdata'][] = $event;
		}
		
		return $response;
		
	}
	
	/*!
		\brief Retrieves all the event set information necessary to display the selected event set data.
		\details
		This function retrieves the selected event set from the request data, and a reference to the table containing event set information about all event sets is created. The database is queried with the findOne() function to find the event set information specific to the selected event set. If the information retrieved from the database is null, the response status is set to 2, and an error message is added to the response, and the function returns. The details of this event set are added to the response, the status is set to 0, and the function returns this response. 
	*/
	function getEventSetInfo()
	{
		global $db,$response,$request;
		
		$eventset = $_SESSION['eventsetselection'];
		
		$eventsetsinfo = $db->eventsetsinfo;
		
		$eventsetinfo = $eventsetsinfo->findOne( array('id' => $eventset), array('details', '_id' => 0) );
		if(is_null($eventsetinfo))
		{
			$response["status"] = "2"; 
			$response["message"] = "Event Set Info not found";
			return $response;
		}
		foreach ($eventsetinfo['details'] as $detail) {
			$response["details"][] = $detail;
		}
		$response["status"] = "0";
		return $response;
	}
	
	/*!
		\brief Retrieves all event set data for the selected event set.
		\details
		This function retrieves the selected event set from the request data, creates a reference to the table containing all the event set data for the selected event set, and then creates a reference to the user table. The database is then queried with the find() function which returns the contents of the table of selected event set data table. The event data is then looped through. In this loop, the Mongo ID stored in the user field is replaced with the username of the associated user, the date is reformatted into a readable date, and the event report is added to the response data. If the query to retrieve the username associated with the current report fails, then the response status is set to 1, an error message is added to the response, and the function returns.  The details of this event set are added to the response, the status is set to 0, and the function returns this response. 
	*/
	function getEventSetData()
	{
		global $db,$response,$request;
		
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
				$response["status"] = "1"; 
				$response["messages"][] = "$e->getMessage()";
				return;
			}
			if(!( is_null($userinfo['username'])))
			$event['user'] = $userinfo['username'];
			else $event['user'] = "Anonymous"; 
			$date = $event['details']['date'];
			$date = $date->sec;
			$date = date("Y-m-d", $date);
			$event['details']['date'] = $date;
			
			$response['eventdata'][] = $event;
		}
		$response["status"] = "0";
		return $response;
	}
	
	/*!
		\brief Stores the new event set selection to session data.
		\details
		This function retrieves the new selected event from the request data, and saves it to the session and response data. Then, the list of event sets is updated. A reference to the table containing all the information about the event sets is created, and the database is queried with the find() function. The information for the event sets is then added to the response, event set by event set. The status is set to 0, and the function returns this response. 
	*/
	function changeEventSetSelection()
	{
		global $db,$response,$request;
		
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
		$response["status"] = "0";
		return $response;
	}
	
	/*!
		\brief Retrieves the information necessary to repopulate the event set selection box.
		\details
		This function creates a reference to the table containing event set information about all event sets, and then checks to see if an event set is saved in the session data. If an event set selection is saved, then it is added to the response; if not, the first entry in the event set information table is added to the response and saved in the session data. The event set information table in the database is then queried with the find() function. The information for the event sets is then added to the response, event set by event set. The status is set to 0, and the function returns this response. 
	*/
	function updateEventSetOptions()
	{
		global $db,$response,$request;	
		
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
		$response["status"] = "0";
		return $response;
	}
	
?>	