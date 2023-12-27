const express = require('express');
const fs = require('fs');
const db = require('./database.json');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid')

const app = express();



// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set static folder
app.use(express.static(('public')));

// Members API Routes
app.post('/ub', (req, res) => {
    const newMember = {
        id: uuidv4(),
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
        EmergencyNo: req.body.EmergencyNo
    };
    let jsonData = [];

    const filedata = fs.readFileSync('database.json', 'utf8');
    jsonData = JSON.parse(filedata);
    jsonData.push(newMember);
    fs.writeFileSync('database.json', JSON.stringify(jsonData, null, 2), 'utf8');
    res.json(newMember);
    //res.redirect('/');
});

app.get("/postsgg", (req, res) => {
    res.json(db);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));