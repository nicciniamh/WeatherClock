<?php
$place = $_SERVER['QUERY_STRING'];
$fname = "/sensor/owm/owm-{$place}.json";

header('Content-type: text/json');
if (file_exists($fname))
	readfile($fname);
else {
	$a=array("status" => "nodata",  "place" => $place, "file" => $fname);
	print json_encode($a);
}
?>
