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
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const NoteSchemer = {
    Name: { type: String, uppercase: true },
    Mname: { type: String, uppercase: true },
    Surname: { type: String, uppercase: true },
    School: { type: String, uppercase: true },
    Dept: { type: String, uppercase: true },
    RegNo: { type: String, uppercase: true },
    Status: { type: String, uppercase: true },
    bloodgroup: { type: String, uppercase: true },
    YearofAdmin: { type: String, uppercase: true },
    Validity: { type: String, uppercase: true },
    Sex: { type: String, uppercase: true },
    LocalGovernment: { type: String, uppercase: true },
    State: { type: String, uppercase: true },
    Phoneno1: { type: String, uppercase: true },
    Phoneno2: { type: String, uppercase: true }
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
        School: req.body.School,
        Dept: req.body.Dept,
        RegNo: req.body.RegNo,
        Status: req.body.Status,
        bloodgroup: req.body.bloodgroup,
        YearofAdmin: req.body.YearofAdmin,
        Validity: req.body.Validity,
        Sex: req.body.Sex,
        LocalGovernment: req.body.LocalGovernment,
        State: req.body.State,
        Phoneno1: req.body.Phoneno1,
        Phoneno2: req.body.Phoneno2
    })

    newNote.save();
    res.redirect("/");
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})