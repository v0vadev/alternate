<?
require $_SERVER['DOCUMENT_ROOT'].'/altvk/libs/vkapi.php';
$get = $_GET;
$secret = '';
$appid = '6376423';
if(isset($get['code'])){
		$require = json_decode(file_get_contents('https://oauth.vk.com/access_token?client_id='.$appid.'&client_secret='.$secret.'&redirect_uri=https://vkrot.xyz/altvk/&code='.$get['code']));
		if($require != null){
	setcookie('token', $require->access_token);
	setcookie('uid', $require->user_id);
	setcookie('demo', 1);
	}
		echo '<script>
	window.location = "/altvk/";
	</script>';
}
?>
<html>
<head>
 <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#5181B8">
 <meta name="application-name" content="Alternate">
 <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
 <title>Alternate</title>
 <link rel="stylesheet" href="/altvk/css/ae.css?<? echo filectime($_SERVER['DOCUMENT_ROOT'].'/altvk/css/ae.css');?>">
 <link rel="stylesheet" href="/altvk/css/fa.css">
 <link rel="stylesheet" href="/altvk/css/aei.css">
 <link rel="apple-touch-icon" href="/altvk/images/icons/app196.png"/>
 <link rel="apple-touch-icon-precomposed" sizes="128x128" href="/altvk/images/icons/app128.png">
 <link rel="shortcut icon" sizes="196x196" href="/altvk/images/icons/app196.png">
 <link rel="shortcut icon" sizes="128x128" href="/altvk/images/icons/app128.png">
 <link rel="manifest" href="manifest.json">
</head>
<body>
<div class="menu"></div>
<div class="page-content"></div>
<?
if(isset($_COOKIE['token'])){
?>
<div class="navbar">
<button onclick="ae.showMenu()" class="button menu-btn"><i class="aei-menu"></i></button>
<a href="/altvk/" class="title"><i class="aei-logo"></i> Alternate</a>
<div class="bb-navbar"></div>
</div>
<?
} else{
?>
<div class="navbar">
<button class="button menu-btn unlogged"><i class="aei-logo"></i></button>
</div>
<?
}
?>
<div class="preloader"><h1><i class="aei-logo"></i></h1><i class="fa fa-circle-o-notch fa-spin"></i></div>
<div class="cap-div"></div>
<div class="bb-cover"></div>
<script>
 setTimeout(function(){
	var p = document.querySelector('.preloader');
	p.innerHTML += '<br><span style="font-size:12px;">Can\'t load? Check the internet connection</span>';
}, 5000);
</script>
<script src="/altvk/js/jq.js"></script>
<script src="/altvk/js/ae.js?<? echo filectime($_SERVER['DOCUMENT_ROOT'].'/altvk/js/ae.js');?>"></script>
<script src="/altvk/js/script.js?<? echo filectime($_SERVER['DOCUMENT_ROOT'].'/altvk/js/script.js');?>"></script>
<script src="/altvk/js/pages.js?<? echo filectime($_SERVER['DOCUMENT_ROOT'].'/altvk/js/pages.js');?>"></script>
</body>
</html>