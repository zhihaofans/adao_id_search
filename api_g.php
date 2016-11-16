<?php
if (empty($_GET['id'])||empty($_GET['page'])) {
	exit();
} else {
	$id = urlencode($_GET['id']);
	$page = (int)$_GET['page'];
}
set_time_limit(0);
$query_url = 'https://www.google.com/search?q=site:h.nimingban.com+'.$id.'&num=20';
$re = '|<cite.*?h.nimingban.com/t/(\d+)\S*</cite>|';

/* 函数定义开始 */
function getHTTPS($url) {
	$ch = curl_init();
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
	$url = $query_url.'&start='.(($page-1)*20);
	$html = getHTTPS($url);
	//echo htmlspecialchars($html);exit;
	$result = array();
	preg_match_all($re, $html, $result);
	return count($result[1])===0?false:$result[1];
}
/* 函数定义结束 */

//开始搜索
$result = getPage($page, $query_url, $re);
if (is_array($result)) {
	$result = array_unique($result);
	$result = array_values($result);
	echo json_encode($result);
} else {
	echo '[]';
}