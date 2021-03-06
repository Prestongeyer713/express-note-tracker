const express = require("express");
const path = require("path");
const fs = require("fs");
var notes;
// set up express and server
const app = express();
const port = process.env.PORT || 4020;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// routes seperate files that make the app work
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "public/index.html"));
})
// saves a new note onto db file
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let notelength = (noteList.length).toString();

    newNote.id = notelength;
    noteList.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})



// deletes notes
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();
    
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});
// added listener
app.listen(port, function() {
    console.log(`Now listening to port ${port}. Lets jot some stuff down!`);
})
