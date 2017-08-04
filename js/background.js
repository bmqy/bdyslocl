
// 接收事件消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.action == 'setTabsBadge'){
        updateTabsBadge(request.badge);
        sendResponse({result: request.badge});
    }
    else if(request.action == 'getAutoLoginPswd'){
        if(localStorage.getItem('autoLoginPswd')){
            sendResponse({autoLoginPswd: localStorage.getItem('autoLoginPswd')});
        }
        else{
            sendResponse({autoLoginPswd: ''});
        }
    }
    else if(request.action == 'removeAtutoLoginPswd'){
        localStorage.removeItem('autoLoginPswd');
        sendResponse({result: '密码已移除！'});
    }
    else{
        sendResponse({result: '平安无事咯！'});
    }
});

// 更新图标角标
function updateTabsBadge(tabsBadge) {
    chrome.browserAction.setBadgeText({
        text: (tabsBadge > 0) ? ''+ tabsBadge : ''
    });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#007acc' });
}

// 切换标签时更新信息
chrome.tabs.onSelectionChanged.addListener(
    function(tabId, selectInfo) {
        chrome.tabs.sendRequest(tabId, {
            action: "getBdysls"
        });
    }
);