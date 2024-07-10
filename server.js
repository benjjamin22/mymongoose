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
const { google } = require('googleapis');
const fs = require('fs');
const stream = require("stream");


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

// Google Drive API setup

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

const oauth2Client = new google.auth.OAuth2(
    '299799989715-9j5t32aoriem1chgjkd1d91vleh9njni.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: '1//04SleHQlO68aLCgYIARAAGAQSNwF-L9IrZKYFd3YWazjkliZA_Z3tO98_P1q76Eb-_zLAugY-fN2A6M0kHNABfJL9OEnrB90YC3c' });

const drive = google.drive({ version: 'v3', auth: oauth2Client });


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
    keepAlive;
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
    Facebook: { type: String },
    Instagram: { type: String },
    Tiktok: { type: String },
    Twitter: { type: String },
    picturepath: { type: String, uppercase: true },
    id: { type: String, uppercase: true },
    image: { type: String }

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
});

async function uploadImageToGoogleDrive(file) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    const uuid ='myma'+ uuidv4() + '.jpg';
    const fileMetadata = {
        name: uuid,
        parents: ["10KpoRo-jHT62ko_7BNH9khxA2S_6GY42"],
    };

    const media = {
        mimeType: file.mimetype,
        body: bufferStream
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name'
    });

    return response.data.name
}

app.post("/", upload.single('image'), async(req, res) => {
    try {
        const imagePath = await uploadImageToGoogleDrive(req.file );

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
            image: imagePath,
            picturepath: ''


        });


        await newNote.save();
        res.send(`<!DOCTYPE html><html><body><h1 style="font-size:8rem; margin-top:0rem;text-align: center;margin-top:10px;">SUCCESSFUL</h1>
    <h5 style="text-align: center;font-size:3.5rem;">Pls copy the number below to the back of your passport before submiting it
    </h5><h1 style="font-size:20rem; margin:20rem;margin-bottom:0rem;text-align:center;">${newNote.picturepath}</h1>
    </body></html>`)
    } catch (error) {
        res.status(500).send('Error saving data');
    } //finally {
    //fs.unlinkSync(req.file.path); // Clean up the uploaded file
    //}
    //res.json({message: `Post added successfully! Your Post Id is ${newPost.id}`,});
    //res.redirect("/"); <h1 style="font-size:5rem; margin-top:0rem;text-align: center;">${newNote.EmergencyNo}</h1>
})



connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});
