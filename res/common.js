var
	all = [],
	btnSearch = $('.btn-search'),
	searchBar = $('.search-bar input[type=text]'),
	caption = $('.table-result>caption'),
	tbody = $('.table-result>tbody');
function mergeSort (arr1,arr2){
	var arr = arr1.slice();
	for(var i=0;i<arr2.length;i++){
		arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
	}
	arr.sort(function(a, b){
		return b - a;
	});
	return arr;
}
function getPage (id, page, use) {
	caption.text('正在搜索第' + page + '页记录...');
	switch(use){
		case '360':
			var url = 'api.php?id=' + id + '&page=' + page;
			break;
		case 'google':
			var url = 'api_g.php?id=' + id + '&page=' + page;
			break;
	}
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(data){
		if (data===null) {
			caption.text('搜索到 ' + all.length + ' 条记录，点击串号跳转。');
			searchBar.prop('disabled', false);
			btnSearch.removeClass('disabled');
		} else {
			tbody.html('');
			all = mergeSort(all, data);
			all.forEach(function(tid){
				var tr = '<tr>';
				tr += '<td><a href="https://h.nimingban.com/t/'+tid+'">';
				tr += 'No.' + tid + '</a>';
				tr += '</td><td>';
				tr += '<a href="https://h.nimingban.com/t/' + tid + '">跳转</a> ';
				tr += '<a target="_blank" href="https://h.nimingban.com/t/' + tid + '">新窗口</a>';
				tr += '</td></tr>';
				$(tr).appendTo(tbody);
			});
			getPage(id, page + 1, use);
		}
	}).error(function() {
		caption.text('搜索到 ' + all.length + ' 条记录，点击串号跳转。');
		searchBar.prop('disabled', false);
		btnSearch.removeClass('disabled');
	});
}
function start (id) {
	all = [];
	searchBar.prop('disabled', true);
	btnSearch.addClass('disabled');
	tbody.html('');
	getPage(id, 1, $('input[name=use]:checked').val());
}
btnSearch.click(function(e){
	var id = searchBar.val();
	id&&start(id);
	e.preventDefault();
});
searchBar.keydown(function(e){
	e.keyCode===13&&btnSearch.click();
});
