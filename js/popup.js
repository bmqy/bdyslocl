// 更新链接列表
chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendRequest(tab.id, {
        action: "getBdysls"
    }, function(response) {
        if(response.result){
            $('.bdyslocl-bd').empty().append(response.result);
        }
    });
});

// 自动登录百度云分享链接
$('.bdyslocl-bd').delegate('a', 'click', function () {
    var sPswd = $(this).attr('data-pswd');
    localStorage.setItem('autoLoginPswd', sPswd);
});

document.addEventListener('DOMContentLoaded', function(){
    $('#name').text(chrome.runtime.getManifest().name);
    $('#author').text(chrome.runtime.getManifest().author);
    $('#website').attr('href', chrome.runtime.getManifest().homepage_url);
    $('#version').text(chrome.runtime.getManifest().version);
});