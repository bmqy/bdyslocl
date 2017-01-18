// JavaScript Document
function test(){
    alert("我是背景页面");
}
//接收前台发来的信息
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	switch(request.method){
		case "get_pwd":
			sendResponse({passwd:localStorage.getItem("baiduyun_pwd")});
			break;
		case "save_pwd":
			localStorage.setItem("baiduyun_pwd",request.baiduyun_pwd);
			sendResponse({result:localStorage.getItem("baiduyun_pwd")+"密码已保存"});
			break;
		case "save_baiduyun_address":
			//处理多次刷新页面，自动输入离线下载地址的变量0为假，1为真
			localStorage.setItem("first_open","1");
			localStorage.setItem("offonline_url",request.offonline_url);
			sendResponse({result:localStorage.getItem("offonline_url")+"地址已保存"});
			break;
		case "get_offonlie_url":
			sendResponse({first_open:localStorage.getItem("first_open"),result:localStorage.getItem("offonline_url")});
			localStorage.setItem("first_open","0");
			break;
		default:
			break;
	}
		
});
//base64转码至utf8
function decode_base64_toutf8(query){
	$.ajax({
			type:"post",
			url:'https://1024tools.com/base64',
			data:{'query':query, 'type':'decode', 'encoding':'UTF-8'},
			dataType:'json',
			success:function(result){
				$('#message').hide();
				if (result.status == 1) {
					$('#query').val(result.result);
				} else {
					decode_base64_togbk(query);
				}
			}
	})
}
//base64转码至gbk
function decode_base64_togbk(query){
	$.ajax({
			type:"post",
			url:'https://1024tools.com/base64',
			data:{'query':query, 'type':'decode', 'encoding':'GBK'},
			dataType:'json',
			success:function(result){
				$('#message').hide();
				if (result.status == 1) {
					$('#query').val(result.result);
				} else {
					alert("转码不能识别");
				}
			}
	})
}