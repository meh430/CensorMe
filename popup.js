let wordInput = document.getElementById("wordInput");
let currentSite = document.getElementById("currentSite");
let listCont = document.getElementById("listContainer");
let wordsTab = document.getElementById("wordsTab");
let urlsTab = document.getElementById("urlsTab");
let currentLocation = "";
let viewingWords = true;
let blockedWords = [];
let blockedUrls = [];

chrome.storage.sync.get(["bWords"], (words) => {
    listCont = document.getElementById("listContainer");
    blockedWords = words.bWords;
    changeTab();
});

wordInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13 || event.which === 13) {
        const enteredWord = wordInput.value;
        wordInput.value = "";
        if (!enteredWord || enteredWord.length === 1) {
            showError("Please enter a word");
        } else if (blockedWords.includes(enteredWord)) {
            showError(enteredWord + " is already blocked!");
        } else {
            blockedWords.push(enteredWord);
            chrome.storage.sync.set({ bWords: blockedWords, bUrls: blockedUrls }, () => {
                console.log("Added to storage: " + blockedWords);
                if (viewingWords) {
                    updateUL(blockedWords);
                }
            });
        }
    }
});

currentSite.addEventListener("click", (event) => {
    if (blockedUrls.includes(currentLocation)) {
        currentSite.style.color = "green";
        const delIndex = blockedUrls.indexOf(currentLocation);
        if (delIndex > -1) {
            blockedUrls.splice(delIndex, 1);
        }
    } else {
        currentSite.style.color = "red";
        blockedUrls.push(currentLocation);
    }

    chrome.storage.sync.set({ bWords: blockedWords, bUrls: blockedUrls }, () => {
        if (!viewingWords) {
            updateUL(blockedUrls);
        }
    });
});

wordsTab.addEventListener("click", (event) => {
    viewingWords = true;
    changeTab();
});

urlsTab.addEventListener("click", (event) => {
    viewingWords = false;
    changeTab();
});

chrome.tabs.query(
    {
        active: true,
        lastFocusedWindow: true,
    },
    (tabs) => {
        currentSite.innerHTML = "Current Site: " + tabs[0].url;
        currentLocation = tabs[0].url;
        chrome.storage.sync.get(["bUrls"], (urls) => {
            blockedUrls = urls.bUrls;
            if (blockedUrls.includes(currentLocation)) {
                currentSite.style.color = "red";
            } else {
                currentSite.style.color = "green";
            }
        });
    }
);

function updateUL(list) {
    deleteChildren(listCont);
    let item = {};
    console.log(list);
    list.forEach((word) => {
        item = document.createElement("li");
        item.className = "itemStyle";
        item.appendChild(document.createTextNode(word));
        listCont.appendChild(item);
    });
}

function deleteChildren(node) {
    console.log(node);
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
}

function showError(errorText) {
    const error = document.createElement("h5");
    error.appendChild(document.createTextNode(errorText));
    error.className = "textElems";
    error.style.textAlign = "center";
    document.getElementById("wrapper").insertBefore(error, document.getElementById("listDivider"));
    setTimeout(() => {
        document.getElementById("wrapper").removeChild(error);
    }, 3000);
}

function changeTab() {
    if (viewingWords) {
        wordsTab.style.backgroundColor = "white";
        wordsTab.style.color = "black";
        urlsTab.style.backgroundColor = "black";
        urlsTab.style.color = "white";
        updateUL(blockedWords);
    } else {
        wordsTab.style.backgroundColor = "black";
        wordsTab.style.color = "white";
        urlsTab.style.backgroundColor = "white";
        urlsTab.style.color = "black";
        updateUL(blockedUrls);
    }
}
