const elementNames = ["P", "H1", "H2", "H3", "H4", "H5", "H6"]//, "UL", "LI", "OL"]

const applyFilter = () => {
    let items = document.getElementsByTagName("*");
    for (let i = items.length; i--;) {
        if (items[i].nodeName && elementNames.includes(items[i].nodeName)) {
            items[i].textContent = items[i].textContent.replace(/ word /g, ' BLOCKED ')
        } else {
            continue;
        }
    }

    console.log("finished")
}

const startTimer = () => {
    setInterval(applyFilter, 10000);
}


const url = window.location.origin;
console.log(url);
if(!url.toString().toLowerCase().includes("youtube")) {
    window.addEventListener("load", applyFilter, false);
    window.addEventListener("load", startTimer, false);
} else {
    console.log("BLOCKED")
}