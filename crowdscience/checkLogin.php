<?php
	/*!
		\file checkLogin.php
		\brief Checks if a username is stored in the session data.
		\details
		This file will start a session if one has not already been started, and then check to see if there is a username stored in that session. If one is stored, then the status is set to zero, and the status and session username are encoded for javascript and returned to the javascript when the php script has finished. If there is no username stored in the session data, a status of one is encoded and returned to the javascript.
		*/
	header('content-type: text/json; charset=utf-8');
	
	session_start();
	
	if(isset($_SESSION['username']))
	{
		$status = array('username' => $_SESSION['username'], 'status' => 0 );
		echo json_encode($status);
	}
	else
	{
		$status = array('status' => 1 );
		echo json_encode($status);
	}
	
?>