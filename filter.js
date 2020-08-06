const elementNames = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "article", "section", "header", "span", "ul", "li", "div", "main"]; //, "UL", "LI", "OL"]
let blockedWords = [];
let blockedUrls = [];
let filterOff = false;

const applyFilter = () => {
    if (filterOff) {
        console.log("STOPPED");
        return;
    }

    try {
        chrome.storage.sync.get(["bUrls", "bWords"], (lists) => {
            blockedUrls = lists.bUrls;
            blockedWords = lists.bWords;
            if (!isBlockedUrl()) {
                console.log("blocked list: " + blockedWords);
                elementNames.forEach(elName => {
                    let elementsList = document.querySelectorAll(elName)
                    elementsList.forEach(element => {
                        blockedWords.forEach((word) => {
                            element.innerHTML = replaceOccurrences(element.innerHTML, " " + word);
                            element.innerHTML = replaceOccurrences(element.innerHTML, word + " ");
                            element.innerHTML = replaceOccurrences(element.innerHTML, " " + word + " ");
                        });                        
                    })
                })
                /*for (let i = items.length; i--; ) {
                    if (items[i].nodeName && elementNames.includes(items[i].nodeName)) {
                        blockedWords.forEach((word) => {
                            items[i].textContent = replaceOccurrences(items[i].textContent, word);
                        });
                    } else {
                        continue;
                    }
                }*/
            }
        });
        console.log("finished");
    } catch (err) {
        console.log(err);
    }
};

const startTimer = () => {
    setInterval(applyFilter, 10000);
};

chrome.storage.onChanged.addListener(() => {
    chrome.storage.sync.get(["bWords"], (words) => {
        blockedWords = words.bWords;
        chrome.storage.sync.get(["bUrls"], (urls) => {
            blockedUrls = urls.bUrls;
            applyFilter();
        });
    });

    chrome.storage.sync.get(["globalOff"], (filtOff) => {
        console.log(filtOff.globalOff);
        filterOff = filtOff.globalOff;
        if (!filterOff) {
            startScript();
        }
    });
});

/*function replaceOccurrences(text, oldStr) {
    const reg = new RegExp(oldStr, "gi");
    return text.replace(reg, "BLOCKED");
}*/

function replaceOccurrences(text, oldValue) {
    const pattern = oldValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

    return text.replace(new RegExp(pattern, 'gi'), " BLOCKED ")
}



function startScript() {
    chrome.storage.sync.get(["bUrls"], (urls) => {
        blockedUrls = urls.bUrls;
        if (isBlockedUrl()) {
            console.log("whitelisted url");
        } else {
            window.addEventListener("load", applyFilter, false);
            window.addEventListener("load", startTimer, false);
        }
    });
}

chrome.storage.sync.get(["globalOff"], (filtOff) => {
    filterOff = filtOff.globalOff;
    console.log(filtOff.globalOff);
    if (!filterOff) {
        startScript();
    }
});

function isBlockedUrl() {
    console.log(blockedUrls);
    const currUrl = window.location.origin;
    console.log(currUrl);
    let blocked = false;
    for (let i = 0; i < blockedUrls.length; i++) {
        if (currUrl.toString().toLowerCase().includes(blockedUrls[i])) {
            console.log("FOUND BLOCKED");
            blocked = true;
            break;
        }
    }

    return blocked;
}
