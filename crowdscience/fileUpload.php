<?php

header('Content-Type: text/json; charset=utf-8');

try {
	require 'config.php';
	
    $grid = $db->getGridFS();
	$response["status"] = 0;
	foreach($_FILES as $file)
	{
		$name = $file['name'];        // Get Uploaded file name
		$type = $file['type'];        // Try to get file extension
		$exif = exif_read_data($file['tmp_name'], 0, true);
		
		$latitude = getCoordinates($exif['GPS']["GPSLatitude"], $exif['GPS']['GPSLatitudeRef']);
		$longitude = getCoordinates($exif['GPS']["GPSLongitude"], $exif['GPS']['GPSLongitudeRef']);
		$metadata = array( "pos" => array("lon" => $longitude, "lat" => $latitude)  );
		
		$id = $grid->storeFile($file['tmp_name'],$metadata);    // Store uploaded file to GridFS
		$response["images"][] = array('id' => $id, 'lat' => $latitude, 'lon' => $longitude);
		
		
	
	}
	print json_encode($response);
} catch (RuntimeException $e){ 
    echo $e->getMessage();
}
function getCoordinates($exifCoord, $hemi)
{
	$degrees = count($exifCoord) > 0 ? gps($exifCoord[0]) : 0;
	$minutes = count($exifCoord) > 1 ? gps($exifCoord[1]) : 0;
	$seconds = count($exifCoord) > 2 ? gps($exifCoord[2]) : 0;
	$sign = ($hemi == 'W' or $hemi == 'S') ? -1 : 1;
	
	return $sign * ($degrees + $minutes/60 + $seconds/3600);
}

function gps($coordPart)
{
    $part = explode('/', $coordPart);
    if (count($part) <= 0) 
      return 0;
    if (count($part) == 1)
      return $part[0];
	  
	return floatval($part[0])/floatval($part[1]);	  
}
?>