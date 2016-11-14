<?php
empty($_GET['id'])?exit():($id=urlencode($_GET['id']));
set_time_limit(0);
$query_url = 'https://www.so.com/s?q=site:h.nimingban.com+'.$id;
$re = '|<cite>h.nimingban.com/t/(\d+)\S*</cite>|';
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
	$url = $query_url.'&pn='.$page;
	$html = getHTTPS($url);
	$result = array();
	preg_match_all($re, $html, $result);
	return count($result[1])===0?false:$result[1];
}
/* 函数定义结束 */

//开始搜索
$all = array();
$page = 1;
while ( ($result=getPage($page, $query_url, $re)) !== false ) {
	$all = array_merge($all, $result);
	$page++;
}
$all = array_unique($all);
$all = array_values($all);
echo json_encode($all);