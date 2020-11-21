
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

    // make first button
    console.log("Script loaded");
    var buttonLine = document.getElementById("buttonDiv");
    var startBtn = document.createElement("button");
    startBtn.id = "StartButton";
    startBtn.innerHTML = "<h1> Start making your own story </h1>";
    startBtn.addEventListener("click", startBtnClick);
    buttonLine.appendChild(startBtn);

}


function startBtnClick() {

    story = []
    console.log("Start button clicked");
    console.log("Needs to make a request to the ML to get a prompt and options.");

    var prompt = "PROMPT";
    // remove the start button
    var buttonLine = document.getElementById("buttonDiv");
    var btn = event.currentTarget;
    buttonLine.removeChild(btn);


    options = ["Help", "Run", "Walk", "Talk"];


    generateNewButtons(options);
}
function generateNewButtons(options) {

    var buttonLine = document.getElementById("buttonDiv");
    console.log(options);
    for (var i = 0; i < options.length; i++) {
        var btn = document.createElement("button");
        btn.id = "OptionButton" + i.toString();
        btn.innerHTML = options[i].toString();
        btn.addEventListener("click", function () {
            optionSelection(i);
        });
        buttonLine.appendChild(btn);
    }

    var endBtn = document.createElement("button");
    endBtn.id = "EndButton";
    endBtn.innerHTML = "The End.";
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
    removeAllChildNodes(buttonLine);
    console.log("removed buttons");
}

function optionSelection(x) {
    var btn = event.currentTarget;
    var option = btn.innerHTML;
    console.log("Selection : " + option);
    removeAllChildNodes(document.getElementById("buttonDiv"));
    sendOptionSelection(option);

    
}

function sendOptionSelection(prompt,option) {

    AddOptionToStory(prompt,option);


    console.log("sending: " + option);
    var newUrl = Url ;/// + "/" + option.toString();

    fetch(newUrl)
        .then(data => { 
            return data.json()
         })
        .then(res => { 

            var i = Math.floor((Math.random() * 100) + 0); 
            var words = res[i].title;
            console.log(words);
            words = words.split(' ');
            console.log(words);
            
            generateNewButtons(words);
            
        })
        .catch(error => console.log(error))




}

function AddOptionToStory(prompt,option){
    story.push( prompt + " " + option);
}
function exportStory(){
    
}