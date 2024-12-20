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
const { nanoid } = require("nanoid");
//const autoIncrement = require("mongoose-sequence")(mongoose);



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

var NoteSchemer = new Schema({
    id: { type: String, default: () => uuidv4(), required: true },
    Aname: {
        Name: { type: String, uppercase: true },
        Mname: { type: String, uppercase: true },
        Surname: { type: String, uppercase: true }
    },
    Ddateofbirth: {
        Day: { type: String, uppercase: true },
        Month: { type: String, uppercase: true },
        Year: { type: String, uppercase: true }
    },
    Status: { type: String, uppercase: true },
    School: { type: String, uppercase: true },
    YearofAdmin: { type: String, uppercase: true },
    Presentclass: { type: String, uppercase: true },
    DateofBirth: { type: String, uppercase: true },
    Gender: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    RegNo: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    ParentPhoneNo: { type: String, uppercase: true },
    ParentPhoneNo2: { type: String, uppercase: true },
    NIN: { type: String, uppercase: true, },
    HometownCommunity: { type: String, uppercase: true },
    picturepath: { type: String },
    client: { type: String },
    State: { type: String, uppercase: true },
    pin: { type: String, uppercase: true },
    pine: { type: String, uppercase: true },
    sn: { type: Number },
    time: { type: String, uppercase: true }
});

NoteSchemer.pre("save", function(next) {
    var docs = this;
    mongoose.model('Note', NoteSchemer).countDocuments()
        .then(function(counter) {
            docs.sn = counter + 1;
            next();
        });
});
var Note = mongoose.model("Note", NoteSchemer);

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
        //name: req.file.originalname,
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
        //fields: 'id, webContentLink',
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
        //const imagePath = `https://drive.google.com/uc?id=${file.data.id}`;
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
       // let _id_counter = 0
           // function uytd() {
           //=const ud = (_id_counter++).toString(36) + nanoid(10)
                //const uuido = nanoid(8) + ud
          //  }
           // const uuid = ud

       // const hashID = size => {
       // const MASK = 0x3d
       // const LETTERS = 'abcdefghjkmnpqrstuvwxyz'
       // const NUMBERS = '23456789'
       // const charset = `${NUMBERS}${LETTERS.toUpperCase()}`.split('')
       // const bytes = new Uint8Array(size)
       // crypto.getRandomValues(bytes)

       // return bytes.reduce((acc, byte) => `${acc}${charset[byte & MASK]}`, '')
        // }

        //const passo = hashID(6)
       let gen = n=> [...Array(n)].map(_=>Math.random()*10|0).join``

        // TEST: generate 6 digit number
        // first number can't be zero - so we generate it separatley
        let sixDigitStr = (1+Math.random()*9|0) + gen(9)
        let uuide = ( +(sixDigitStr) ) // + convert to num
        
        
        const uuid = nanoid(10);
            
        let newNote = new Note({
            Aname: {
                Name: req.body.Name,
                Mname: req.body.Mname,
                Surname: req.body.Surname
            },
            Ddateofbirth: {
                Day: req.body.Day,
                Month: req.body.Month + ',',
                Year: req.body.Year
            },
            School: req.body.School,
            Status: 'STUDENT',
            YearofAdmin: req.body.YearofAdmin,
            Presentclass: req.body.Presentclass,
            DateofBirth: req.body.DateofBirth,
            State: req.body.State,
            Gender: req.body.Gender,
            Bloodgroup: req.body.Bloodgroup,
            ParentPhoneNo: req.body.ParentPhoneNo,
            ParentPhoneNo2: req.body.ParentPhoneNo2,
            NIN: req.body.NIN,
            HometownCommunity: req.body.HometownCommunity,
            client: 'ISEC/NSSU/B/' + req.body.client + '.jpg',
            pin: uuid,
            pine: uuide,
            time: formattedDate            
        });


        await newNote.save();
        res.send(`<!DOCTYPE html><html><body><h1 style="font-size:6rem; margin-top:8rem;text-align: center;">SUCCESSFUL</h1>
           <h1 style="font-size:3rem; margin-top:0rem;text-align: center;">Name:${newNote.Aname.Name} ${newNote.Aname.Mname} ${newNote.Aname.Surname}</h1>
           <h1 style="font-size:3rem; margin-top:0rem;text-align: center;">this your id no:${newNote.pine} sn:${newNote.sn}</h1>
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
