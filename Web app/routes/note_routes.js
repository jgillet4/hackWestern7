const { data } = require("jquery");

module.exports = function (app, db) {
    app.post('/story', (req, res) => {
        var requestify = require("requestify");
        console.log("Got request");
        console.log("body is: ", req.body);
        // var r = JSON.parse(req.body);

        console.log("Line made from APP: " + req.body.m_prompt + " " + req.body.m_option);


        var postData = "";
        if (req.body.m_prompt == "START" && req.body.m_option == "START") {
            postData = "Once upon a time";
        } else {
            postData += req.body.m_prompt.toString() + " " + req.body.m_option.toString();
        }

        var newUrl = "http://xxxxxxxxxx";

        // make the request to the ML model. 

        // requestify.get('https://us-central1-calcium-centaur-296316.cloudfunctions.net/getModelPredictions')
        //     .then(function (response) {
        //         // response.getBody();
        //         console.log("IN get request");
        //         var d = JSON.parse(response.body);
        //         console.log(d);
        //         // console.log("fn:",d.firstName);
        //         // var resData = {
        //         //     "m_p": d.firstName,
        //         //     "m_o": d.lastName
        //         // }

        //         res.send(JSON.stringify(resData));
        //     })
        //     .catch(error => {
        //         console.log("ERROR>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        //         console.log(error)
        //     }
        //     );

        // requestify.post('https://us-central1-calcium-centaur-296316.cloudfunctions.net/getModelPredictions', {
        //     x : postData 
        // })
        //     .then(function (response) {
        //         // Get the response body
        //         console.log("Int POST request");
        //         var d = JSON.parse(response.body);
        //         console.log(d)
                
        //     }).catch(error =>{
        //         console.los("<<<<<<<<<<<<<ERROR>>>>>>>>>>");
        //         console.log(error);
        //     }
        //     );

        // SENDING 
        var data = {
            m_p: "hello world!",
            m_o: "I am a demo"
        }
        res.send(JSON.stringify(data));
    });
};