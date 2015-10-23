<?php

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