module.exports = function (app, db) {
    app.post('/story', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "null");
        console.log(req.body);
        var data = {
            m_p: "don't hug me i'm scared",
            m_o: "Please leave princess mario "
        }
        console.log(data.m_p);
        res.send(data)
    });
};