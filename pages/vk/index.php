<?
$get = $_GET;
$secret = 'lzeQgwkZGX7509hXwS3R';
$appid = '6376423';
if(isset($get['code'])){
	$require = json_decode(file_get_contents('https://oauth.vk.com/access_token?client_id='.$appid.'&client_secret='.$secret.'&redirect_uri=https://vkrot.xyz/altvk/pages/vk&code='.$get['code']));
	setcookie('token', $require->access_token);
	setcookie('uid', $require->user_id);
	setcookie('demo', 1);
	//echo '<script>
	//window.location = "/altvk/";
	//</script>';
	var_dump($require);
	var_dump($_COOKIE);
} else{
	echo 'Some error occured. <a href="/altvk/">Main page</a>';
}
?>