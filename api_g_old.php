<?php
if (empty($_GET['id'])||empty($_GET['page'])) {
	exit();
} else {
	$id = $_GET['id'];
	$page = (int)$_GET['page'];
}
set_time_limit(0);
$query_url = 'https://www.google.com/search?q=site:h.nimingban.com+inurl:/t/+'.$id.'&num=20&filter=0';
$re1 = '|<cite.*?h.nimingban.com/\S+?/(\d+)\S*?</cite>|';
$re2 = '|<cite.*?h.nimingban.com\S*?</cite>|';

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
function getPage ($page, $query_url, $re1, $re2) {
	$url = $query_url.'&start='.(($page-1)*20);
	$html = getHTTPS($url);
	$result = array();
	preg_match_all($re1, $html, $result);
	if (preg_match($re2, $html)===0) {
		return false;
	}
	return $result[1];
}
/* 函数定义结束 */

//开始搜索
$result = getPage($page, $query_url, $re1, $re2);
if ($result===false) {
	echo 'null';
} else {
	$result = array_unique($result);
	$result = array_values($result);
	echo json_encode($result);
}