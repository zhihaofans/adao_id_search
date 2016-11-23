var
    web_version='v0.4',
	all = [],
	btnSearch = $('.btn-search'),
	searchBar = $('.search-bar input[type=text]'),
	caption = $('.table-result>caption'),
	tbody = $('.table-result>tbody'),
    search_server=[{"name":"360","url":"api_360.php"},{"name":"google","url":"api_g.php"}];
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
function getPageA (id, page,usen) {
    var use=search_server[usen].name;
	caption.text(use+':正在搜索第' + page + '页记录...');
    // console.log(use+':正在搜索第' + page + '页记录...');
    var url = search_server[usen].url+"?id="+ id + '&page=' + page;
	$.ajax({
		url: url,
		dataType: 'json'
	}).success(function(data){
		if (data===null) {
            console.log("null");
            if(usen==search_server.length-1){
                caption.text('搜索到 ' + all.length + ' 条记录，点击串号跳转。');
                searchBar.prop('disabled', false);
                btnSearch.removeClass('disabled');
            }else{
                getPageA(id, 1, usen+1);
            }
		} else {
            var re_n=data.length;
            // console.log("data"+JSON.stringify(data));
            // for(var b=0;b<re_n;b++){
                // console.log(b+"|"+data[b]);
                // console.log(b+"|"+all.indexOf(data[b]));
                // if(all.indexOf(data[b])===-1){
                    // data.splice(b,1);
                    // b=b-1;
                // }
            // }
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
			getPageA(id, page + 1, usen);
		}
	}).error(function() {
		caption.text('搜索到 ' + all.length + ' 条记录，点击串号跳转。');
		searchBar.prop('disabled', false);
		btnSearch.removeClass('disabled');
	});

}
function getPage (id, page, use) {
	caption.text(use+':正在搜索第' + page + '页记录...');
	switch(use){
		case '360':
			var url = 'api_360.php?id=' + id + '&page=' + page;
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
    $('title').html('A岛饼干侦探 '+web_version);
	all = [];
	searchBar.prop('disabled', true);
	btnSearch.addClass('disabled');
	tbody.html('');
    if($('input[name=use]:checked').val()=="all"){
        getPageA(id,1,0);
    }else{
        getPage(id, 1, $('input[name=use]:checked').val());
    }
}
btnSearch.click(function(e){
	var id = searchBar.val();
	id&&start(id);
	e.preventDefault();
});
searchBar.keydown(function(e){
	e.keyCode===13&&btnSearch.click();
});
