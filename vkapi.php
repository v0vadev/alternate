<?php
require $_SERVER['DOCUMENT_ROOT'].'/altvk/libs/Request.php';
$get = $_GET;
if(isset($get['method']) && isset($get['params']) && isset($get['values'])){
$params = explode('|', $get['params']);
$values = explode('|', $get['values']);
$par = [];
for($i = 0; $i < count($params); $i++){
$par[$params[$i]] = $values[$i];
}
$request = new Request('https://api.vk.com/method/'.$get['method'], $par);
$request->send();
echo $request->getResult();
}
?>