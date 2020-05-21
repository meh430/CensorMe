let wordInput = document.getElementById("wordInput");
let currentSite = document.getElementById("currentSite");
let listCont = document.getElementById("listContainer");
let blockedWords = [];
chrome.storage.sync.get(['bWords'], words => {
    listCont = document.getElementById("listContainer");
    blockedWords = words.bWords;
    updateUL();
})

wordInput.addEventListener("keypress", event => {
    if (event.keyCode === 13 || event.which === 13) {
        console.log("PRESSED ENTER!!");
        const enteredWord = wordInput.value;
        wordInput.value = "";
        if (blockedWords.includes(enteredWord)) {
            const error = document.createElement('h5');
            error.appendChild(document.createTextNode(enteredWord + " is already blocked!"));
            document.body.insertBefore(error, listCont);
            setTimeout(() => {
                document.body.removeChild(error);
            }, 3000);
        } else {
            blockedWords.push(enteredWord);
            chrome.storage.sync.set({ bWords: blockedWords }, () => {
                console.log("Added to storage: " + blockedWords);
                updateUL();
            })
        }
    }
});

currentSite.addEventListener("click", event => {
    currentSite.style.color = "green"
});

chrome.tabs.query({
        active: true, lastFocusedWindow: true}, tabs => {
        currentSite.innerHTML = "Current Site: " + tabs[0].url;
    }
);

function updateUL() {
    deleteChildren(listCont);
    let item = {}
    console.log(blockedWords)
    blockedWords.forEach(word => {
        item = document.createElement("li");
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