<?php
	
	require 'config.php';

	//$postdata = file_get_contents('php://input');
	//$request = json_decode($postdata , true);
	
	$request = $_GET["_id"];

	//var_dump($request);

	$grid = $db->getGridFS();
	$file = $grid->get(new MongoId($request));
	//$filestream = $file->getResource();
	header("Content-Type: image/jpeg");
	echo $file->getBytes();
	
	// while (!feof($filestream)) {
 //    echo fread($filestream, $file->getSize());
	// }
?>