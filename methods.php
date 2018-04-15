<?php
require $_SERVER['DOCUMENT_ROOT'].'/altvk/libs/Request.php';
require_once $_SERVER['DOCUMENT_ROOT'].'/altvk/libs/vkapi.php';
$get = $_GET;
if($get['method'] == 'auth'){
if($get['client'] == 1){
	//android
	$client_id = 2274003;
	$client_secret = 'hHbZxrka2uZ6jB1inYsH';
	$ua = 'VKAndroidApp/4.13.1-1206 (Android 7.1.2; SDK 25; armeabi-v7a; Xiaomi Redmi 4X; ru);';
}
if($get['client'] == 2){
	//kate
	$client_id = 2685278;
	$client_secret = 'lxhD8OD7dMsqtXIm5IUY';
	$ua = 'KateMobileAndroid/48.1 lite-431 (Android 7.1.2; SDK 25; arm64-v8a; Xiaomi Redmi 4X; ru);';
}
if(!isset($get['client'])){
	$ar = array('error' => 'invalid_client_id');
	echo json_encode($ar);
}
$params = explode('|', $get['params']);
$par = array('grant_type' => 'password', 'scope' => 2047135, 'client_id' => $client_id, 'client_secret' => $client_secret, 'username' => $params[0], 'password' => $params[1]);
if(isset($params[2]) && isset($params[3])){
$par['captcha_sid'] = $params[2];
$par['captcha_key'] = $params[3];
}
$request = new Request('https://api.vk.com/oauth/token', $par, $ua);
$request->send();
$res = $request->getResult();
echo $res;
}
if($get['method'] == 'wall.photo' && isset($get['client'])){
	$type = $_FILES['file']['type'];
	if($type == 'image/png' || $type == 'image/jpeg'){
	$uploaddir = $_SERVER['DOCUMENT_ROOT'].'/altvk/tmp/'.strtotime("now").'.jpg';	if(move_uploaded_file($_FILES['file']['tmp_name'], $uploaddir)){
			$url = json_decode(VKapi('photos.getWallUploadServer', 'access_token|v', $_COOKIE['token'].'|5.73',$get['client']))->response->upload_url;
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
$photo = VKapi('photos.saveWallPhoto', 'server|photo|hash|access_token|v', $server.'|'.$photo.'|'.$hash.'|'.$_COOKIE['token'].'|5.73',$get['client']);
unlink($uploaddir);
echo $photo;
	} else{
		$response = [
		 'er' => "Couldn't move file"
		];
		echo json_encode($response);
	}
	} else{
		$response = [
		'er' => 'Incorrect file type'
		];
		echo json_encode($response);
	}
}
if($get['method'] == 'refreshToken'){
	$ua = 'KateMobileAndroid/48.2 lite-433 (Android 7.1.2; SDK 25; arm64-v8a; Xiaomi Redmi 4X; ru)';
	$par = [
	 'access_token' => $get['params'],
	 'receipt' => 'd-YrQGj32T8%3AAPA91bE1nbX8t9F0UwtcoLpbPPVW6nUBDnhjtY-QQrHm7ehOZ2-Y7ln4uesfzuMRXwBxu4qfFUzgxBYrDCxGD3Botqry7U3u9od5jxb25cW5zuYKVrcKjfe99y-e2zJVpyfCFfye1niV',
	 'v' => '5.71'
	];
	$req = new Request('https://api.vk.com/method/auth.refreshToken',$par,$ua);
	$req->send();
	echo $req->getJSON()->response->token;
}
?>