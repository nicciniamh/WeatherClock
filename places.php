<?php
header('Content-type: text/json');
if (file_exists('/sensor/owm/places.json'))
	readfile('/sensor/owm/places.json');
else
	print('{"status": "nodata"}');
?>
