// 自动登录
var locationUrl=window.location.href;
if(locationUrl.indexOf("pan.baidu.com/share/") != -1){
    if($('#accessCode')){
        chrome.runtime.sendMessage({action: 'getAutoLoginPswd'}, function (response) {
            if(response.autoLoginPswd){
                var sPswd = response.autoLoginPswd;
                $('#accessCode').val(sPswd);
                $('#submitBtn').click();
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
    if($("html").text().match(reg)){
        aBdys = $("html").text().match(reg);
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
getBdysls();

// 监听获取页面链接事件
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getBdysls") {
        sendResponse({
            result: getBdysls()
        });
    }
});
