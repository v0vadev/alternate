<?php
function VKapi($method, $params, $values){
$m = file_get_contents('https://'.$_SERVER['HTTP_HOST'].'/altvk/vkapi.php?method='.$method.'&params='.$params.'&values='.$values);
return $m;
}
?>