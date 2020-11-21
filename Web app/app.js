
window.onload = myOnLoad;

var story = [];

const Url = 'https://jsonplaceholder.typicode.com/posts';
const Data = {
    name: "Said",
    id: 23
};
//optional parameters
const otherPram = {
    headers: {
        "content-type": "application/json; charset = UTF-8"
    },
    body: Data,
    method: "POST"

};


function myOnLoad() {

    makeStartButton();


}
function makeStartButton() {
    // make first button
    console.log("Script loaded");
    var buttonLine = document.getElementById("buttonDiv");
    var startBtn = document.createElement("button");
    startBtn.id = "StartButton";
    startBtn.innerHTML = "Start Making a New Story";
    startBtn.className = "button";
    startBtn.addEventListener("click", startBtnClick);
    buttonLine.appendChild(startBtn);

}

function startBtnClick() {

    story = []
    console.log("Start button clicked");
    console.log("Needs to make a request to the ML to get a prompt and options.");


    // remove the start button
    var buttonLine = document.getElementById("buttonDiv");
    // var btn = event.currentTarget;
    removeAllChildNodes(buttonLine);
    // buttonLine.removeChild(btn);

    sendOptionSelection("START","");
    //display prompt
    // var prompt = "PROMPT";
    // setPrompt(prompt);

    // //display button options
    // options = ["Help", "Run", "Walk", "Talk"];
    // generateNewButtons(options);
}
function generateNewButtons(options) {

    var buttonLine = document.getElementById("buttonDiv");
    console.log(options);
    for (var i = 0; i < options.length; i++) {
        var btn = document.createElement("button");
        btn.id = "OptionButton" + i.toString();
        btn.innerHTML = options[i].toString();
        btn.className = "button";
        btn.addEventListener("click", function () {
            optionSelection(i);
        });
        buttonLine.appendChild(btn);
    }

    var endBtn = document.createElement("button");
    endBtn.id = "EndButton";
    endBtn.innerHTML = "The End.";
    endBtn.className = "button";
    endBtn.addEventListener("click", function () {
        endButtonClick();
    })
    buttonLine.appendChild(endBtn);


}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function endButtonClick() {
    console.log("End button clicked");
    var buttonLine = document.getElementById("buttonDiv");
    removeAllChildNodes(document.getElementById("promptBox"));
    removeAllChildNodes(buttonLine);
    console.log("removed buttons");


    // create the export button and the start button
    makeStartButton();
    // make the export button;
    var exportBtn = document.createElement("button");
    exportBtn.id = "ExportButton";
    exportBtn.innerHTML = "Export";
    exportBtn.className = "button";
    exportBtn.addEventListener("click", exportStory);
    buttonLine.appendChild(exportBtn);

}

function optionSelection(x) {
    var btn = event.currentTarget;
    var option = btn.innerHTML;
    var pText = document.getElementById("promptText");
    var prompt = pText.innerHTML;
    console.log("Selection : " + option);
    removeAllChildNodes(document.getElementById("buttonDiv"));
    removeAllChildNodes(document.getElementById("promptBox"));
    sendOptionSelection(prompt, option);

}

function sendOptionSelection(prompt, option) {

    AddToStory(prompt, option);


    console.log("sending: " + option);
    var newUrl = Url;/// + "/" + option.toString();

    fetch(newUrl)
        .then(data => {
            return data.json()
        })
        .then(res => {

            var i = Math.floor((Math.random() * 100) + 0);
            var j = Math.floor((Math.random() * 100) + 0);

            var words = res[i].title;
            words = words.split(' ');
            setPrompt(res[j].title + " _______ ");
            generateNewButtons(words);

        })
        .catch(error => console.log(error))

}
function setPrompt(prompt) {
    var promptLine = document.getElementById("promptBox");
    var text = document.createElement("p");
    text.innerHTML = prompt;
    text.id = "promptText";
    promptLine.appendChild(text);
}

function AddToStory(prompt, option) {
    story.push(prompt + " " + option);
}
function exportStory() {

    console.log(story);
}