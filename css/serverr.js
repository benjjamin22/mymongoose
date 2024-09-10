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
const autoIncrement = require("mongoose-sequence")(mongoose);



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

//utoIncrement.initialize(mongoose.connection);

const NoteSchemer = new Schema({
    id: { type: String, default: () => uuidv4(), required: true },
    Aname: {
        Name: { type: String, uppercase: true },
        Mname: { type: String, uppercase: true },
        Surname: { type: String, uppercase: true }
    },
    School: { type: String, uppercase: true },
    Status: { type: String, uppercase: true },
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
    picturepath: { type: String },
    fullname: { type: String, uppercase: true },
    time: { type: String, uppercase: true },
    field: { type: Number},
    
},
{ field: false},);

NoteSchemer.plugin(autoIncrement, {inc_field:'field'})
//NoteSchemer.pre('save',function(){this.field = Math.round((Math.random()*10000000) + 1);});
//NoteSchemer.pre('save',function(next){
    //mongoose.model('Note',NoteSchemer).countDocuments(function(error,count){
       // if(error) return next(error);
        //this.field = count +1;
        //next();
    //});
//})

 //NoteSchemer.plugin(autoIncrement.plugin,{ model:'note',field:'dataid'});

const Note = mongoose.model("Note", NoteSchemer);

app.use('/public', express.static(__dirname + '/public'));

app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

async function uploadImageToGoogleDrive(file) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    const uuid = uuidv4() + '.jpg';
    const fileMetadata = {
        name: uuid,
        //name: file.originalname,
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

app.get('/detail', async(req, res) => {
    try {
        const data = await Note.find();
        res.json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/ASSA', async(req, res) => {
    try {
        const data = await Note.find();
        const dataa = data.filter(o => o.School === 'AMARAKU SECONDARY SCHOOL AMARAKU')
        res.json(dataa);
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/", upload.single('image'), async(req, res) => {
    try {
        const Pathoo = await uploadImageToGoogleDrive(req.file);
        const imagePath = 'https://benjjamin22.github.io/filter/utilitie/nuasa/nuasa1/' + Pathoo;

        function pad(n) {
            return n < 10 ? '0' + n : n;
        }

        // Get the current date and time
        const now = new Date();
        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1); // Months are zero-based
        const day = pad(now.getDate());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        // Format the date and time
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;


        let newNote = new Note({
            Aname: {
                Name: req.body.Name,
                Mname: req.body.Mname,
                Surname: req.body.Surname
            },
            School: req.body.School,
            Status: 'MEMBER',
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
            picturepath: imagePath,
            fullname: req.body.fullname,
            time: formattedDate,
            
        });


        await newNote.save();
        res.send(`<!DOCTYPE html><html><body><h1 style="font-size:6rem; margin-top:8rem;text-align: center;">SUCCESSFUL</h1>
   </html>`)
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