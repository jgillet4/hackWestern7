


var story = [];
// const fs = require('fs');
const host = '127.0.0.1';
const port = "8000";

// const Url = 'https://jsonplaceholder.typicode.com/posts';
const Url = 'http://' + host + ":" + port;


const Data = {

};
//optional parameters
const otherPram = {
    headers: {
        "content-type": "application/json; charset = UTF-8"
    },
    body: Data,
    method: "POST"

};

window.onload = myOnLoad;

function myOnLoad() {

    makeStartButton();


}
// http request to api

function sendOptionSelection(prompt, option) {

    //add last prompt option pair to the list that is the story. 
    AddToStory(prompt, option);

    var newUrl = Url + "/story";/// + "/" + option.toString();


    // old
    // fetch(newUrl)
    //     .then(data => {
    //         return data.json()
    //     })
    //     .then(res => {

    //         var i = Math.floor((Math.random() * 100) + 0);
    //         var j = Math.floor((Math.random() * 100) + 0);

    //         var words = res[i].title;
    //         words = words.split(' ');
    //         setPrompt(res[j].title + " _______ ");
    //         generateNewButtons(words);

    //     })
    //     .catch(error => console.log(error))

    // new attempt
    fetch(newUrl, {
        method: "post",
        headers: {
        },
        //make sure to serialize your JSON body
        body: JSON.stringify({
            m_prompt: prompt,
            m_option: option
        })
    })
        .then(data => {
            //do something awesome that makes the world a better place
            return data.json()
        })
        .then(res => {
            console.log(res);
            var prom = res.m_p;
            var ops = res.m_o;
            console.log("Recieved Options:" + ops);
            ops = ops.split(" "); // spliting. might change. 
            setPrompt(prom);
            generateNewButtons(ops);
        })
        .catch(error =>
            console.log(error)
        );

}


// setting UI element data
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
function setPrompt(prompt) {
    var promptLine = document.getElementById("promptBox");
    var text = document.createElement("p");
    text.innerHTML = prompt;
    text.id = "promptText";
    text.className= "text";
    promptLine.appendChild(text);
}

// helpers or something
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
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function AddToStory(prompt, option) {


    var i = null;
    var t = prompt + " " + option;
    var p = { text: t, image: i }

    story.push(p);//prompt + " " + option);
}
function exportStory() {

    var storyDisplay = document.getElementById("storyBox");
    var storyText = document.createElement("p");
    for(var i= 0; i<story.length; i ++)
    {
        storyText.innerHTML += story[i].text + ". ";
    }  
    storyText.id = "storyText";
    storyText.className= "text";
    storyDisplay.appendChild(storyText);


    // Data which will write in a file. 
    // let data = "Learning how to write in a file."

    // // Write data in 'Output.txt' . 
    // fs.writeFile('Output.txt', data, (err) => {

    //     // In case of a error throw err. 
    //     if (err) throw err;
    // })
}

// button clicks 
function startBtnClick() {

    story = []
    console.log("Start button clicked");
    console.log("Needs to make a request to the ML to get a prompt and options.");


    // remove the start button
    var buttonLine = document.getElementById("buttonDiv");
    // var btn = event.currentTarget;
    removeAllChildNodes(buttonLine);
    // buttonLine.removeChild(btn);

    sendOptionSelection("START", "START");
    //display prompt
    // var prompt = "PROMPT";
    // setPrompt(prompt);

    // //display button options
    // options = ["Help", "Run", "Walk", "Talk"];
    // generateNewButtons(options);
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





// from another project
function saveFileClick() {

    console.log("save");
    //get the shape container;
    var jsonArrData = JSON.stringify(shpCon, null, 2);
    console.log(jsonArrData);
    var fn = document.getElementById("browse").value;
    console.log(fn);
    fn = fn.toString().trim();
    fn += ".json";
    var a = document.createElement("a");

    a.href = URL.createObjectURL(new Blob([jsonArrData],
        { type: "application/json" }));

    a.setAttribute("download", fn);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    removeButtons();
}