let wordInput = document.getElementById("wordInput");
let currentSite = document.getElementById("currentSite");

wordInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13 || event.which === 13) {
        console.log("PRESSED ENTER!!");
        //TODO: add to storage
        const enteredWord = wordInput.value;
        wordInput.value = "";
    }
});

chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
    }, (tabs) => {
        currentSite.innerHTML = "Current Site: " + tabs[0].url;
    }
);

chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
    console.log("Message recieved");
    currentSite.innerHTML = "Current Site: " + req.tabUrl;
    return true;
});