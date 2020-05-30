const elementNames = ["P", "H1", "H2", "H3", "H4", "H5", "H6"]; //, "UL", "LI", "OL"]
let blockedWords = [];
let blockedUrls = [];
let filterOff = false;

const applyFilter = () => {
    if (filterOff) {
        console.log("STOPPED");
        return;
    }

    try {
        chrome.storage.sync.get(["bUrls"], (urls) => {
            blockedUrls = urls.bUrls;
            if (!isBlockedUrl()) {
                chrome.storage.sync.get(["bWords"], (words) => {
                    blockedWords = words.bWords;
                    console.log("blocked list: " + blockedWords);
                    let items = document.getElementsByTagName("*");
                    for (let i = items.length; i--; ) {
                        if (items[i].nodeName && elementNames.includes(items[i].nodeName)) {
                            blockedWords.forEach((word) => {
                                items[i].textContent = replaceOccurrences(items[i].textContent, word);
                            });
                        } else {
                            continue;
                        }
                    }
                });
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
    });

    chrome.storage.sync.get(["globalOff"], (filtOff) => {
        console.log(filtOff.globalOff);
        filterOff = filtOff.globalOff;
        if (!filterOff) {
            startScript();
        }
    });
});

function replaceOccurrences(text, oldStr) {
    const tempReg = new RegExp(oldStr, "gi");
    return text.replace(tempReg, "BLOCKED");
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
    const currUrl = window.location.origin;
    console.log(currUrl);
    let blocked = false;
    for (let i = 0; i < blockedUrls; i++) {
        if (currUrl.toString().toLowerCase().includes(blockedUrls[i])) {
            console.log("FOUND BLOCKED")
            blocked = true;
            break;
        }
    }

    return blocked;
}
