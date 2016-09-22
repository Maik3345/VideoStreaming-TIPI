<?php
	header('Access-Control-Allow-Origin: *');
	clearstatcache();
	if(isset($_POST["id"])){
	  $sala = rand(1000000000,9999999999);
	  $objectUrl = new stdClass();
	  //$objectUrl->url = "http://54.163.38.55:8080/r/".$sala;
	  $objectUrl->url = "http://apprtc.ingeneo.co/r/".$sala;
	  $url_movil = json_encode($objectUrl);
	  //$url_web = "http://54.163.38.55:8080/r/".$sala."?video=false&audio=false";
	  $url_web = "http://apprtc.ingeneo.co/r/".$sala."?video=false&audio=false";

	  $file_data = $url_web."\n";
	  $nombreArchivo = "file/link2.txt";
	  if(file_exists("file/link2.txt"))unlink($nombreArchivo);
	  $fp = fopen($nombreArchivo, "w+");
	  fputs($fp, $file_data);
	  fclose($fp);

	  $file_data = $_POST["id"]."\n";
	  $nombreArchivo = "file/id2.txt";
	  if(file_exists("file/id2.txt"))unlink($nombreArchivo);
	  $fp = fopen($nombreArchivo, "w+");
	  fputs($fp, $file_data);
	  fclose($fp);

      echo($url_movil);
      exit();
   }
	$f = fopen('services/file/link2.txt', 'r');
	$line2 = fgets($f);
	fclose($f);

	$f = fopen('services/file/id2.txt', 'r');
	$id_equipo2 = fgets($f);
	fclose($f);
?>
