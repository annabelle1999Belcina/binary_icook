const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./controller/connectDb");
const login = require("./controller/login");
const insert = require("./controller/insert");
const verify = require("./controller/verify");
const user = require("./models/UserSchema");


const PORT = process.env.PORT || 3000;
//middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

// Database

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running in PORT..," + PORT);
});

app.get("/", (req, res) => {
    console.log("hello world!");
    res.send("API");
});
app.post("/login", (req, res) => {
    console.log(req.body);
    login.login(req.body, res);
});
app.get("/verify/:token", (req, res) => {
    verify.verify(req.params.token, res);
});

app.post("/insert", (req, res) => {
    insert.insert(req.body, res);
});

app.get("/user/retrieve", (req, res) => {
    user.find({}, (err, data) => {
        if (err) {
            return res.status(404).send("Error while getting list of services!");
        }
        return res.send({ data });
    });
});

app.post("/user/create", (req, res) => {
    const data = new user({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        gender: req.body.gender,
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
    });
    data.save(err => {
        if (err) return res.status(404).send({ message: err.message });
        return res.send({ data });
    });
});

app.post("/user/update/:id", (req, res) => {
    console.log(req.body);
    user.findByIdAndUpdate(
        req.params.id,//from database
        req.body,//from the front end
        { new: true },
        (err, data) => {
            if (err) return res.status(404).send({ error: err.message });
            return res.send({ message: "Service is successfully updated", data });
        }
    );
});

app.post('/user/delete/:id', (req, res) => {
    user.findByIdAndRemove(req.params.id, (err, data) => {
        if (err) return res.status(404).send({ error: err.message });
        return res.send({ message: 'Service is successfully deleted!', data })
    })
})

