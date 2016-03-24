<?php
	/*!
		\file config.php
	\brief Global PHP configuration variables here. 
	\details 
This file connects to the mongo database, and then starts a user session, if one has not already bene started. 
*/
	
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