<?php
	
	/*!
		\file image.php
		\brief Handles image retrieval from Mongo database.
		\details
		This file establishes the connection to the database, and then verifies that the connection was successful. If the connection was not established, an error will occur when using the GridFS. The id of the picture to find is in the GET part of the post to this PHP file, this id is then used to query the files in the database using the GridFS interface. The bytes of the file in the database with the type of the content, an image, are then echoed back to the page that posted the request. 
	*/
	
	try {
		require 'config.php';
		
		$request = $_GET["_id"];
		
		$grid = $db->getGridFS();
		$file = $grid->get(new MongoId($request));
		
		header("Content-Type: image/jpeg");
		echo $file->getBytes();
	}
	catch (RuntimeException $e)
	{ 
    echo $e->getMessage();
	}
?>