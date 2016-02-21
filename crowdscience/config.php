<?php
	/*********************
		Add global configuration variables here, including session
		specific data. Connecting to the database should happen here
	*********************/
	
	//ini_set('display_errors', 1);
	
	try
	{
		// connect
		$m = new MongoClient();
		
		// select a database
		$db = $m->crowdsciencemapper;
		
	}
	catch (MongoException $e)
	{
		echo $e->getMessage();
		exit;
	}
	session_start();	
	
	
	
?>