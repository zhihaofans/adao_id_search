function search(id){
	$('.search-bar input[type=text]').prop('disabled', true);
	$('.btn-search').addClass('disabled');
	$('.table-result>caption').text('搜索中...');
	$('.table-result>tbody').html('');
	var result = $.ajax({
		url: 'api.php?id=' + id,
		dataType: 'json'
	}).success(function(data){
		$('.table-result>caption').text('搜索到：' + data.length + ' 条记录，点击串号跳转。');
		data.sort(function(x, y){
			x = parseInt(x);
			y = parseInt(y);
			if (x < y) {
				return 1;
			}
			if (x > y) {
				return -1;
			}
			return 0;
		});
		data.forEach(function(tid){
			var tr = '<tr>';
			tr += '<td><a href="https://h.nimingban.com/t/'+tid+'">';
			tr += 'No.' + tid + '</a>';
			tr += '</td><td>';
			tr += '<a href="https://h.nimingban.com/t/' + tid + '">跳转</a> ';
			tr += '<a target="_blank" href="https://h.nimingban.com/t/' + tid + '">新窗口</a>';
			tr += '</td></tr>';
			$(tr).appendTo('.table-result>tbody');
		});
	}).error(function() {
		$('.table-result>caption').text('搜索到：0 条记录。');
	}).done(function(){
		$('.search-bar input[type=text]').prop('disabled', false);
		$('.btn-search').removeClass('disabled');
	});
}
$('.btn-search').click(function(e){
	var id = $('.search-bar input[type=text]').val();
	id&&search(id);
	e.preventDefault();
});
$('.search-bar input[type=text]').keydown(function(e){
	e.keyCode===13&&$('.btn-search').click();
});