<?php
require $_SERVER['DOCUMENT_ROOT'].'/altvk/libs/Request.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/altvk/libs/vkapi.php';
$get = $_GET;
if($get['method'] == 'auth'){
$params = explode('|', $get['params']);
$par = array('grant_type' => 'password', 'scope' => 2047135, 'client_id' => 2274003, 'client_secret' => 'hHbZxrka2uZ6jB1inYsH', 'username' => $params[0], 'password' => $params[1]);
if(isset($params[2]) && isset($params[3])){
$par['captcha_sid'] = $params[2];
$par['captcha_key'] = $params[3];
}
$request = new Request('https://api.vk.com/oauth/token', $par);
$request->send();
$res = $request->getResult();
echo $res;
}
if($get['method'] == 'wall.photo'){
	$type = $_FILES['file']['type'];
	if($type == 'image/png' || $type == 'image/jpeg'){
	$uploaddir = $_SERVER['DOCUMENT_ROOT'].'/altvk/tmp/'.strtotime("now").'.jpg';	if(move_uploaded_file($_FILES['file']['tmp_name'], $uploaddir)){
			$url = json_decode(VKapi('photos.getWallUploadServer', 'access_token|v', $_COOKIE['token'].'|5.73'))->response->upload_url;
	$options = [
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_HEADER => false, // don't return headers
	CURLOPT_AUTOREFERER => true, // set referer on redirect
	CURLOPT_SSL_VERIFYPEER => false,
	CURLOPT_POST => 1,
	CURLOPT_POSTFIELDS => [
	'photo' => new CURLFile($uploaddir)
	]
	];
$ch = curl_init($url);
curl_setopt_array($ch, $options);
$res = json_decode(curl_exec($ch));
curl_close($ch);
$server = urlencode($res->server);
$photo = urlencode($res->photo);
$hash = urlencode($res->hash);
$photo = VKapi('photos.saveWallPhoto', 'server|photo|hash|access_token|v', $server.'|'.$photo.'|'.$hash.'|'.$_COOKIE['token'].'|5.73');
unlink($uploaddir);
echo $photo;
	} else{
		echo 'error';
	}
	} else{
		$response = [
		'er' => 'Некорректный тип файла'
		];
		echo json_encode($response);
	}
}
?>