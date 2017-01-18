// JavaScript Document
	var location_url=window.location.href;
//注入百度云页面
//百度云个人网盘文件首页：https://pan.baidu.com/disk/home#list/path=%2F&vmode=list
if(location_url.indexOf("pan.baidu.com")!=-1){
	var submitBtn_is_exist=$("#submitBtn").text();//用来看百度输入密码界面的按钮是否存在，以确认该页面是否存在。
	if(submitBtn_is_exist!=""){//如果存在，执行这里
		insert_baiduyun_pwd();//调用插入百度云密码函数
	}
	else{//如果不存在，执行这里
		$(document).mousemove(function() {
            offonline_btn=document.getElementById("share-offline-link");
			if(offonline_btn){
				insert_offonline_address();
			}
        });
	}
}

//注入鱼C工作室网站
if(location_url.indexOf("blog.fishc.com")!=-1){
		//添加在新的标签页打开网页
		//$(".article").find("a").attr("target","_blank");
		//屏蔽漂浮的小女生
		$("#spig").remove();
		//获取页面中，百度云下载元素的内容
		var yuc_download=$("#download_button_part").text();
		//判断是否存在，百度云下载元素的内容
		if(yuc_download!=""){
			//如果存在则执行这里
			//通过正则表达式筛选出百度云的密码
			var reg=/百度网盘（密码：.+?）/g;
			yuc_download=yuc_download.match(reg).toString();
			yuc_download=yuc_download.replace("百度网盘（密码：",'');
			yuc_download=yuc_download.replace("）",'');
			//alert(yuc_download);
			var download_url_size=$("#download_button_part").children("a").size();
			baiduyun_url=$("#download_button_part").children("a").eq(download_url_size-1).attr("href");//百度云下载地址
			//插入百度云快捷下载漂浮窗口
			$("#page").append("<a id='baiduyun_url' title='享受影视dy0825.com' href='"+baiduyun_url+"'><div class='post_date' style='width:120px;top:200px;left:64%;color:#FFFFFF;font-size:20px;position:fixed'><span class='date_d' style='font-size:20px;'>百度云地址</span><span class='date_ym'>密码："+yuc_download+"</span></div></a>");
			$("#baiduyun_url").click(function(e) {
           		save_data_to_bgpage(yuc_download);
       		});
			localStorage.setItem("yuc_download",yuc_download);
		}else{
			//如果不存在则执行这里
			click_fenye();
		}
}

//注入BTBTDY.com网站
if(location_url.indexOf("www.btbtdy.com/btdy")!=-1){
	$(".d1").each(function(index, element) {
        $(this).before("<a class='baiduyun' target='_blank' href='https://pan.baidu.com' style='background-color: red'>百度云</a>");
    });
	$(".baiduyun").click(function() {
		var magnet_url=$(".d1").eq($(".baiduyun").index(this)).attr("href");
		save_localstorage_address(magnet_url);
    });
}

//兼容鱼C工作室网站的函数
function click_fenye(){
	var fenye_length=$(".fenye").first().children("a").size();
	fenye_length=fenye_length-2;
	if($(".fenye").first().children("a").eq(fenye_length).attr("href")){
		window.location.href=$(".fenye").first().children("a").eq(fenye_length).attr("href");
	}
}

//存储百度云密码到背景页面
function save_data_to_bgpage(yuc_download){
	//发送一个数据给扩展
	chrome.runtime.sendMessage({baiduyun_pwd:yuc_download,method:"save_pwd"},function(response){
		//接受数据放发来的反馈
		console.log(response.result);
	});
}

//获取背景页的密码，并自动填写百度云密码
function insert_baiduyun_pwd(){
	chrome.runtime.sendMessage({method:"get_pwd"},function(response){
		$("#accessCode").val(response.passwd);
		$("#submitBtn").click();
	});
}

//百度云离线下载地址存储至背景页
/**
* @param string url磁力链接/ed2k/http/https等百度云支持的地址
*/
function save_localstorage_address(url){
	chrome.runtime.sendMessage({offonline_url:url,method:"save_baiduyun_address"},function(response){
		console.log(response.result);
	});
}

//获取背景页的百度云离线下载地址，并自动填写
function insert_offonline_address(){
	chrome.runtime.sendMessage({method:"get_offonlie_url"},function(response){
		if(response.first_open=="1"){//判断是否是第一次打开，是执行这里
			$("#share-offline-link").val(response.result);
		}
	});
}
