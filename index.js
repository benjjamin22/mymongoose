const express = require("express");
const bodyparser = require("body-parser");
const jsonfile = require("jsonfile");
const db = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = process.env.PORT || 3000;


app.use(bodyparser.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/posts", (req, res) => {
    res.json(db);
});

app.get("/posts/:id", (req, res) => {
    let id = req.params.id;
    let post = db.find((post) => post.id == id);
    if (!post) {
        res.json({ Message: "Not Found Any Post Related to Your ID" });
    } else {
        res.json(post);
    }
});
app.get("/posts-c/:category", (req, res) => {
    let category = req.params.category;
    let posts = db.find((post) => post.category == category);
    if (!posts) {
        res.json({ message: `No posts found agains this category ${category}` });
    } else {
        res.json(posts);
    }
});
app.get("/posts-t/:tags", (req, res) => {
    let tags = req.params.tags;
    let posts = db.find((post) => post.tags.includes(tags));
    if (!posts) {
        res.json({ Message: `No Posts Found Against This Tag ${tags}` });
    } else {
        res.json(posts);
    }
});
app.get("/posts-title/:title", (req, res) => {
    let title = req.params.title;
    let posts = db.find((post) => post.title == title);
    if (!posts) {
        res.json({ Message: `No Posts Found Against This Tag ${title}` });
    } else {
        res.json(posts);
    }
});

app.get("/posts-author/:author", (req, res) => {
    let author = req.params.author;
    let posts = db.find((post) => post.author == author);
    if (!posts) {
        res.json({ Message: `No Posts Found Against This Tag ${author}` });
    } else {
        res.json(posts);
    }
});
app.get("/postform", (req, res) => {
    res.sendFile("views/postform.html", { root: __dirname });
});
app.get("/updateform", (req, res) => {
    res.sendFile("views/postupdate.html", { root: __dirname });
});
app.post("/newpost", (req, res) => {
    const newPost = {
        id: db.length + uuidv4(),
        Aname: [{
            FirstName: req.body.FirstName,
            MiddleName: req.body.MiddleName,
            Surname: req.body.Surname
        }],
        School: req.body.School,
        Dept: req.body.Dept,
        State: req.body.State,
        LocalGovt: req.body.LocalGovt,
        RegNo: req.body.RegNo,
        BloodGroup: req.body.BloodGroup,
        Sex: req.body.Sex,
        PhoneNo: req.body.PhoneNo,
        EmergencyNo: req.body.EmergencyNo,
    };
    db.push(newPost);
    jsonfile.writeFile("./db/db.json", db, (err) => {
        res.redirect("/");
    });
});

app.post("/updatepost", (req, res) => {
    let id = req.body.id;
    let post = db.find((post) => post.id == id);
    if (!post) {
        res.status(404).json({ message: "Not Found Any Post Related to Your ID" });
    } else {
        post.title = req.body.title;
        post.content = req.body.content;
        post.category = req.body.category;
        post.tags = req.body.tags.split(",");
        jsonfile.writeFile("./db/db.json", db, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error writing to database" });
            } else {
                res.json({
                    message: `Post updated successfully! Your Post Id is ${id} `,
                });
            }
        });
    }
});

app.get("/deletepost/:id", (req, res) => {
    let id = req.params.id;
    let post = db.find((post) => post.id == id);
    if (!post) {
        res.status(404).json({ message: "Not Found Any Post Related to Your ID" });
    } else {
        let index = db.indexOf(post);
        db.splice(index, 1);
        jsonfile.writeFile("./db/db.json", db, (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ message: "Error writing to database" });
            } else {
                res.json({
                    message: `Post deleted successfully! Your Post Id is ${id} `,
                });
            }
        });
    }
});

app.listen(port, () => {
    console.log(`${port} is running...`);
});