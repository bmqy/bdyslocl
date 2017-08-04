// 自动登录
var locationUrl=window.location.href;
if(locationUrl.indexOf("pan.baidu.com/share/") != -1){
    if($('#accessCode')){
        chrome.runtime.sendMessage({action: 'getAutoLoginPswd'}, function (response) {
            if(response.autoLoginPswd){
                var sPswd = response.autoLoginPswd;
                $('#accessCode').val(sPswd);
                $('#submitBtn').click();
                chrome.runtime.sendMessage({action: 'removeAtutoLoginPswd'}, function (response) {
                    console.log(response.result);
                })
            }
            else{
                console.log('无密码！');
            }
        })
    }
}

// 获取页面中百度云链接
function getBdysls(){
    var sBdysOpenUrlHttp = 'http';
    // 查找规则（支持自定义密码）
    var reg = /pan\.baidu\.com\/s\/[a-zA-Z0-9]{3,8}(([\s\r]*)密码(：|:|∶)?(\s)?([a-zA-Z0-9]{4}|((\u4e00-\u9fa5){1}(a-zA-Z0-9){1})))?/g;
    // 按查找规则寻找百度云链接，并生成结果集
    var aBdys = [];
    var oBdyslist = '';
    var nOldBdysCount = localStorage.getItem('nOldBdysCount');

    if($("html").text().match(reg)){
        aBdys = $("html").text().match(reg);
        localStorage.setItem('nOldBdysCount', aBdys.length);
    }
    if(aBdys.length > 0){
        // 将找到的链接地址字符串解析为json数据
        for(var i=0;i<aBdys.length;i++){
            var _reg = new RegExp(/密码/);
            var _str = '';
            if(_reg.test(aBdys[i])){
                _str = aBdys[i].replace(/(pan\.baidu\.com\/s\/[a-zA-Z0-9]{3,8})(([\s\r]*)密码(：|:|∶)?(\s)?)([a-zA-Z0-9]{4}|((\u4e00-\u9fa5){1}(a-zA-Z0-9){1}))/g, '{"link":"$1", "pswd":"$6"}');
            }
            else{
                _str = aBdys[i].replace(/(pan\.baidu\.com\/s\/[a-zA-Z0-9]{3,8})/g, '{"link":"$1"}');
            }
            aBdys[i] = JSON.parse(_str);
        }

        for (var j = 0; j < aBdys.length; j++) {
            var oBdyslistAtitle = '';
            if (aBdys[j].pswd) {
                oBdyslistAtitle = '地址：' + aBdys[j].link + '\n密码：' + aBdys[j].pswd;
                oBdyslist += '<p><a href="' + sBdysOpenUrlHttp + '://' + aBdys[j].link + '" data-pswd="'+ aBdys[j].pswd +'" target="_blank" title="' + oBdyslistAtitle + '">' + (j + 1) + '、' + aBdys[j].link + '</a></p>';
            }
            else {
                oBdyslistAtitle = '地址：' + aBdys[j].link;
                oBdyslist += '<p><a href="' + sBdysOpenUrlHttp + '://' + aBdys[j].link + '" target="_blank" title="' + oBdyslistAtitle + '">' + (j + 1) + '、' + aBdys[j].link + '</a></p>';
            }
        }

        if($('.bdys_webpage_inner_tips').size()==0){
            var oBdysWebpageInnerTips = $('<div class="bdys_webpage_inner_tips"><p>本页发现 <span class="bdys_webpage_inner_tips_num"></span> 条百度云链接！</p></div>');
            var oBdysWebpageInnerTipsStyle = $('<style>.bdys_webpage_inner_tips{padding:25px;background-color:rgba(0, 122, 204, 0.9);box-shadow:0 0 18px 1px #007acc;position:fixed;top:50%;left:50%;z-index:9999999999;transform:translate(-50%,-50%);}.bdys_webpage_inner_tips p{font-size:18px;color:#fff;}.bdys_webpage_inner_tips span{font-weight:bolder;}</style>');
            oBdysWebpageInnerTips.find('span').text(aBdys.length);
            $('body').append(oBdysWebpageInnerTipsStyle,oBdysWebpageInnerTips);
            setTimeout(function () {
                oBdysWebpageInnerTips.fadeOut();
            },2000);
        }
        else{
            if(aBdys.length != nOldBdysCount){
                document.querySelector('.bdys_webpage_inner_tips_num').innerHTML = aBdys.length;
                $('.bdys_webpage_inner_tips').fadeIn();
                setTimeout(function () {
                    $('.bdys_webpage_inner_tips').fadeOut();
                },1000);
            }
        }
    }
    else{
        oBdyslist = '<p style="color: #ccc;">未发现百度云分享链接！</p>'
	}
    // 发送角标数字
    chrome.runtime.sendMessage({badge: aBdys.length, action: 'setTabsBadge'}, function (response) {
        console.log(response.result);
    });

    return oBdyslist;
}

// 监听获取页面链接事件
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getBdysls") {
        sendResponse({
            result: getBdysls()
        });
    }
});

// 页面加载完毕后获取链接
document.addEventListener('DOMContentLoaded', function(e){
    getBdysls();
});
// 监听页面变化
document.addEventListener('DOMNodeInserted', function(e){
    getBdysls();
});