require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express()
const PORT = process.env.PORT || 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);


const NoteSchemer = {
    Name: String,
    Mname: String,
    Surname: String,
    RegNo: String,
    Status: String,
    bloodgroup: String,
    YearofAdmin: String,
    Sex: String,
    LocalGovernment: String,
    State: String,
    Phoneno1: String,
    Phoneno2: String
}

const Note = mongoose.model("Note", NoteSchemer);

app.use('/public', express.static(__dirname + '/public'));

app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    let newNote = new Note({

        Name: req.body.Name,
        Mname: req.body.Mname,
        Surname: req.body.Surname,
        RegNo: req.body.RegNo,
        Status: req.body.Status,
        bloodgroup: req.body.bloodgroup,
        YearofAdmin: req.body.YearofAdmin,
        Sex: req.body.Sex,
        LocalGovernment: req.body.LocalGovernment,
        State: req.body.State,
        Phoneno1: req.body.Phoneno1,
        Phoneno2: req.body.Phoneno2
    })

    newNote.save();
    res.redirect("/");
})

app.listen(PORT, () => {
    console.log("listening for requests");
})