chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [new chrome.declarativeContent.PageStateMatcher({})],
                actions: [new chrome.declarativeContent.ShowPageAction()],
            },
        ]);
    });

    //set up storage object on first launch
    //bWords are words blocked by the user. These words will be changed if detected in the DOM
    //bUrls are urls blocked by the user, the content script will not run on these urls
    chrome.storage.sync.set({ bWords: [], bUrls: [], globalOff: false}, () => {
        console.log("Set up storage");
    })
});
