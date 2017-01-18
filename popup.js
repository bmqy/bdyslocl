// JavaScript Document
/*
*	作者：一名法学生
*	创建时间：2016年12月27日
*/
function toggle_qrcode(){
	$("#qrcode").toggle("fast");
}
function open_weibo(){
	window.open("http://weibo.com/5811553848");
}

document.addEventListener('DOMContentLoaded', function(){
  	var weixin_id=document.getElementById('weixin');
    weixin_id.addEventListener('click', toggle_qrcode);
	var weibo_id=document.getElementById('weibo');
    weibo_id.addEventListener('click', open_weibo);
});