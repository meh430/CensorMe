chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [new chrome.declarativeContent.PageStateMatcher({})],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        console.log("url: " + tab.url);
        let currUrl = tab.url;
        chrome.runtime.sendMessage({ tabUrl: currUrl });
        let views = chrome.extension.getViews({
            type: "popup",
        });
        for (let i = 0; i < views.length; i++) {
            views[i].document.getElementById("currentSite").innerHTML = "Current Site: " + currUrl;
        }
    });
});
