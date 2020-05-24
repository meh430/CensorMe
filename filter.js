const elementNames = ["P", "H1", "H2", "H3", "H4", "H5", "H6"]; //, "UL", "LI", "OL"]
let blockedList = [];

const applyFilter = () => {
    try {
        chrome.storage.sync.get(["bWords"], (words) => {
            blockedList = words.bWords;
            console.log(blockedList);
            let items = document.getElementsByTagName("*");
            for (let i = items.length; i--; ) {
                if (items[i].nodeName && elementNames.includes(items[i].nodeName)) {
                    blockedList.forEach((word) => {
                        items[i].textContent = replaceOccurrences(items[i].textContent, word);
                    });
                } else {
                    continue;
                }
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

const url = window.location.origin;
console.log(url);
if (!url.toString().toLowerCase().includes("youtube")) {
    window.addEventListener("load", applyFilter, false);
    window.addEventListener("load", startTimer, false);
} else {
    console.log("BLOCKED");
}

chrome.storage.onChanged.addListener(() => {
    chrome.storage.sync.get(["bWords"], (words) => {
        blockedList = words.bWords;
    });
});

function replaceOccurrences(text, oldStr) {
    const tempReg = new RegExp(oldStr, "gi");
    return text.replace(tempReg, "BLOCKED");
}
