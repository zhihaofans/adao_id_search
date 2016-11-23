<?php
if (empty($_GET['id'])||empty($_GET['page'])) {
	exit();
} else {
	$id = urlencode($_GET['id']);
	$page = (int)$_GET['page'];
}
set_time_limit(0);
//https://www.googleapis.com/customsearch/v1?key=AIzaSyAU5SSVwNOYGZdep1gxllGIxSOIixDGl_k&cx=012357473881845495153:tuxh8v2wloc&q=iFZo5nu&start=21&filter=0
//$key = 'AIzaSyAU5SSVwNOYGZdep1gxllGIxSOIixDGl_k';
$keys=[
        'AIzaSyAU5SSVwNOYGZdep1gxllGIxSOIixDGl_k',//原作者wsdzl的key
        'AIzaSyCzGTfbxsRIfL-52OztEYDAcQVJZFIxXok',
        'AIzaSyCGuHQFeYdCy5wouEEbAOICe14KOloAUKA'
    ];
$keyn=rand(0,count($keys)-1);
$key=$keys[$keyn];
$cx = '012357473881845495153:tuxh8v2wloc';
$query_url = 'https://www.googleapis.com/customsearch/v1?key='.$key.'&cx='.$cx.'&q=inurl:/t/+'.$id.'&filter=0';
$re = '|h.nimingban.com/\S+?/(\d+)\S*?|';

/* 函数定义开始 */
function getHTTPS($url) {
    $ch = curl_init();
    // curl_setopt($ch,CURLOPT_PROXYTYPE,CURLPROXY_SOCKS5);//使用了SOCKS5代理   
    // curl_setopt($ch, CURLOPT_HTTPPROXYTUNNEL, 1);//如果是HTTP代理
    // curl_setopt($ch, CURLOPT_PROXY, "http://127.0.0.1:1080"); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_REFERER, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}
function getPage ($page, $query_url, $re) {
	$url = $query_url.'&start='.(($page-1)*10+1);
	$html = getHTTPS($url);//var_dump($html);exit;
	$data = json_decode($html, true);//var_dump($url);print_r($data['items']);exit;
	if (!isset($data['items'])) {
		return false;
	}
	$result = array();
	foreach ($data['items'] as $k => $v) {
		$tmp = array();
		if (preg_match($re, $v['link'], $tmp)>0) {
			$result[] = $tmp[1];
		}
	}
	return $result;
	
}
/* 函数定义结束 */

//开始搜索
$result = getPage($page, $query_url, $re);
if ($result===false) {
	echo 'null';
} else {
	$result = array_unique($result);
	$result = array_values($result);
	echo json_encode($result);
}