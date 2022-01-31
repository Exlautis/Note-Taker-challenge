const express = require('express');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const app = express();
const path = require('path');
const db = path.join(__dirname, '/db');
const mainPath = path.join(__dirname, '/public');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/noted', function(req, res) {
    res.sendFile(path.join(mainPath, 'notes.html'));
});

app.get('/api/notes', function(req, res) {
    res.sendFile(path.join(db, 'db.json'))
    return res.body
});

app.get('*', function(req, res) {
    res.sendFile(path.join(mainPath, 'index.html'));
});

app.post('/api/notes', function(req, res) {
    const savedNotes = JSON.parse(fs.readFileSync('./db/db.json'));
    const newNote = req.body;

    var noteId = (savedNotes.length.toString());
    newNote.id =noteId;

    fs.writeFileSync('db/db/.json', JSON.stringify(savedNotes));

    res.json(savedNotes);

});

app.delete('/api/notes/:id', function(req, res) {
    var savedNotes = JSON.parse(fs.readFileSync('./db/db.json'));
    var noteID = req.params.id;
    var newID = 0;

    savedNotes= savedNotes.filter(currentNote => {
        return currentNote.id != noteID;
    })

    for (currentNote of savedNotes) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
    return res.json(savedNotes);
});

app.listen(PORT, function() {
    console.log('app listing on PORT ' + PORT);
});