let blockedWords = [];
let blockedUrls = [];
let filterOff = false;

const applyFilter = () => {
    if (filterOff) {
        console.log("STOPPED");
        return;
    }

    try {
        if (!isBlockedUrl()) {
            console.log("blocked list: " + blockedWords);
            censor(document.body);
        }

        console.log("finished");
    } catch (err) {
        console.log(err);
    }
};

const startTimer = () => {
    setInterval(applyFilter, 10000);
};

chrome.storage.onChanged.addListener(() => {
    chrome.storage.sync.get(["globalOff", "bWords", "bUrls"], (info) => {
        filterOff = info.globalOff;
        blockedWords = info.bWords;
        blockedUrls = info.bUrls;
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
    const pattern = oldValue.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    return text.replace(new RegExp(pattern, "gi"), "█".repeat(oldValue.length));
}

function censor(node) {
    if (node.hasChildNodes()) {
        node.childNodes.forEach(censor);
    } else if (node.nodeType == Text.TEXT_NODE) {
        if (blockedWords) {
            blockedWords.forEach((word) => {
                node.textContent = replaceOccurrences(node.textContent, word);
            });
        }
    }
}

function startScript() {
    if (isBlockedUrl()) {
        console.log("whitelisted url");
    } else {
        applyFilter();
        startTimer();
        //window.addEventListener("load", applyFilter, false);
        //window.addEventListener("load", startTimer, false);
    }
}

chrome.storage.sync.get(["globalOff", "bUrls", "bWords"], (info) => {
    blockedUrls = info.bUrls;
    blockedWords = info.bWords;
    filterOff = info.globalOff;
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
