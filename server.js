require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');



const app = express()
const PORT = process.env.PORT || 8000

//const uid = function Generateuniquid() { return ('0000' + (Math.random() * (100000 - 101) + 101) | 0).slice(-5); }

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

const NoteSchemer = new Schema({
    id: { type: String, default: () => uuidv4(), required: true },
    Aname: [{
        Name: { type: String, uppercase: true },
        Mname: { type: String, uppercase: true },
        Surname: { type: String, uppercase: true }
    }],
    School: { type: String, uppercase: true },
    Dept: { type: String, uppercase: true },
    State: { type: String, uppercase: true },
    LocalGovt: { type: String, uppercase: true },
    RegNo: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    Sex: { type: String, uppercase: true },
    PhoneNo: { type: String, uppercase: true, unique: true, required: true },
    EmergencyNo: { type: String, uppercase: true },
    picturepath: { type: String, uppercase: true },
    pi: { type: String, uppercase: true }

});
NoteSchemer.pre("save", function(next) {
    var docs = this;
    mongoose.model('Note', NoteSchemer).countDocuments()
        .then(function(counter) {
            docs.picturepath = counter + 1;
            next();
        });
});
NoteSchemer.pre("save", function(next) {
    var docs = this;
    mongoose.model('Note', NoteSchemer).countDocuments()
        .then(function(counter) {
            docs.pi = counter + 1;
            next();
        });
});

const Note = mongoose.model("Note", NoteSchemer);

app.use('/public', express.static(__dirname + '/public'));

app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", async(req, res) => {
    let newNote = new Note({
        Aname: [{
            Name: req.body.Name,
            Mname: req.body.Mname,
            Surname: req.body.Surname
        }],
        School: req.body.School,
        Dept: req.body.Dept,
        State: req.body.State,
        LocalGovt: req.body.LocalGovt,
        RegNo: req.body.RegNo,
        Bloodgroup: req.body.Bloodgroup,
        Sex: req.body.Sex,
        PhoneNo: req.body.PhoneNo,
        EmergencyNo: req.body.EmergencyNo,
        picturepath: '',

    });


    await newNote.save();
    res.send(`<!DOCTYPE html><html><body><h1 style="font-size:8rem; margin-top:0rem;text-align: center;">SUCCESSFUL</h1>
    <h5 style="text-align: center;font-size:4rem;">copy number below to the back of your passport before submiting it
    </h5><h1 style="font-size:20rem; margin:20rem;margin-bottom:0rem;text-align:center;">${newNote.picturepath}</h1>
    </body></html>`)
        //res.json({message: `Post added successfully! Your Post Id is ${newPost.id}`,});
        //res.redirect("/"); <h1 style="font-size:5rem; margin-top:0rem;text-align: center;">${newNote.EmergencyNo}</h1>
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});