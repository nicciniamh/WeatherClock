<?php
header('Content-type: text/json');
if (file_exists('/sensor/temp.json'))
	readfile('/sensor/temp.json');
else
	print('{"status": "nodata"}');
?>
