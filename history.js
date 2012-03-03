function loadHistory() {
    if (localStorage["history"]) {
        return JSON.parse(localStorage["history"]);
    }
    return [];
}

function setHistoryMaxSize(size) {
    localStorage["max_size"]=size;
}

function getHistoryMaxSize() {
    if(localStorage["max_size"]) {
        return localStorage["max_size"];
    }
    else {
        return 20;
    }
}

function saveHistory(forms) {
    localStorage["history"] = JSON.stringify(forms);
}

function removeHistory(index) {
    var forms=loadHistory();
    if (index < forms.length) {
        forms.splice(index, 1);
        saveHistory(forms);
    }
}
function truncHistory() {
    var forms=loadHistory();
    var maxSize=getHistoryMaxSize();
    while (forms.length > getHistoryMaxSize()) {
        forms.pop();
    }
    saveHistory(forms);
}

function addHistory(form) {
    var forms=loadHistory();
    forms.unshift(form);
    var maxSize=getHistoryMaxSize();
    while (forms.length > getHistoryMaxSize()) {
        forms.pop();
    }
    saveHistory(forms);
}

function cleanHistory() {
    saveHistory([]);
}
