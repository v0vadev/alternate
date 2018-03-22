<?php
require $_SERVER['DOCUMENT_ROOT'].'/altvk/libs/Request.php';
$get = $_GET;
if(isset($get['method']) && isset($get['params']) && isset($get['values']) && isset($get['client'])){
$params = explode('|', $get['params']);
$values = explode('|', $get['values']);
$par = [];
if($get['client'] == 1){
	//android
	$ua = 'VKAndroidApp/4.13.1-1206 (Android 7.1.2; SDK 25; armeabi-v7a; Xiaomi Redmi 4X; ru);';
}
if($get['client'] == 2){
	//kate
	$ua = 'KateMobileAndroid/48.1 lite-431 (Android 7.1.2; SDK 25; arm64-v8a; Xiaomi Redmi 4X; ru);';
}
for($i = 0; $i < count($params); $i++){
$par[$params[$i]] = $values[$i];
}
$request = new Request('https://api.vk.com/method/'.$get['method'], $par, $ua);
$request->send();
echo $request->getResult();
}
?>