require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
const axios = require('axios');
const { body } = require('express-validator');
const multer = require('multer');

//function keepServerAwaike() {
//  http.get('https://mymongoose.onrender.com', (res) => {
//    console.log(`Status Code: ${res.statusCode}`);
//}).on('error', (e) => {
//  console.error(`Error: ${e.message}`);
//});
//}

// Schedule the task to run every 5 minutes
//cron.schedule('*/14 * * * *', () => {
//  console.log('Sending keep-alive request to server...');
// keepServerAwaike();
//});



const serverUrl = 'https://mymongoose.onrender.com';

const keepAlive = () => {
    axios.get(serverUrl)
        .then(response => {
            console.log(`server response with status:${response.status}`)
        })
        .catch(error => {
            console.log(`error keeping server alive:${error.message}`)
        })
}


//function keepServerAwaike() {
//axios.get('https://mymongoose.onrender.com', (res) => {
// console.log(`Status Code: ${res.statusCode}`);
//}).on('error', (e) => {
//console.error(`Error: ${e.message}`);
//});
//}

//Schedule the task to run every 5 minutes
cron.schedule('*/14 * * * *', () => {
    console.log('Sending keep-alive request to server...');
    keepAlive();
});

console.log('Keep-alive script started.');



const app = express()
const PORT = process.env.PORT || 8000

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//const uid = function Generateuniquid() { return ('0000' + (Math.random() * (100000 - 101) + 101) | 0).slice(-5); }


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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
    obj: { type: String, default: () => uuidv4(), required: true },
    Aname: {
        Name: { type: String, uppercase: true },
        Mname: { type: String, uppercase: true },
        Surname: { type: String, uppercase: true }
    },
    School: { type: String, uppercase: true },
    Faculty: { type: String, uppercase: true },
    Dept: { type: String, uppercase: true },
    State: { type: String, uppercase: true },
    LocalGovt: { type: String, uppercase: true },
    RegNo: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    Sex: { type: String, uppercase: true },
    Validity: { type: String, uppercase: true },
    PhoneNo: { type: String, uppercase: true, },
    EmergencyNo: { type: String, uppercase: true },
    Facebook: { type: String, uppercase: true },
    Instagram: { type: String, uppercase: true },
    Tiktok: { type: String, uppercase: true },
    Twitter: { type: String, uppercase: true },
    picturepath: { type: String, uppercase: true },
    id: { type: String, uppercase: true },
    image: {
        data: Buffer,
        contentType: String
    }

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
            docs.id = counter + 1;
            next();
        });
});

const Note = mongoose.model("Note", NoteSchemer);

app.use('/public', express.static(__dirname + '/public'));

app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", upload.single('image'), (req, res) => {
    let newNote = new Note({
        Aname: {
            Name: req.body.Name,
            Mname: req.body.Mname,
            Surname: req.body.Surname
        },
        School: req.body.School,
        Faculty: req.body.Faculty,
        Dept: req.body.Dept,
        State: req.body.State,
        LocalGovt: req.body.LocalGovt,
        RegNo: req.body.RegNo,
        Bloodgroup: req.body.Bloodgroup,
        Sex: req.body.Sex,
        Validity: req.body.Validity,
        PhoneNo: req.body.PhoneNo,
        EmergencyNo: req.body.EmergencyNo,
        Facebook: req.body.Facebook,
        Instagram: req.body.Instagram,
        Tiktok: req.body.Tiktok,
        Twitter: req.body.Twitter,
        picturepath: '',
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        }

    });


    newNote.save();
    res.send(`<!DOCTYPE html><html><body><h1 style="font-size:8rem; margin-top:0rem;text-align: center;margin-top:10px;">SUCCESSFUL</h1>
    <h5 style="text-align: center;font-size:3.5rem;">Pls copy the number below to the back of your passport before submiting it
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