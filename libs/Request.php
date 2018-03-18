<?php
class Request{
/**
*@param string $url
*@param array $params
*/
public function __construct($url, $params){
$params1 = http_build_query($params);
$urll = $url.'?'.$params1;
$this->curl = curl_init($urll);
}
public function setup(){
curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1);

curl_setopt($this->curl, CURLOPT_SSL_VERIFYHOST, 0);

curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, 0);

curl_setopt($this->curl, CURLOPT_USERAGENT, 'VKAndroidApp/5.3-1742');
}

public function send(){
$this->setup();
$this->result = curl_exec($this->curl);
}

public function getResult(){
return $this->result;
}

public function getJSON(){
return json_decode($this->result);
}
}
?>