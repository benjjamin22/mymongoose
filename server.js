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
    Name: String,
    Mname: String,
    Surname: String,
    School: String,
    Dept: String,
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
        School: req.body.School,
        Dept: req.body.Dept,
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
    res.send('data received, COPY THIS TO THE BACK OF YOUR PASSPORT:\n' + JSON.stringify(req.body.Name, req.body.Phoneno1));
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})